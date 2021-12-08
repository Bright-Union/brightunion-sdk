import NetConfig from "../config/NetConfig";
import {_getDistributorsContract, _getBridgeRegistryContract, _getBridgePolicyBookRegistryContract, _getBridgePolicyBookContract} from "../helpers/getContract";
import BigNumber from 'bignumber.js'
import {toBN , fromWei} from 'web3-utils'
import GasHelper from "../helpers/gasHelper"
import RiskCarriers from "../config/RiskCarriers"
import CurrencyHelper from "../helpers/currencyHelper"

/**
 * Returns a quotation for specified distributor.
 *
 * @remarks
 * This function takes different params based on the intended
 * distributor, please refer to README file of the package or the protocol
 * for the parameters table.
 * Parameters not used by a distributor need to be named
 * interface compliant and filled with its spec type.
 *
 * @param _web3 - Web3 Instance
 * @param _distributorName - Name of distributor in lower case
 * @param _sumAssured - The total sum assured
 * @param _coverPeriod - The duration of the cover in days
 * @param _contractAddress - Address of the cover contract
 * @param _interfaceCompliant1 - Arbitrary value type number
 * @param _interfaceCompliant2 - Arbitrary value type number
 * @param _data - The encoded data params
 * @returns A detailed quote
 *
 * @beta
 */
export async function getQuote(
    _distributorName : string,
    _period : any,
    _sumAssured : any,
    _contractAddress : string,
    _interfaceCompliant1 : string,
    _interfaceCompliant2 : string,
    _data : any,
) : Promise<any>  {
  return await _getDistributorsContract() // SDK
                      .methods
                      .getQuote(
                        _distributorName,
                        _period,
                        _sumAssured,
                        _contractAddress,
                        _interfaceCompliant1,
                        _interfaceCompliant2,
                        _data
                      ).call();
}

export async function getQuoteFromBridge(
  _protocol:any,
  // _bridgeProductAddress:any,
  _period:any,
  _amountInWei:any,
  _currency:string,
  _initialBridgeCurrency:any,

) : Promise<any>  {

    const registry = _getBridgeRegistryContract(NetConfig.netById(global.user.ethNet.networkId).bridgeRegistry, global.user.ethNet.web3Instance)

    const policyBookRegistry = await registry.methods.getPolicyBookRegistryContract().call().then((policyBookRegistryAddr:any) => {
      return _getBridgePolicyBookRegistryContract(policyBookRegistryAddr, global.user.ethNet.web3Instance );
    })

    const isPolicyPresent  = await policyBookRegistry.methods.isPolicyBook(_protocol.bridgeProductAddress).call();
    if(isPolicyPresent){
      const policyBookContract = await _getBridgePolicyBookContract(_protocol.bridgeProductAddress, global.user.ethNet.web3Instance );
      const policyBookContractArray:any = Array.of(policyBookContract._address);
      let capacity:any = '';
      let remainingCapacity:any = '';
      let stakedSTBL:any = '';

      // const _stats = await
       return await policyBookRegistry.methods.stats(policyBookContractArray).call().then(async(_stats:any) => {
        capacity = _stats[0].maxCapacity;
        remainingCapacity = capacity;
        stakedSTBL = _stats[0].stakedSTBL;

        const bridgeEpochs = Math.min(52, Math.ceil(Number(_period) / 7));

        const {totalSeconds, totalPrice} =  await policyBookContract.methods.getPolicyPrice(bridgeEpochs, _amountInWei).call();
        const actualPeriod = Math.floor(Number(totalSeconds) / 3600 / 24);
        const pricePercent = new BigNumber(totalPrice).times(1000).dividedBy(_amountInWei).dividedBy(new BigNumber(actualPeriod)).times(365).times(100).toNumber() / 1000;

        global.events.emit("quote" , {
          status: "INITIAL_DATA" ,
          distributorName:"bridge",
          price: totalPrice ,
          pricePercent:pricePercent,
          amount:_amountInWei,
          currency:_currency,
          period:_period,
          actualPeriod:actualPeriod,
          protocol:_protocol,
          chain: 'ETH',
          chainId: global.user.ethNet.networkId,
          rawData: _stats,
        } );

        const {gasPrice, USDRate} = await GasHelper.getGasPrice(global.user.ethNet.symbol);

        const estimatedGasPrice = (RiskCarriers.BRIDGE.description.estimatedGas * gasPrice) * USDRate / (10**9);
        const feeInDefaultCurrency = (RiskCarriers.BRIDGE.description.estimatedGas * gasPrice) / 10**9;

        const totalLiquidity  = await policyBookContract.methods.totalLiquidity().call();
        const coverTokens = await policyBookContract.methods.totalCoverTokens().call();


        return{
          _stats : _stats,
          amount: _amountInWei,
          currency: _currency,
          period : _period,
          actualPeriod : actualPeriod,
          chain: "ETH",
          chainId: global.user.ethNet.networkId,
          price: totalPrice,
          pricePercent: pricePercent, //%, annualize
          estimatedGasPrice: estimatedGasPrice,
          estimatedGasPriceCurrency: _currency,
          estimatedGasPriceDefault: feeInDefaultCurrency,
          totalUSDTLiquidity: toBN(totalLiquidity),
          maxCapacity: _stats[0].maxCapacity,
          remainingCapacity: _stats[0].maxCapacity,
          stakedSTBL: _stats[0].stakedSTBL,
          activeCovers: toBN(coverTokens),
          utilizationRatio: toBN(coverTokens).mul(toBN(10000)).div(toBN(totalLiquidity)).toNumber() / 100,
         }


      }).catch((e:any) => {

        let errorMsg = e.message;
        if(_initialBridgeCurrency === 'ETH') {
          capacity = CurrencyHelper.usd2eth(capacity);
          _currency = "ETH"
        }
        if (errorMsg.toLowerCase().includes("requiring more than there exists")) {
          errorMsg = {message: "MAX capacity is " , currency:_initialBridgeCurrency, capacity:fromWei(capacity.toString()), errorType: "capacity"};
        } else if (errorMsg.toLowerCase().includes("pb: wrong epoch duration")) {
          errorMsg = { message: "Minimum duration is 1 day. Maximum is 365" , errorType:"period"};
        } else if (errorMsg.toLowerCase().includes("pb: wrong cover")) {
          errorMsg = { message: "Invalid cover amount" , errorType: "amount"};
        }

        return {
            amount: _amountInWei,
            currency: _currency,
            period: _period,
            chain: 'ETH',
            chainId: global.user.ethNet.networkId,
            price: 0,
            pricePercent: 0,
            estimatedGasPrice: 0,
            errorMsg: errorMsg,
            maxCapacity: remainingCapacity,
            stakedSTBL: stakedSTBL,
          };

      });


    }

}


export default {getQuote, getQuoteFromBridge };
