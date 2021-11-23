import NetConfig from "../config/NetConfig";
import Cover from "../domain/Cover";
import {_getDistributorsContract, _getInsuraceDistributor, _getInsurAceCoverDataContract, _getInsurAceProductContract} from "../helpers/getContract";
import {hexToUtf8} from 'web3-utils';

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
export async function getCoversCount(
    _distributorName : string,
    _ownerAddress: string ,
    _isActive : boolean
): Promise<number>  {

  return await _getDistributorsContract()
         .methods
         .getCoversCount(
           _distributorName,
           _ownerAddress,
           _isActive)
         .call().then((_data:any) => {
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

  console.log("global.user.networkId - - - " , global.user.networkId);

  if(global.user.networkId){

    if(_distributorName == "insurace"){
      return await getCoversInsurace();
    }else if(_distributorName == 'bridge'){
      return await getCoversBridge();
    }else if(_distributorName == 'nexus'){
      return await getCoversNexus();
    }

  }else{

    return await _getDistributorsContract()
    .methods
    .getCovers(
      _distributorName,
      _ownerAddress,
      _activeCover,
      _limit,
    ).call().then((_data:any) => {
      return _data;
    });

  }

}

export async function getCoversNexus():Promise<any>{

  console.log("getCoversNexus");

  return [];
}

export async function getCoversInsurace():Promise<any>{

  const insuraceCoverInstance = await  _getInsuraceDistributor(NetConfig.netById(global.user.networkId).insuraceCover);
  const coverDataAddress = await insuraceCoverInstance.methods.data().call();
  const coverDataInstance = await _getInsurAceCoverDataContract(coverDataAddress);
  const count =  await coverDataInstance.methods.getCoverCount(global.user.account).call();

  let allCovers:any = [];

  for (let coverId = 1; coverId <= Number(count); coverId++) {

    const expirationP = coverDataInstance.methods.getCoverEndTimestamp(global.user.account, coverId.toString()).call();
    const amountP =  coverDataInstance.methods.getCoverAmount(global.user.account, coverId.toString());
    const currencyP =   coverDataInstance.methods.getCoverCurrency(global.user.account, coverId.toString()).call();
    const statusP =  coverDataInstance.methods.getAdjustedCoverStatus(global.user.account, coverId.toString()).call();

    const productId = await coverDataInstance.methods.getCoverProductId(global.user.account, coverId.toString()).call();
    const productAddress =  await insuraceCoverInstance.methods.product().call();
    const product =  await  _getInsurAceProductContract(productAddress);
    const prodDetailsP =  product.methods.getProductDetails(productId).call()

    let coverDataPromises = [expirationP, amountP, currencyP, statusP, prodDetailsP];

    await  Promise.all(coverDataPromises).then((_data:any) => {

      const [expiration, amount, currency, status, prodDetails] = _data;

      allCovers.push(
        {
          risk_protocol: 'insurace',
          contractName: hexToUtf8(prodDetails['0']),
          logo: '',
          coverType: hexToUtf8(prodDetails['1']),
          coverAmount: amount,
          coverAsset: currency,
          endTime: expiration,
          status: status,
          net: global.user.networkId,
          rawData: prodDetails,
        }
      )

    });

  }

  return allCovers;
}

export async function getCoversBridge():Promise<any>{
  console.log("getCoversBridge");
  return [];
}


export async function getCoversCountBridge():Promise<any>{
  return [];
}

export default {
   getCovers,
   getCoversCount,
}
