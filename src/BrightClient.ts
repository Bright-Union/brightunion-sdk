/* use strict */

import User from './service/domain/User';
import { getCoversCount, getCovers } from "./service/dao/Covers";
import { getDistributorAddress } from "./service/dao/Distributors";
import { getCatalog } from "./service/Catalog";
import { getAllCovers, getAllCoversCount, getCoversFrom } from "./service/Covers";
import { buyQuote } from "./service/Buying";
import { getQuoteFrom, getQuotes } from "./service/Quotes";
import NetConfig from './service/config/NetConfig'
import CurrencyHelper from './service/helpers/currencyHelper'
import EventEmitter from 'events'

// import {_loadAllABIs} from "./service/helpers/getContract"

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
   var events:any;
 }

 // *********NOTES events: ***********START
 // catalog
 // quote
 // buy
 // ************************************END


class BrightClient {

catalog: object[];
catalogUnsorted: object[];
initialized:boolean;
events:any

constructor(_config:any) {
    global.user = {
      web3: _config.web3,
      web3Passive: [],
      networkId: null,
      symbol: null,
      brightProtoAddress: null,
      account: null,
      ethNet: null,
    }
    this.initialized = false;
    global.events = this.events = new EventEmitter();
  }


async initialize(): Promise<object>{
      global.user.account = (await  global.user.web3.eth.getAccounts())[0];
      if(!global.user.account) global.user.account = "0x0000000000000000000000000000000000000001";
      global.user.networkId = await global.user.web3.eth.net.getId();
      global.user.brightProtoAddress = NetConfig.netById(global.user.networkId).brightProtocol;
      global.user.web3Passive = NetConfig.createWeb3Passives();
      global.user.symbol =  NetConfig.netById(global.user.networkId).symbol;
      global.user.ethNet =  NetConfig.getETHNetwork();
      await CurrencyHelper.getETHDAIPrice();
      CurrencyHelper.getInsureUSDCPrice();
      this.initialized = true;
      global.events.emit("initialized" , { user: global.user } );
      // await _loadAllABIs();
      return {initialized: this.initialized, message: 'Bright Union Initialized', user:global.user };
  }

  initErrorResponse () {
    return {error: "Await Initialization of BrightClient before calling other methods."}
  }

async getCatalog () {

  if(!this.initialized){
    return this.initErrorResponse();
  }

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


async getCoversFrom(
  _distributorName : string,
  // _activeCover : boolean,
  // _limit : number,
){
  if(!this.initialized){
    return this.initErrorResponse();
  }
  return await getCoversFrom(_distributorName);
}


async getAllCovers(
){
  if(!this.initialized){
    return this.initErrorResponse();
  }
  return await getAllCovers()
}

// async getCoversCountFrom(
//     _distributorName : string,
//     // _owner: string ,
//     _isActive : boolean
//   ):Promise<any> {
//    return await getCoversCount(
//       _distributorName,
//       global.user.account,
//       _isActive
//     )
//   }
//
// async getAllCoversCount(
//   ):Promise<any> {
//    return await getAllCoversCount()
//   }

 async getQuotes(
  _amount: number,
  _currency: string,
  _period: number,
  _protocol: any
){
  if(!this.initialized){
    return this.initErrorResponse();
  }
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
    if(!this.initialized){
      return this.initErrorResponse();
    }

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
  ): Promise<any>{
    if(!this.initialized){
      return this.initErrorResponse();
    }
    if(!_quote){
      return {error : "No quote provided"};
    }
    if(_quote.chainId !== global.user.networkId){
      return {error : "Wrong network" , message:"Please switch your active network to fit the quote network"};
    }
    return await buyQuote(
      _quote
    )

  }

}

export default BrightClient;


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
