

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


export default {
  _getDistributorAddress
}
