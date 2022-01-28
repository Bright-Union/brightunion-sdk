import NetConfig from "../config/NetConfig";
import {_getDistributorsContract,
  _getBridgeRegistryContract,
  _getBridgePolicyBookRegistryContract,
  _getBridgePolicyBookContract,

  _getBridgeV2PolicyBookRegistryContract,
  _getBridgeV2PolicyQuoteContract,
  _getBridgeV2RegistryContract,
  _getBridgeV2PolicyBookContract,

} from "../helpers/getContract";
import BigNumber from 'bignumber.js'
import {toBN , fromWei} from 'web3-utils'
import GasHelper from "../helpers/gasHelper"
import RiskCarriers from "../config/RiskCarriers"
import CurrencyHelper from "../helpers/currencyHelper"
import {getCoverMin} from "../helpers/cover_minimums"
import CatalogHelper from '../helpers/catalogHelper';


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



export async function getQuoteFromBridgeV2(
  _protocol:any,
  _period:any,
  _bridgeEpochs:any,
  _amountInWei:any,
  _currency:string,
  _initialBridgeCurrency:any,

) : Promise<any>  {

    const registryV2 = _getBridgeV2RegistryContract(NetConfig.netById(global.user.ethNet.networkId).bridgeV2Registry, global.user.ethNet.web3Instance)

    const policyBookRegistryV2 = await registryV2.methods.getPolicyBookRegistryContract().call().then((policyBookRegistryAddr:any) => {
      return _getBridgeV2PolicyBookRegistryContract(policyBookRegistryAddr, global.user.ethNet.web3Instance );
    })

    const isPolicyPresentV2  = await policyBookRegistryV2.methods.isPolicyBook(_protocol.bridgeProductAddress).call();

    if(isPolicyPresentV2){
      let capacity:any = '';
      const minimumAmount = getCoverMin("bridge", global.user.ethNet.symbol, _currency );
      let totalSeconds:any;
      let totalPrice:any;
      let errorMsg:any = null;
      let rawPriceData:any = null;

      await policyBookRegistryV2.methods.getPoliciesPrices( [ _protocol.bridgeProductAddress ] , [ _bridgeEpochs ] , [ _amountInWei ] ).call()
      .then((_priceData: any) => {

        rawPriceData = _priceData;
        totalPrice = _priceData._allowances[0];
        totalSeconds =  _priceData._durations[0];

      }).catch((e:any) => {

        errorMsg = e.message;

        if(_initialBridgeCurrency === 'ETH') {
          capacity = CurrencyHelper.usd2eth(capacity);
          _currency = "ETH"
        }
        if (errorMsg.toLowerCase().includes("requiring more than there exists")) {
          errorMsg = {message: "Maximum available capacity is " , currency:_initialBridgeCurrency, capacity:fromWei(capacity.toString()), errorType: "capacity"};
        } else if (errorMsg.toLowerCase().includes("pb: wrong epoch duration")) {
          errorMsg = { message: "Minimum duration is 1 day. Maximum is 365" , errorType:"period"};
        } else if (errorMsg.toLowerCase().includes("pb: wrong cover")) {
          errorMsg = { message: "Invalid cover amount" , errorType: "amount"};
        }

      });

      let actualPeriod = Math.floor(Number(totalSeconds) / 3600 / 24);
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
        rawData: rawPriceData,
        errorMsg: errorMsg,
        minimumAmount: minimumAmount,
      });

      // let errorMsg = null;
      if(_period > 365){
        errorMsg = { message: "Minimum duration is 1 day. Maximum is 365" , errorType:"period"};
        actualPeriod = _period;
      }

      let stats:any = {};
      let quote:any = {};

      if(_protocol.rawDataBridge){
        stats = {
          totalUSDTLiquidity: _protocol.rawDataBridge.totalUSDTLiquidity,
          maxCapacity: _protocol.rawDataBridge.maxCapacity,
          stakedSTBL:  _protocol.rawDataBridge.stakedSTBL,
          activeCovers:  _protocol.rawDataBridge.activeCovers,
          utilizationRatio:  _protocol.rawDataBridge.utilizationRatio,
        }
      }else{
        await policyBookRegistryV2.methods.stats(_protocol.bridgeProductAddress).call().then(async(_stats:any) => {
          stats =  {
            totalUSDTLiquidity: toBN(_stats[3]),
            remainingCapacity:_stats[3],
            maxCapacity: _stats[3],
            stakedSTBL: _stats[6],
          }
        })
      }

    quote = CatalogHelper.quoteFromCoverable(
        'bridge',
        _protocol,
        {
          amount: _amountInWei,
          currency: _currency,
          period: _period,
          chain: "ETH",
          chainId:  global.user.ethNet.networkId,
          actualPeriod: actualPeriod,
          price: totalPrice,
          response: stats,
          pricePercent: pricePercent, //%, annualize
          errorMsg: errorMsg,
          rawData: rawPriceData,
          minimumAmount: minimumAmount,
        },
        stats
      );

      return quote;

    }else{
      return {error: "This Bridge product is not whitelisted"}
    }

}


export async function getQuoteFromBridge(//out after BridgeV2
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

      const minimumAmount = getCoverMin("bridge", global.user.ethNet.symbol, _currency );

      // const _stats = await
       return await policyBookRegistry.methods.stats(policyBookContractArray).call().then(async(_stats:any) => {
        capacity = _stats[0].maxCapacity;
        remainingCapacity = capacity;
        stakedSTBL = _stats[0].stakedSTBL;

        const bridgeEpochs = Math.min(52, Math.ceil(Number(_period) / 7));

        const {totalSeconds, totalPrice} =  await policyBookContract.methods.getPolicyPrice(bridgeEpochs, _amountInWei).call();
        let actualPeriod = Math.floor(Number(totalSeconds) / 3600 / 24);
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
          minimumAmount: minimumAmount,
        } );

        const {gasPrice, USDRate} = await GasHelper.getGasPrice(global.user.ethNet.symbol);

        const estimatedGasPrice = (RiskCarriers.BRIDGE.description.estimatedGas * gasPrice) * USDRate / (10**9);
        const feeInDefaultCurrency = (RiskCarriers.BRIDGE.description.estimatedGas * gasPrice) / 10**9;

        const totalLiquidity  = await policyBookContract.methods.totalLiquidity().call();
        const coverTokens = await policyBookContract.methods.totalCoverTokens().call();

        let errorMsg = null;
        if(_period > 365){
          errorMsg = { message: "Minimum duration is 1 day. Maximum is 365" , errorType:"period"};
          actualPeriod = _period;
        }

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
          minimumAmount: minimumAmount,
          errorMsg: errorMsg,
         }

      }).catch((e:any) => {

        let errorMsg = e.message;
        if(_initialBridgeCurrency === 'ETH') {
          capacity = CurrencyHelper.usd2eth(capacity);
          _currency = "ETH"
        }
        if (errorMsg.toLowerCase().includes("requiring more than there exists")) {
          errorMsg = {message: "Maximum available capacity is " , currency:_initialBridgeCurrency, capacity:fromWei(capacity.toString()), errorType: "capacity"};
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
          minimumAmount: minimumAmount,
        };

      });


    }

}


export default {getQuote, getQuoteFromBridge, getQuoteFromBridgeV2 };
