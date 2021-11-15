import Cover from "../domain/Cover";
import {_getDistributorContract} from "../helpers/getContract";

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
    _distributorName : string,
    _ownerAddress: string ,
    _isActive : boolean
): Promise<number>  {

  console.log("getCoversCount 1 - " , _distributorName);

  return _getDistributorContract()
         .methods
         .getCoversCount(
           _distributorName,
           _ownerAddress,
           _isActive)
         .call().then((_data:any) => {
           console.log("getCoversCount 2 - " , _distributorName,  _data);
           return _data;
         });
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
export async function getCovers(
    _distributorName : string,
    _ownerAddress : string,
    _activeCover : boolean,
    _limit : number,
) : Promise<any[]>  {

  return _getDistributorContract()
        .methods
        .getCovers(
          _distributorName,
          _ownerAddress,
          _activeCover,
          _limit,
        ).call().then((_data:any) => {
          return _data;
        });;
}

export default {
   getCovers,
   getCoversCount
}
