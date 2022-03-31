import {_getDistributorsContract} from "../helpers/getContract";

/**
 * Returns the contract implementation address of the intended distributor
 *
 * @remarks
 * This functions serves to re-check if intended distributor is supported
 *
 * @param _distributorName - Name of distributor in lower case
 * @returns blockchain address of specified distributor contract
 */
export async function getDistributorAddress(
  _distributorName : string
  ) : Promise<string>  {
  return await _getDistributorsContract(global.user.web3)
              .methods
              .getDistributorAddress(_distributorName)
              .call();
}


export default {
  getDistributorAddress
}
