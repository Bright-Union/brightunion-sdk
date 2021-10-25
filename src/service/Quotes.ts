import CoverQuote from "./domain/CoverQuote";
import _getDistributorContract from "./helpers/getContract";


/**
 * Returns a quotation for specified distributor.
 *
 * @remarks
 * This function takes different params based on the intended
 * distributor, please refer to README file of the package or the protocol 
 * for the parameters table.
 * Parameters not used by a distributor need to be named
 * interface compliant and filled with its spec type.
 *
 * @param _web3 - Web3 Instance
 * @param _distributorName - Name of distributor in lower case
 * @param _sumAssured - The total sum assured
 * @param _coverPeriod - The duration of the cover in days
 * @param _contractAddress - Address of the cover contract
 * @param _interfaceCompliant1 - Arbitrary value type number
 * @param _interfaceCompliant2 - Arbitrary value type number
 * @param _data - The encoded data params
 * @returns A detailed quote
 *
 * @beta
 */
export async function getQuote(
    _web3:any,
    _distributorName : string ,
    _period : any,
    _sumAssured : any,
    _contractAddress : string,
    _interfaceCompliant1 : string,
    _interfaceCompliant2 : string,
    _data : any, 
) : Promise<CoverQuote>  {

  return await _getDistributorContract(_web3)
              .methods
              .getQuote(
                _distributorName,
                _period,
                _sumAssured,
                _contractAddress,
                _interfaceCompliant1,
                _interfaceCompliant2,
                _data
              ).call();
}

export default getQuote;
