import NetConfig from "../config/NetConfig";
import {_getDistributorsContract,

  _getBridgeV2PolicyBookRegistryContract,
  _getBridgeV2PolicyQuoteContract,
  _getBridgeV2RegistryContract,
  _getBridgeV2PolicyBookContract,

} from "../helpers/getContract";
import BigNumber from 'bignumber.js'
import {toBN , fromWei} from 'web3-utils'
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
  return await _getDistributorsContract(global.user.web3) // SDK
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
      const minimumAmount = getCoverMin("bridge", global.user.ethNet.symbol, _currency );
      let totalSeconds:any = 0;
      let totalPrice:any = 0;
      let errorMsg:any = null;
      let rawPriceData:any = null;

      let stats:any = {};

      if(_protocol.rawDataBridge){
        stats = {
          totalUSDTLiquidity: toBN(_protocol.rawDataBridge[3]),
          maxCapacity: _protocol.rawDataBridge[3],
          remainingCapacity:_protocol.rawDataBridge[4],
          stakedSTBL:  _protocol.rawDataBridge[6],
          utilizationRatio:  _protocol.rawDataBridge.utilizationRatio,
          activeCovers:  _protocol.rawDataBridge.activeCovers,
        }
      }else{
        await policyBookRegistryV2.methods.stats(_protocol.bridgeProductAddress).call().then((_stats:any) => {

          stats =  {
            totalUSDTLiquidity: toBN(_stats[3]),
            remainingCapacity:_stats[3],
            maxCapacity: _stats[3],
            stakedSTBL: _stats[6],
          }
        }, (error:any) => {
          console.error("policyBookRegistryV2 - " , error);
        })
      }

      let quote:any = CatalogHelper.quoteFromCoverable(
        'bridge',
        _protocol,
        {
          status: "INITIAL_DATA" ,
          amount: _amountInWei,
          currency: _currency,
          period: _period,
          chain: "ETH",
          protocol:_protocol,
          chainId:  global.user.ethNet.networkId,
          errorMsg: errorMsg,
          minimumAmount: minimumAmount,
        },
        stats
      );

      let capacity:any = stats.maxCapacity ? stats.maxCapacity : 0;

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
          errorMsg = {message: "Maximum available capacity is " , currency:_initialBridgeCurrency, capacity: fromWei(capacity.toString()), errorType: "capacity"};
        } else if (errorMsg.toLowerCase().includes("pb: wrong epoch duration")) {
          errorMsg = { message: "Minimum duration is 1 day. Maximum is 365" , errorType:"period"};
        } else if (errorMsg.toLowerCase().includes("pb: wrong cover")) {
          errorMsg = { message: "Invalid cover amount" , errorType: "amount"};
        }

      });

      let actualPeriod = Math.floor(Number(totalSeconds) / 3600 / 24);

      quote.errorMsg = errorMsg;
      quote.capacity = capacity;

      if(_period > 365){
        errorMsg = { message: "Minimum duration is 1 day. Maximum is 365" , errorType:"period"};
        actualPeriod = _period;
      }

      quote.rawData = rawPriceData;
      quote.price = totalPrice;
      const pricePercent = new BigNumber(totalPrice).times(1000).dividedBy(_amountInWei).dividedBy(new BigNumber(actualPeriod)).times(365).times(100).toNumber() / 1000;
      quote.pricePercent = pricePercent;
      quote.actualPeriod = actualPeriod;

      global.events.emit("quote" , quote);

      quote.status = "FINAL_DATA";

      return quote;

    }else{
      return {error: "This Bridge product is not whitelisted"}
    }

}


export default {getQuote, getQuoteFromBridgeV2 };
