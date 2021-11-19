import CoverQuote from "../domain/CoverQuote";
import NetConfig from "../config/NetConfig";
import GasHelper from "../helpers/gasHelper";
import RiskCarriers from "../config/RiskCarriers";
import {_getDistributorsContract, _getBridgeRegistryContract, _getBridgePolicyBookRegistryContract, _getBridgePolicyBookContract} from "../helpers/getContract";
import BigNumber from 'bignumber.js'
import {toBN} from 'web3-utils'


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
  _bridgeProductAddress:any,
  _period:any,
  _amountInWei:any,

) : Promise<any>  {
  // return await

    const registry = _getBridgeRegistryContract(NetConfig.netById(global.user.networkId).bridgeRegistry, global.user.web3)
    const policyBookRegistry = await registry.methods.getPolicyBookRegistryContract().call().then((policyBookRegistryAddr:any) => {
      return _getBridgePolicyBookRegistryContract(policyBookRegistryAddr,global.user.web3);
    })

    const isPolicyPresent  = await policyBookRegistry.methods.isPolicyBook(_bridgeProductAddress).call();
    if(isPolicyPresent){
      const policyBookContract = await _getBridgePolicyBookContract(_bridgeProductAddress, global.user.web3);
      const policyBookContractArray:any = Array.of(policyBookContract._address);

      const _stats = await policyBookRegistry.methods.stats(policyBookContractArray).call();

      let capacity = _stats[0].maxCapacity;
      let remainingCapacity = capacity;
      let stakedSTBL = _stats[0].stakedSTBL;
      // const {gasPrice, USDRate} = await getGasPrice(web3);
      // const {gasPrice, USDRate} = await GasHelper.getGasPrice(global.user.web3);

      // let estimatedGasPrice = (RiskCarriers.BRIDGE.description.estimatedGas * gasPrice) * USDRate / (10**9);
      // let feeInDefaultCurrency = (RiskCarriers.BRIDGE.description.estimatedGas * gasPrice) / 10**9;
      let defaultCurrencySymbol = NetConfig.networkCurrency(global.user.networkId);
      const bridgeEpochs = Math.min(52, Math.ceil(Number(_period) / 7));

      const {totalSeconds, totalPrice} =  await policyBookContract.methods.getPolicyPrice(bridgeEpochs, _amountInWei).call();
      const totalLiquidity  = await policyBookContract.methods.totalLiquidity().call();
      const coverTokens = await policyBookContract.methods.totalCoverTokens().call();

      const actualPeriod = Math.floor(Number(totalSeconds) / 3600 / 24);

      return{
        _stats : _stats,
        amount: _amountInWei,
        currency: defaultCurrencySymbol,
        period : _period,
        actualPeriod : actualPeriod,
        chain: "ETH",
        chainId: global.user.networkId,
        price: totalPrice,
        pricePercent: new BigNumber(totalPrice).times(1000).dividedBy(_amountInWei).dividedBy(new BigNumber(actualPeriod)).times(365).times(100).toNumber() / 1000, //%, annualize
        // estimatedGasPrice: estimatedGasPrice,
        estimatedGasPriceCurrency: defaultCurrencySymbol,
        // estimatedGasPriceDefault: feeInDefaultCurrency,
        totalUSDTLiquidity: toBN(totalLiquidity),
        maxCapacity: _stats[0].maxCapacity,
        stakedSTBL: _stats[0].stakedSTBL,
        activeCovers: toBN(coverTokens),
        utilizationRatio: toBN(coverTokens).mul(toBN(10000)).div(toBN(totalLiquidity)).toNumber() / 100,
       }
    }



}


export default {getQuote, getQuoteFromBridge };
