import DISTRIBUTORS from "../../service/distributors_config";
import getDistributorContract from "../../service/helpers/getContract";
import Cover from "../../service/domain/Cover";

export function getCoversCount(_distributorName : string, _owner: string , _isActive : boolean ) { // define address tyoe as hash

  console.log('getCoversCount', _distributorName, _owner , _isActive , 'xxx');
}

export function _getDistributorAddress() : Promise<object>  {
  return;
}

// getAllCovers()

export async function  getCoversFrom(web3: object, distributorName:string) : Promise<object>  {

  // DISTRIBUTORS
  for (var dist  in DISTRIBUTORS) {
    console.log(dist , 'asdasd' , DISTRIBUTORS);
    // get covers
  }

  const DistributorName = distributorName
  const OwnerAddress = ''
  const ActiveCover = ''
  const limit = ''

  console.log(web3 , 'web3');

  return await getDistributorContract(DistributorName , web3).methods.getCovers(DistributorName,OwnerAddress,ActiveCover,limit)
  .call()
  .then((covers : any[] )  => {

    let coversFinal: Cover[] = [];

    covers.forEach( _coverData =>{

      const coverFormat = {
        coverType    : _coverData[1],
        productId    : _coverData[3],
        contractName : _coverData[2],
        coverAmount  : _coverData[4],
        premium      : _coverData[5],
      }
      const cover:Cover = coverFormat;
      coversFinal.push(cover);
    });
    return coversFinal;

  }).catch((error:object) => {
    console.error('[protocol-balance] error:', error);
    // return res.sendStatus(400);
  });

}

export function _getQuote() : Promise<object>  {
  return;
}

export function _buyCover() :  Promise<object>  {
  return;
}

export function _buyCoverDecode() :  Promise<object>  {
  return;
}

export default {
  getCoversFrom,
  getCoversCount
}
