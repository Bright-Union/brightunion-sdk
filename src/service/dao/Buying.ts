import BuyReceipt from "../domain/BuyReceipt";
import {_getDistributorContract,_getInsuraceDistributor, _getNexusDistributor} from "../helpers/getContract";
import ERC20Helper from '../helpers/ERC20Helper'
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

  if(_distributorName == 'nexus'){
    console.log('using brighPrptocol at ', _getDistributorContract().address);
    const nexusAddress =  await _getDistributorContract().methods.getDistributorAddress('nexus').call();
    console.log('Calling nexusAddress at ', nexusAddress);
          return await new Promise((resolve, reject) => {
            _getNexusDistributor(nexusAddress)
            .methods
            .buyCover(
              _contractAddress,
              _coverAsset,
              _sumAssured,
              _coverPeriod,
              _coverType,
              _maxPriceWithFee,
              _data,
            )
            .send({ from: _ownerAddress, value: _maxPriceWithFee })
            .on('transactionHash', (res:any) => { resolve({success:res}); })
            .on('error', (err:any, receipt:any) => { reject( {error: err, receipt:receipt}) });
          });

  }else if(_distributorName == 'bridge'){

      // call buy bridge as on UI
  }



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
  const insuraceAddress =  await _getDistributorContract().methods.getDistributorAddress('insurace').call();

  console.info('Calling insurace at ', insuraceAddress,' with obj; ', buyingObj);
  
  buyingObj.premium = Number(ERC20Helper.ERCtoUSDTDecimals(buyingObj.premium))

  return await new Promise((resolve, reject) => {
    _getInsuraceDistributor(insuraceAddress)
    .methods
    .buyCoverInsurace(buyingObj)
    .send({
      from: buyingObj.owner,
      value: buyingObj.premium,
    })
    .on('transactionHash', (res:any) => {
      console.log(res)
      resolve({success: res});
    })
    .on('error', (err:any, receipt:any) => {
      console.log(err)
      console.log(receipt)

      reject({error: err , receipt:receipt})
    });
  });
}

export default {
  buyCover, buyCoverInsurace
}
