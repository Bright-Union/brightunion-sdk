// import NetConfig from '@/service/config/NetConfig';
// import NexusApi  from '@/service/distributorsApi/NexusApi';

import NetConfig from './config/NetConfig';
import {getCovers, getCoversCount} from './dao/Covers'
import CatalogHelper from './helpers/catalogHelper'

export async function getCoversFrom(
  _distributorName:string
): Promise<any> {
    if(_distributorName == 'bridge'){
      return getBridgeCovers();
    }else if(_distributorName == "insurace"){
      return getInsuraceCovers();
    }else if(_distributorName == "nexus"){
      return getNexusCovers();
    }else{
      return { error: "Wrong distributor name" }
    }

}


export async function getAllCovers(

): Promise<any> {

  const coversPromiseArray:any[] = [];

  coversPromiseArray.push(getInsuraceCovers())
  coversPromiseArray.push(getNexusCovers())
  coversPromiseArray.push(getBridgeCovers())

  return Promise.all(coversPromiseArray)
  .then((_data: any) => {

    let allCovers: any[] = [];

    for(let array of _data){
      if(array) {
        allCovers = allCovers.concat(array);
      }
    }
    return allCovers;
  })

}

export  function getBridgeCovers(): Promise<any[]> {
  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'BRIDGE_MUTUAL')) {
    return  getCovers('bridge' , global.user.account , false, 50);
  }
}

export  function getNexusCovers(): Promise<any[]> {
  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'NEXUS_MUTUAL')) {
    return  getCovers('nexus' , global.user.account , false, 50);
  }
}

export  function getInsuraceCovers() : Promise<any[]> {
  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'INSURACE')) {
    return  getCovers('insurace' , global.user.account , false, 50);
  }
}

export async function getAllCoversCount(

): Promise<any> {

  const coversPromiseArray:any[] = [];

  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'NEXUS_MUTUAL')) {
    coversPromiseArray.push(getCoversCount('nexus', global.user.account, false))
  }
  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'INSURACE')) {
    coversPromiseArray.push(getCoversCount('insurace', global.user.account, false))
  }
  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'BRIDGE_MUTUAL')) {
    coversPromiseArray.push(getCoversCount('bridge', global.user.account, false))
    // coversPromiseArray.push(getCoversCountBridge())
  }

  return Promise.all(coversPromiseArray)
  .then((_data: any) => {

    let finalCount = 0;

    for(let num of _data){
      if(num) {
        finalCount = finalCount + Number(num);
      }
    }
    return finalCount;
  })

}




export default {
  getAllCovers,
  getAllCoversCount,
  getCoversFrom
}
