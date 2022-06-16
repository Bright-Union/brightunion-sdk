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
      return getInsuraceCovers(global.user.web3);
    }else if(_distributorName == "nexus"){
      return getNexusCovers();
    }else if(_distributorName == "ease"){
      return getEaseCovers();
    }else{
      return { error: "Wrong distributor name" }
    }

}


export async function getAllCovers(

): Promise<any> {

  const coversPromiseArray:any[] = [];

  coversPromiseArray.push(getInsuraceCovers(global.user.web3))
  coversPromiseArray.push(getBridgeCovers())
  coversPromiseArray.push(getNexusCovers())
  coversPromiseArray.push(getEaseCovers())

  for (let net of global.user.web3Passive) {
    coversPromiseArray.push( getInsuraceCovers(net))
  }

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
    return  getCovers(null, 'bridge' , global.user.account , false, 50);
  }
}

export  function getNexusCovers(): Promise<any[]> {
  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'NEXUS_MUTUAL')) {
    return  getCovers( null, 'nexus' , global.user.account , false, 50);
  }
}

export  function getEaseCovers(): Promise<any[]> {
  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'EASE')) {
    return  getCovers( null, 'ease' , global.user.account , false, 50);
  }
}

export  function getInsuraceCovers(_web3:any) : Promise<any[]> {

  if(!_web3.networkId){ // if not passive net
    const newWeb3Instance = {
        account: global.user.account,
        networkId: global.user.networkId,
        symbol: NetConfig.netById(global.user.networkId).symbol,
        web3Instance: _web3,
        readOnly: false,
      }
      _web3 = newWeb3Instance;
  }

  if (CatalogHelper.availableOnNetwork(_web3.networkId, 'INSURACE')) {
    return  getCovers(_web3, 'insurace' , _web3.account , false, 50);
  }
}

export async function getAllCoversCount(

): Promise<any> {

  const coversPromiseArray:any[] = [];

  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'NEXUS_MUTUAL' )) {
    coversPromiseArray.push(getCoversCount('nexus', global.user.account, false))
  }
  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'INSURACE')) {
    coversPromiseArray.push(getCoversCount('insurace', global.user.account, false))
  }
  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'EASE')) {
    coversPromiseArray.push(getCoversCount('ease', global.user.account, false))
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
