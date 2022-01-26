import NexusApi from './distributorsApi/NexusApi';
import InsuraceApi from './distributorsApi/InsuraceApi';
import { getQuote, getQuoteFromBridge, getQuoteFromBridgeV2 } from "./dao/Quotes";
import CatalogHelper from './helpers/catalogHelper';
import NetConfig from '../service/config/NetConfig';
import CurrencyHelper from './helpers/currencyHelper';
import RiskCarriers from './config/RiskCarriers';
import BigNumber from 'bignumber.js'
import { toWei, hexToBytes, numberToHex } from "web3-utils"
import {getCoverMin} from "./helpers/cover_minimums"
import GoogleEvents from './config/GoogleEvents';
import BridgeHelper from './distributorsApi/BridgeHelper';


/**
 *
 * Generci call, which will return an array of quotes from all supported distributors
 *
 * @param _amount
 * @param _currency
 * @param _period
 * @param _protocol
 * @returns Array of quotes from all supported distributors
 */

export async function getQuotes(
  _amount:number,
  _currency:string, // coverAddress for bridge
  _period: number,
  _protocol:any

): Promise<any[]> {
  const quotesPromiseArray = [];

  GoogleEvents.quote( {_amount, _currency, _period, _protocol } , "getQuotes")

  quotesPromiseArray.push(getQuoteFrom('nexus', _amount, _currency, _period, _protocol))
  quotesPromiseArray.push(getQuoteFrom('insurace' , _amount, _currency, _period, _protocol))
  quotesPromiseArray.push(getQuoteFrom('bridge' , _amount, _currency, _period, _protocol))
  // quotesPromiseArray.push(getQuoteFrom('bridgeV2' , _amount, _currency, _period, _protocol))

  for (let net of global.user.web3Passive) {
    quotesPromiseArray.push( getInsuraceQuote(net , _amount, _currency, _period, _protocol))
  }

  return Promise.all(quotesPromiseArray).then((data:any) => {
    const allQuotes:object[] = data.filter((q:any) => { if(q)return q });

    return allQuotes;
  })

}

/**
 *
 * Get Quote from specific Distributor
 *
 * @param _distributorName
 * @param _amount
 * @param _currency
 * @param _period
 * @param _protocol
 * @returns Distributor Quote
 */
export async function getQuoteFrom(
                                    _distributorName:string,
                                    _amount:number,
                                    _currency:string, // coverAddress for bridge
                                    _period: number,
                                    _protocol:any
    ): Promise<object> {

      GoogleEvents.quote( {_amount, _currency, _period, _protocol, _distributorName } , "getQuoteFrom")

  if(_distributorName == 'bridge'){
    return await getBridgeV2Quote( _amount,_currency,_period,_protocol);
    // return await getBridgeQuote(_amount,_currency,_period,_protocol);
  }else if(_distributorName == 'nexus'){
    return await getNexusQuote(_amount,_currency,_period,_protocol );
  }else if(_distributorName == 'insurace'){
    return await getInsuraceQuote( global.user.web3 , _amount,_currency,_period,_protocol);
  }else {
    return  {error: 'supported distributor names are: bridge, insurace, nexus'}
  }
}

/**
 *  Hard coding only interface compliant since they are CONSTANTS
 *
 * @param _amount
 * @param _period
 * @param _protocol
 * @returns
 */
 async function getBridgeQuote(_amount :any, _currency:any, _period :any, _protocol :any ) : Promise<object>{

   if (CatalogHelper.availableOnNetwork(global.user.ethNet.networkId, 'BRIDGE_MUTUAL')) {
     if(_protocol.bridgeProductAddress){

       let amountInWei:any = toWei(_amount.toString(), 'ether');
       let initialBridgeCurrency: any = "USD"
       if (_currency === 'ETH') {
         amountInWei = CurrencyHelper.eth2usd(amountInWei);
         initialBridgeCurrency = 'ETH';
       }
       _currency = RiskCarriers.BRIDGE.fallbackQuotation;

       const bridgeEpochs = Math.min(52, Math.ceil(Number(_period) / 7));

       let quote:any = {}

       if(global.user.ethNet.networkId == 1 ){

         quote = await getQuoteFromBridge(
           _protocol,
           _period,
           amountInWei,
           _currency,
           initialBridgeCurrency,
         );

         return CatalogHelper.quoteFromCoverable(
           'bridge',
           _protocol,
           {
             amount: amountInWei,
             currency: _currency,
             period: _period,
             chain: quote.chain,
             chainId: quote.chainId,
             actualPeriod: quote.actualPeriod,
             price: quote.price,
             response: quote._stats,
             pricePercent: quote.pricePercent, //%, annualize
             estimatedGasPrice: quote.estimatedGasPrice,
             defaultCurrencySymbol: quote.estimatedGasPriceCurrency,
             feeInDefaultCurrency: quote.estimatedGasPriceDefault,
             errorMsg: quote.errorMsg,
             minimumAmount: quote.minimumAmount,
           },
           {
             totalUSDTLiquidity: quote.totalUSDTLiquidity,
             maxCapacity: quote.maxCapacity,
             stakedSTBL: quote.stakedSTBL,
             activeCovers: quote.activeCovers,
             utilizationRatio: quote.utilizationRatio,
           }
         );

       }else{

         quote =  await getQuote(
           'bridge',
           bridgeEpochs,
           amountInWei,
           _protocol.bridgeProductAddress,
           '0x0000000000000000000000000000000000000000',
           '0x0000000000000000000000000000000000000000',
           hexToBytes(numberToHex(500)),
         );

         const bridgeQuote = {
           totalSeconds       : quote.prop1,
           totalPrice         : quote.prop2,
           totalLiquidity     : quote.prop3,
           totalCoverTokens   : quote.prop4,
           prop5              : quote.prop5,
           prop6              : quote.prop6,
           prop7              : quote.prop7,
         }
         // mapping to bridge object Or could be mapping to UI object
         // only reason of why we have diff get<provider>Quote methods

         const actualPeriod = Math.floor(Number(bridgeQuote.totalSeconds) / 3600 / 24);

         return CatalogHelper.quoteFromCoverable(
           'bridge',
           _protocol,
           {
             amount: amountInWei,
             currency: _currency,
             period: _period,
             chain: 'ETH',
             chainId: global.user.ethNet.networkId,
             actualPeriod: actualPeriod,
             price: bridgeQuote.totalPrice,
             response: bridgeQuote,
             pricePercent: new BigNumber(bridgeQuote.totalPrice).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(actualPeriod)).times(365).times(100).toNumber() / 1000, //%, annualize
             minimumAmount: getCoverMin("bridge", global.user.ethNet.symbol, _currency ),
           },
           {}
         );

       }

     }else{
       return {error: "Please provide bridgeProductAddress in protocol object"}
     }
   }else{
     return {error: "Not supported network for Bridge"}
   }
 }

