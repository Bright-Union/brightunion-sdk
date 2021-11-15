import BuyReceipt from "../domain/BuyReceipt";
import {_getDistributorContract,_getInsuraceDistributor} from "../helpers/getContract";

/**
* Returns a transaction receipt.
* (Emits a boughtCover event at contract level)
*
* @remarks At the moment this function is only supported
* when intended distributor is Bridge & Nexus, for Insurace please
* refer to buyCoverDecode function.2
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
export async function buyCover(
  _ownerAddress : string,
  _distributorName : string,
  _contractAddress : string,
  _coverAsset : string,
  _sumAssured : number,
  _coverPeriod : number,
  _coverType : any,
  _maxPriceWithFee : number,
  _data : any,
):Promise<any>{

  return await new Promise((resolve, reject) => {

    _getDistributorContract()
    .methods
    .buyCover(
      _distributorName,
      _contractAddress,
      _coverAsset,
      _sumAssured,
      _coverPeriod,
      _coverType,
      _maxPriceWithFee,
      _data,
    )
    .send({
      from: _ownerAddress,
      value: _maxPriceWithFee,
      // gasLimit: 129913, // 7000000
    })
    .on('transactionHash', (res:any) => {
      resolve({success:res});
    })
    .on('error', (err:any, receipt:any) => {
      reject( {error: err, receipt:receipt})
    });
  });


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

export async function buyCoverInsurace(distributorName : string, buyingObj:any){

  return await new Promise((resolve, reject) => {
    _getInsuraceDistributor()
    .methods
    .buyCoverInsurace(buyingObj)
    .send({
      from: buyingObj.owner,
      value: buyingObj.premium,
    })
    .on('transactionHash', (res:any) => {
      resolve({success: res});
    })
    .on('error', (err:any, receipt:any) => {
      reject({error: err , receipt:receipt})
    });
  });
}

export default {
  buyCover, buyCoverInsurace
}
