import NexusApi from './distributorsApi/NexusApi';
import InsuraceApi from './distributorsApi/InsuraceApi';
import { getQuote, getQuoteFromBridgeV2 } from "./dao/Quotes";
import CatalogHelper from './helpers/catalogHelper';
import NetConfig from '../service/config/NetConfig';
import CurrencyHelper from './helpers/currencyHelper';
import RiskCarriers from './config/RiskCarriers';
import BigNumber from 'bignumber.js'
import { toWei, hexToBytes, numberToHex } from "web3-utils"
import {getCoverMin} from "./helpers/cover_minimums"
import GoogleEvents from './config/GoogleEvents';
import BridgeHelper from './distributorsApi/BridgeHelper';
import EaseApi from "@/service/distributorsApi/EaseApi";
import UnslashedAPI from "@/service/distributorsApi/UnslashedAPI";
import UnoReApi from "@/service/distributorsApi/UnoReApi";
import TidalApi from "@/service/distributorsApi/TidalApi";


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
  const quotesPromiseArray:any = [];

  quotesPromiseArray.push(getQuoteFrom('nexus', _amount, _currency, _period, _protocol, null ))
  quotesPromiseArray.push(getQuoteFrom('insurace' , _amount, _currency, _period, _protocol, global.user.web3 ))
  quotesPromiseArray.push(getQuoteFrom('bridge' , _amount, _currency, _period, _protocol, null ))
  quotesPromiseArray.push(getQuoteFrom('ease' , _amount, _currency, _period, _protocol, null ))
  quotesPromiseArray.push(getQuoteFrom('unslashed' , _amount, _currency, _period, _protocol, null ))
  quotesPromiseArray.push(getQuoteFrom('unore' , _amount, _currency, _period, _protocol, null ))
  quotesPromiseArray.push(getQuoteFrom('tidal' , _amount, _currency, _period, _protocol, null ))

  for (let net of global.user.web3Passive) {
    quotesPromiseArray.push(getQuoteFrom('insurace' , _amount, _currency, _period, _protocol, net))
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
                                    _protocol:any,
                                    _net:any,
    ): Promise<object> {

      GoogleEvents.quote( {_amount, _currency, _period, _protocol, _distributorName , _net } , "getQuoteFrom")

  if(_distributorName == 'bridge'){
    return await getBridgeV2Quote( _amount,_currency,_period,_protocol);
  }else if(_distributorName == 'nexus'){
    return await getNexusQuote(_amount,_currency,_period,_protocol );
  }else if(_distributorName == 'insurace'){
    return await getInsuraceQuote( _net , _amount,_currency,_period,_protocol);
  }else if(_distributorName == 'ease'){
    return await getEaseQuote(_amount,_currency,_period,_protocol );
  }else if(_distributorName == 'unslashed'){
    return await getUnslashedQuote(_amount,_currency,_period,_protocol );
  }
  else if(_distributorName == 'unore'){
    return await getUnoReQuote(_amount,_currency,_period,_protocol );
  }
  else if(_distributorName == 'tidal'){
    return await getTidalQuote(_amount,_currency,_period,_protocol );
  }
  else {
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
 async function getBridgeV2Quote(_amount :any, _currency:any, _period :any, _protocol :any ) : Promise<object>{

   if (CatalogHelper.availableOnNetwork(global.user.ethNet.networkId, 'BRIDGE_MUTUAL')) {
     if(_protocol.bridgeProductAddress){

       let {amountInWei, currency, bridgeEpochs, initialBridgeCurrency } = BridgeHelper.preQuoteDataFormat(_amount, _currency, _period);

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

  GoogleEvents.quote( { _net: global.user.web3 } , "multiInsuraceQuote" );

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

export async function getEaseQuote(_amount: any, _currency: any, _period: any, _protocol: any): Promise<object> {
  if (CatalogHelper.availableOnNetwork(global.user.ethNet.networkId, 'EASE')) {
    if (_protocol.rawDataEase) {
      return await EaseApi.fetchQuote(_amount, _currency, _period, _protocol);
    }
  } else {
    return {error: "Not supported network for Ease"}
  }
}

export async function getUnslashedQuote(_amount: any, _currency: any, _period: any, _protocol: any): Promise<object> {
  if (CatalogHelper.availableOnNetwork(global.user.ethNet.networkId, 'UNSLASHED')) {
    if (_protocol.rawDataUnslashed) {
      return await UnslashedAPI.fetchQuote(_amount, _currency, _period, _protocol);
    }
  } else {
    return {error: "Not supported network for Unslashed"}
  }
}

export async function getUnoReQuote(_amount: any, _currency: any, _period: any, _protocol: any): Promise<object> {
  if (CatalogHelper.availableOnNetwork(global.user.ethNet.networkId, 'UNORE')) {
    if (_protocol.rawDataUnore) {
      return await UnoReApi.fetchQuote(_amount, _currency, _period, _protocol);
    }
  } else {
    return {error: "Not supported network for Unslashed"}
  }
}

export async function getTidalQuote(_amount: any, _currency: any, _period: any, _protocol: any): Promise<object> {
    if (CatalogHelper.availableOnNetwork(global.user.ethNet.networkId, 'TIDAL')) {
    if (_protocol.rawDataTidal) {
      return await TidalApi.fetchQuote(_amount, _currency, _period, _protocol);
    }
  } else {
    return {error: "Not supported network for Unslashed"}
  }
}

export default {
  getQuoteFrom,
  getInsuraceQuotes,
};
