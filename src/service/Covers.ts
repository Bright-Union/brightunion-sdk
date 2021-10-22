import Cover from "./domain/Cover";
// import BuyReceipt from "./domain/BuyReceipt";
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
    // _distributorName : string,
    // _ownerAddress : string,
    // _activeCover : boolean,
    // _limit : number,
    // _web3 : any,
) : Promise<Cover[]>  {


  return
}


export default {
  // getCovers,
  getCoversCount
}
