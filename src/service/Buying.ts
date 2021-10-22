
import BuyReceipt from "./domain/BuyReceipt";

/**
 * Returns a transaction receipt.
 * (Emits a boughtCover event at contract level)
 *
 * @remarks At the moment this function is only supported
 * when intended distributor is Bridge & Nexus, for Insurace please
 * refer to _buyCoverDecode function.
 *
 * @param _distributorName
 * @param _contractAddress
 * @param _coverAsset
 * @param _sumAssured
 * @param _coverPeriod
 * @param _coverType
 * @param _maxPriceWithFee
 * @param _data
 * @returns BuyReceipt Object
 */
export function _buyCover(
        // _distributorName : string,
        // _contractAddress : string,
        // _coverAsset : string,
        // _sumAssured : number,
        // _coverPeriod : number,
        // _coverType : number,
        // _maxPriceWithFee : number,
        // _data : any,
) :  Promise<BuyReceipt>  {
  return;
}

/**
 * Returns a transaction receipt.
 * (Emits a boughtCover event at contract level)
 *
 * @remarks Buy coverages for Insurance
 *
 * @param _distributorName
 * @param _products
 * @param _durationInDays
 * @param _amounts
 * @param _currency
 * @param _premiumAmount
 * @param _helperParameters
 * @param _securityParameters
 * @param _v
 * @param _r
 * @param _s
 * @returns  BuyReceipt Object
 */
export function _buyCoverDecode (
        // _distributorName : string,
        // _products : Array<number>,
        // _durationInDays : Array<number>,
        // _amounts : Array<number>,
        // _currency : string,
        // _premiumAmount : number,
        // _helperParameters : Array<number>,
        // _securityParameters : Array<number>,
        // _v : Array<number>,
        // _r : Array<number>,
        // _s: Array<number>,
) :  Promise<BuyReceipt>  {
  return;
}


export default {
  _buyCoverDecode
}
