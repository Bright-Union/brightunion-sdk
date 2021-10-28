/* use strict */

import { getCoversCount, getCovers } from "./service/dao/Covers";
import { getDistributorAddress } from "./service/dao/Distributors";
import { getQuote } from "./service/dao/Quotes";
import { buyCoverDecode, buyCover } from "./service/dao/Buying";

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
class Distributors {

  web3: any;
  brightProtoAddress: string;

  constructor(_brightProtoAddress: string, _web3 : any) {
    this.web3 = _web3;
    this.brightProtoAddress = _brightProtoAddress;

    console.log( this.brightProtoAddress )

  }

  async getDistributorAddress (
      _distributorName : string,
  ){
    return await getDistributorAddress(
      this.brightProtoAddress,
      this.web3,
      _distributorName
    )
  }

  async getCoversCount(
    _distributorName : string,
    _owner: string ,
    _isActive : boolean
  ) {
   return await getCoversCount(
      this.brightProtoAddress,
      this.web3,
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
        this.brightProtoAddress,
        this.web3,
        _distributorName,
        _ownerAddress,
        _activeCover,
        _limit
     );
 }

async getQuote(
  _distributorName : string ,
  _period : number,
  _sumAssured : number,
  _contractAddress : string,
  _interfaceCompliant1 : string,
  _interfaceCompliant2 : string,
  _data : any,
) {
 return await getQuote(
        this.brightProtoAddress,
        this.web3,
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
              this.brightProtoAddress,
              this.web3,
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
  _web3:any,
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
                this.brightProtoAddress,
                this.web3,
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
