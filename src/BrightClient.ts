/* use strict */

import User from './service/domain/User';
import { getCoversCount, getCovers } from "./service/dao/Covers";
import { getDistributorAddress } from "./service/dao/Distributors";
import { getCatalog } from "./service/Catalog";
import { getAllCovers } from "./service/Covers";
import { buyQuote } from "./service/Buying";
import { getQuoteFrom, getQuotes } from "./service/Quotes";
import NetConfig from './service/config/NetConfig'
import CurrencyHelper from './service/helpers/currencyHelper'

/**
 * Main module class, entry point of the
 * BrightUnion SDK services...
 *
 * @remarks
 * Returns a Bright Union Distributors service instance.
 *
 * @param _web3 - Name of distributor in lower case
 * @returns Bright Union instance
 */

 declare global {
   var user:User;
 }

class BrightClient {

catalog: object[];
catalogUnsorted: object[];

constructor(_config:any) {
    global.user = {
      web3: _config.web3,
      networkId: _config.networkId,
      web3Passive: [],
      brightProtoAddress: _config.brightProtoAddress,
      account: _config.account,
    };
  }

  // Future structure?
  // covers: object = {
  //   // owner: this,
  //   async getCatalog() {
  //     return await this.getCatalog();
  //   },
  //   async getCatalogUnsorted() {
  //     return await this.catalogUnsorted;
  //   },
  //   async getQuotes() {
  //     return await this.getQuotes();
  //   },
  //   async buyQuote() {
  //     return await this.buyQuote();
  //   },
  // }

async initialize(): Promise<object>{
      global.user.account = (await  global.user.web3.eth.getAccounts())[0];;
      global.user.networkId = await global.user.web3.eth.net.getId();
      global.user.brightProtoAddress = NetConfig.netById(global.user.networkId).brightProtocol;
      global.user.web3Passive = NetConfig.createWeb3Passives();
      await CurrencyHelper.getETHDAIPrice();
      await CurrencyHelper.getInsureUSDCPrice();
      return {status: true, message: 'Bright Union Initialized'};
  }

async getCatalog () {
     return await getCatalog().then(data => {
      this.catalog = data.sorted;
      this.catalogUnsorted = data.unSorted;
      return data.sorted;
    })
  }

async getDistributorAddress (
      _distributorName : string,
  ){
    return await getDistributorAddress(
      _distributorName
    )
  }


async getAllCovers(
){
  return await getAllCovers(
  )
}

async getCoversCount(
    _distributorName : string,
    _owner: string ,
    _isActive : boolean
  ) {
   return await getCoversCount(
      _distributorName,
      _owner,
      _isActive
    )
  }

async getCovers(
    _distributorName : string,
    _ownerAddress : string,
    _activeCover : boolean,
    _limit : number,
  ) {
   return await getCovers(
        _distributorName,
        _ownerAddress,
        _activeCover,
        _limit
     );
 }

 async getQuotes(
  _amount: number,
  _currency: string,
  _period: number,
  _protocol: any
){
  if(!_protocol){
    return {error: "No protocol provided"};
  }
 return await getQuotes(_amount, _currency, _period, _protocol);
}



async getQuoteFrom(_distributorName:string,
             _amount:number,
             _currency:string,
             _period:number,
             _protocol:any): Promise<any> {

   return await getQuoteFrom(
     _distributorName,
     _amount,
     _currency,
     _period,
     _protocol
                     );
 }


 async buyQuote(
   _quote:any,
 ){
   if(!_quote){
     return {error : "No quote provided"};
   }
   return await buyQuote(
     _quote
   )

 }
}

export default BrightClient;
