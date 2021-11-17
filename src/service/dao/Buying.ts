import BuyReceipt from "../domain/BuyReceipt";
import {_getDistributorContract,_getInsuraceDistributor, _getNexusDistributor, _getBridgePolicyBookContract} from "../helpers/getContract";
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
  buyingWithNetworkCurrency:boolean,
):Promise<any>{

  if(_distributorName == 'nexus'){
    const nexusAddress =  await _getDistributorContract().methods.getDistributorAddress('nexus').call();

    const sendValue = buyingWithNetworkCurrency ? _maxPriceWithFee : 0;

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
      .send({
        from: _ownerAddress,
        value: sendValue,
        // value: _maxPriceWithFee ,
      })
      .on('transactionHash', (res:any) => { resolve({success:res}); })
      .on('error', (err:any, receipt:any) => { reject( {error: err, receipt:receipt}) });
    });

  }else if(_distributorName == 'bridge'){
    const  bookContract = _getBridgePolicyBookContract(_contractAddress, global.user.web3 );

    // convert period from days to bridge epochs (weeks)
    let epochs = Math.min(52, Math.ceil(_coverPeriod / 7));

    bookContract.methods.buyPolicy( epochs, _sumAssured )
    .send({from: global.user.account})
    .on('transactionHash', (transactionHash:any) => {
      // this.referringConfirming();
    })
    .on('confirmation', (confirmationNumber:any) => {
    })
    .on('error', (err:any, receipt:any) => {

    })

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

export async function buyCoverInsurace(buyingObj:any , buyingWithNetworkCurrency:boolean){
  const insuraceAddress =  await _getDistributorContract().methods.getDistributorAddress('insurace').call();

  const sendValue = buyingWithNetworkCurrency ? buyingObj.premium : 0;

  return await new Promise((resolve, reject) => {
    _getInsuraceDistributor(insuraceAddress)
    .methods
    .buyCoverInsurace(buyingObj)
    .send({
      from: buyingObj.owner,
      // value: 0,
      value: sendValue,
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
