import Cover from "./domain/Cover";
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

export default {
  getCovers,
  getCoversCount
}
