/* use strict */

import User from './service/domain/User';
import { getCoversCount, getCovers } from "./service/dao/Covers";
import { getDistributorAddress } from "./service/dao/Distributors";
import { getCatalog } from "./service/Catalog";
import { getAllCovers, getAllCoversCount, getCoversFrom } from "./service/Covers";
import { buyQuote , buyMultipleQuotes } from "./service/Buying";
import { getQuoteFrom, getQuotes, getInsuraceQuotes } from "./service/Quotes";
import NetConfig from './service/config/NetConfig'
import CurrencyHelper from './service/helpers/currencyHelper'
import EventEmitter from 'events'
import GoogleEvents from './service/config/GoogleEvents';
import UniswapV3Api from './service/helpers/UniswapV3Api';


import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

import { version } from '../package.json';

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
  var sentry: any;
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
  events:any;
  version:any;

  constructor(_config:any) {
    global.user = {
      googleEventsEnabled: _config.GADisable ? false : true, // use GADisable: true to disable Google Analytics Events
      clientKey: _config.clientKey ?  _config.clientKey : window.location.host,
      web3: _config.web3,
      web3Passive: [],
      networkId: null,
      symbol: null,
      brightProtoAddress: null,
      account: null,
      ethNet: {},
      // readOnly: null,
    }
    this.version = version;
    this.initialized = false;
    global.events = this.events = new EventEmitter();

    global.sentry = Sentry;

    global.sentry.init({
      environment: global.user.clientKey,
      dsn: window.location.host.includes("localhost") ? null : "https://aa50bf5ac0164260947c9869f8d03c84@o1110132.ingest.sentry.io/6153025",
      integrations: [
        new Integrations.BrowserTracing(),
      ],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 0.25,
    });
  }


  async initialize(): Promise<object>{
    global.user.networkId = await global.user.web3.eth.net.getId();
    global.user.account = (await  global.user.web3.eth.getAccounts())[0];
    if(!global.user.account) global.user.account = "0x0000000000000000000000000000000000000001";

    const activeNetOpt = NetConfig.netById(global.user.networkId);
    if(activeNetOpt){
      global.user.brightProtoAddress = activeNetOpt.brightProtocol;
      global.user.symbol =  activeNetOpt.symbol;
    }

    await Promise.all([
      NetConfig.createWeb3Passives(),
      UniswapV3Api.initUniswapV3(),
      CurrencyHelper.getETHDAIPrice(1),
      CurrencyHelper.getInsureUSDCPrice(1),
    ]).then((_data: any) => {
      global.user.web3Passive = _data[0];
    })

    global.user.ethNet =  NetConfig.getETHNetwork();
    this.initialized = true;
    global.events.emit("initialized" , { user: global.user } );
    GoogleEvents.onBUInit();
    return {initialized: this.initialized, message: 'Bright Union Initialized', user:global.user };
  }

  initErrorResponse () {
    return {error: "Await Initialization of BrightClient before calling other methods."}
  }
  notSupportedNetMessage(){
    return { message: "Please switch to one of the supported network ID's: " + NetConfig.mainNets().concat(NetConfig.testNets()) , user:global.user  , error: "Unsupported network connected" }
  }

  getVersion(){
    return this.version;
  }

  async getCatalog () {

    if(!this.initialized){
      return this.initErrorResponse();
    }

    return await getCatalog().then(data => {
      this.catalog = data.sorted;
      this.catalogUnsorted = data.unSorted;
      return { items: data.sorted, version: version };
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
    if( !NetConfig.isSupportedNetwork(global.user.networkId) ) {
      return this.notSupportedNetMessage();
    }
    return await getCoversFrom(_distributorName);
  }

  async getAllCovers(
  ){
    if(!this.initialized){
      return this.initErrorResponse();
    }
    if( !NetConfig.isSupportedNetwork(global.user.networkId) ) {
      return this.notSupportedNetMessage();
    }
    return await getAllCovers()
  }



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
        _protocol,
        global.user.web3
      );
    }

    async getMultipleQuotes(
      _arrayOfQuotes: any
    ){

      if(!this.initialized){
        return this.initErrorResponse();
      }

      let isSupportedDistributor:boolean = true;
      let areSameCurrency:any = true;

      for (var i = 0; i < _arrayOfQuotes.length; i++) {
        if(areSameCurrency === true){
          areSameCurrency = _arrayOfQuotes[i].currency;
        }else if(areSameCurrency != _arrayOfQuotes[i].currency){
          areSameCurrency = false;
        }

        if(_arrayOfQuotes[i].distributorName != "insurace"){
          isSupportedDistributor = false
        }
      }
      if(!areSameCurrency){
        return { error:"All quotes have to be in the same currency"}
      }
      if(!isSupportedDistributor){
        return { error:"Currently only protocoles from Insurace are supported for muliple quotes in one request"}
      }
      return await getInsuraceQuotes(_arrayOfQuotes);
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

    async buyQuotes(
      _quotes:any[],
    ): Promise<any>{
      if(!this.initialized){
        return this.initErrorResponse();
      }
      if(!_quotes || _quotes.length < 1){
        return {error : "No quotes provided"};
      }
      return await buyMultipleQuotes(
        _quotes
      )

    }

  }

  export default BrightClient;