/**
 *  Hard coding only interface compliant since they are CONSTANTS
 *
 * @param _amount
 * @param _period
 * @param _protocol
 * @returns
 */
 async function getBridgeV2Quote(_amount :any, _currency:any, _period :any, _protocol :any ) : Promise<object>{

   if (CatalogHelper.availableOnNetwork(global.user.ethNet.networkId, 'BRIDGE_MUTUAL')) {
     if(_protocol.bridgeProductAddress){

       let {amountInWei, currency, bridgeEpochs, initialBridgeCurrency } = BridgeHelper.preQuoteDataFormat(_amount, _currency, _period);

       console.log("preQuoteDataFormat - " , amountInWei, currency, bridgeEpochs, initialBridgeCurrency , _protocol);

         return getQuoteFromBridgeV2(
           _protocol,
           _period,
           bridgeEpochs,
           amountInWei,
           currency,
           initialBridgeCurrency,
         );

     }else{
       return {error: "Please provide bridgeProductAddress in protocol object"}
     }
   }else{
     return {error: "Not supported network for Bridge"}
   }
 }


 export async function getNexusQuote( _amount :any,_currency :any,_period :any,_protocol :any ) : Promise<object> {
    if (CatalogHelper.availableOnNetwork(global.user.ethNet.networkId, 'NEXUS_MUTUAL')){
      if(_protocol.nexusCoverable){
        return await NexusApi.fetchQuote( _amount , _currency, _period, _protocol);
      }else{
        return {error: "Please provide nexusCoverable address in protocol object"}
      }
   }else{
     return {error: "Not supported network for Nexus"}
   }
 }


export async function getInsuraceQuote( _web3:any, _amount :any,_currency :any,_period :any,_protocol :any ) : Promise<object> {

  if(!_web3.networkId){ // if active net
    const newWeb3Instance = {
        account: global.user.account,
        networkId: global.user.networkId,
        symbol: NetConfig.netById(global.user.networkId).symbol,
        web3Instance: _web3,
        readOnly: false,
      }
      _web3 = newWeb3Instance;
  }

  if (CatalogHelper.availableOnNetwork(_web3.networkId, 'INSURACE')) {
    if(_protocol.productId){
      return await InsuraceApi.fetchInsuraceQuote(_web3, _amount , _currency, _period, _protocol);
    }else{
      return {error: "Please provide productId of Insurace protocol in protocol object"}
    }
  }else{
    return {error: "Not supported network for Insurace"}
  }
}

export async function getInsuraceQuotes( _arrayOfQuotes:any ) : Promise<object> {

  GoogleEvents.quote( {} , "multiInsuraceQuote" );

  const newWeb3Instance = {
    account: global.user.account,
    networkId: global.user.networkId,
    symbol: NetConfig.netById(global.user.networkId).symbol,
    web3Instance: global.user.web3,
    readOnly: false,
  }

  const amounts:any[] = [];
  const periods:any[] = [];
  const protocolIds:any[] = [];

  let currency:any = null;

  for (var i = 0; i < _arrayOfQuotes.length; i++) {
    const protocol = {name:_arrayOfQuotes[i].name };
    const quoteData:any = await InsuraceApi.formatQuoteDataforInsurace(_arrayOfQuotes[i].amount , _arrayOfQuotes[i].currency, newWeb3Instance , protocol);

    if(!currency) currency = quoteData.selectedCurrency ? quoteData.selectedCurrency : quoteData ;
    amounts.push(quoteData.amountInWei);
    periods.push(_arrayOfQuotes[i].period);
    protocolIds.push(_arrayOfQuotes[i].productId);
  }

  if (CatalogHelper.availableOnNetwork(newWeb3Instance.networkId, 'INSURACE')) {
    return await InsuraceApi.getMultipleCoverPremiums( newWeb3Instance , amounts , currency, periods, protocolIds);
  }else{
    return { error: "Please switch to Insurace supported network" }
  }
}

export default {
  getQuoteFrom,
  getInsuraceQuotes,
};
