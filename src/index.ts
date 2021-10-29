/* use strict */

import User from './service/domain/User';
import { getCoversCount, getCovers } from "./service/dao/Covers";
import { getDistributorAddress } from "./service/dao/Distributors";
import { getQuote } from "./service/dao/Quotes";
import { buyCoverDecode, buyCover } from "./service/dao/Buying";
import { getCatalog } from "./service/Catalog";
import { getQuotes, getQuoteFrom } from "./service/Quotes";

/**
 * Main module class, entry point of the
 * BrightUnion SDK services...
 *
 * @remarks
 * Returns a Bright Union Distributors service instance.
 *
 * @param _web3 - Name of distributor in lower case
 * @param _brightProtoAddress - The Blue Bright contract address
 * @returns Bright Union instance
 */

 declare global {
   var user:User;
 }

class Distributors {

  web3: any;
  catalog: object[];

  constructor(_config:any) {

    global.user = {
      web3: _config.web3,
      networkId: _config.networkId,
      brightProtoAddress: _config.brightProtoAddress,
      account: _config.account,
    };

  }

  async Initialize(): Promise<object>{
    if(!global.user.account || !global.user.networkId){
      return {status: false, message: 'Bright Union Initializing'};
    }else{
      global.user.account = (await this.web3.eth.getAccounts())[0];
      global.user.networkId = await this.web3.eth.net.getId();
      return {status: true, message: 'Bright Union Initialized'};
    }
  }

  async getCatalog (
  ){
     return await getCatalog(
    ).then(data => {
      this.catalog = data;
      return data;
    })

  }

  async getDistributorAddress (
      _distributorName : string,
  ){
    return await getDistributorAddress(
      _distributorName
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
 ){
   return await getQuotes();
 }

 async getQuoteFrom(_distributorName:string): Promise<object>{
   return await getQuoteFrom(_distributorName);
 }

async getQuote( // remove after
  _distributorName : string ,
  _period : number,
  _sumAssured : number,
  _contractAddress : string,
  _interfaceCompliant1 : string,
  _interfaceCompliant2 : string,
  _data : any,
) {
 return await getQuote(
        _distributorName,
        _period,
        _sumAssured,
        _contractAddress,
        _interfaceCompliant1,
        _interfaceCompliant2,
        _data,
   );
}

async buyCover(
  _web3:any,
  _distributorName : string,
  _contractAddress : string,
  _coverAsset : string,
  _sumAssured : number,
  _coverPeriod : number,
  _coverType : number,
  _maxPriceWithFee : number,
  _data : any,
){
  return await buyCover(
              _distributorName,
              _contractAddress,
              _coverAsset,
              _sumAssured,
              _coverPeriod,
              _coverType,
              _maxPriceWithFee,
              _data,
  )
}

async buyCoverDecode (
  _ownerAddress:any,
  _distributorName : string,
  _products : Array<number>,
  _durationInDays : Array<number>,
  _amounts : Array<number>,
  _currency : string,
  _premiumAmount : number,
  _helperParameters : Array<number>,
  _securityParameters : Array<number>,
  _v : Array<number>,
  _r : Array<number>,
  _s: Array<number>,
){
  return await buyCoverDecode(
                _ownerAddress,
                _distributorName,
                _products,
                _durationInDays,
                _amounts,
                _currency,
                _premiumAmount,
                _helperParameters,
                _securityParameters,
                _v,
                _r,
                _s
              );
}

}

export default Distributors;
