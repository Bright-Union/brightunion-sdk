import getDistributorContract from "./helpers/getContract";
import Cover from "./domain/Cover";
import CoverQuote from "./domain/CoverQuote";
import BuyReceipt from "./domain/BuyReceipt";
import _getDistributorContract from "./helpers/getContract";


/**
 * Returns the total cover count owned by an address
 * 
 * @remarks
 * Function to get total number of owned covers from an address
 * 
 * @param _distributorName - Name of distributor in lower case
 * @param _owner 
 * @param _isActive 
 * @returns Number of total covers
 */
export function getCoversCount(
    _web3 : any,
    _distributorName : string, 
    _owner: string , 
    _isActive : boolean
): Promise<number>  { 
  return _getDistributorContract(_web3)
         .methods
         .getCoversCount(_distributorName,_owner,_isActive)
         .call();
}

/**
 * Returns the contract implementation address of the intended distributor
 * 
 * @remarks
 * This functions serves to re-check if intended distributor is supported
 * 
 * @param _distributorName - Name of distributor in lower case
 * @returns blockchain address of specified distributor contract
 */
export function _getDistributorAddress(
  _distributorName : string
  ) : Promise<string>  {
  return;
}

/**
 * Return Covers  from owner's address of specified distributor.
 * 
 * @remarks
 * Get active/inactive cover from user address
 * 
 * @param distributorName 
 * @param ownerAddress 
 * @param activeCover 
 * @param limit 
 * @param web3 
 * @returns Cover Object
 */
export async function  getCovers(
    _distributorName : string,
    _ownerAddress : string,
    _activeCover : boolean,
    _limit : number,
    _web3 : any,
) : Promise<Cover[]>  {

  return  
}

/**
 * Returns a quotation for specified distributor.
 * 
 * @remarks
 * This function takes different params based on the intended 
 * distributor, please refer to README file of the package for the
 * parameters table.
 * Parameters not used by a distributor need to be named
 * interface compliant and filled with its spec type.
 * 
 * @param _distributorName - Name of distributor in lower case
 * @param _interfaceCompliant1 - Arbitrary value type number
 * @param _interfaceCompliant2 - Arbitrary value type number
 * @param _sumAssured - The total sum assured
 * @param _coverPeriod - The duration of the cover in days
 * @param _contractAddress - Address of the cover contract
 * @param _coverAsset - The currency used to pay the cover
 * @param _coverable - Address of product contract
 * @param _data - The encoded data params
 * @returns A detailed quote
 * 
 * @beta
 */
export function _getQuote(
    _distributorName : string ,
    _interfaceCompliant1 : number,
    _interfaceCompliant2 : number,
    _sumAssured : number,
    _coverPeriod : number,
    _contractAddress : string,
    _coverAsset : string,
    _coverable : string,
    _data : any,
) : Promise<CoverQuote>  {
  return;
}

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
        _distributorName : string,
        _contractAddress : string,
        _coverAsset : string,
        _sumAssured : number,
        _coverPeriod : number,
        _coverType : number,
        _maxPriceWithFee : number,
        _data : any,
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
) :  Promise<BuyReceipt>  {
  return;
}

export default {
  getCovers,
  getCoversCount
}
