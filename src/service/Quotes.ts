import CoverQuote from "./domain/CoverQuote";


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
export function getQuote(
    // _distributorName : string ,
    // _interfaceCompliant1 : number,
    // _interfaceCompliant2 : number,
    // _sumAssured : number,
    // _coverPeriod : number,
    // _contractAddress : string,
    // _coverAsset : string,
    // _coverable : string,
    // _data : any,
) : Promise<CoverQuote>  {
  return;
}


export default {getQuote}
