// import NetConfig from '@/service/config/NetConfig';
// import NexusApi  from '@/service/distributorsApi/NexusApi';

import NetConfig from './config/NetConfig';
import {getCovers, getCoversCount} from './dao/Covers'

export async function getAllCovers(

): Promise<any> {

  const coversPromiseArray:any[] = [];

  coversPromiseArray.push(getInsuraceCovers())
  coversPromiseArray.push(getBridgeCovers())
  // coversPromiseArray.push(getNexusCovers())

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
    return  getCovers('bridge' , global.user.account , false, 50);
}

export  function getNexusCovers(): Promise<any[]> {
  return  getCovers('nexus' , global.user.account , false, 50);
  }

  export  function getInsuraceCovers() : Promise<any[]> {
    return  getCovers('insurace' , global.user.account , false, 50);
}

export async function getAllCoversCount(

): Promise<any> {

  const coversPromiseArray:any[] = [];

  coversPromiseArray.push(getCoversCount('insurace', global.user.account, false))
  coversPromiseArray.push(getCoversCount('bridge', global.user.account, false))
  // coversPromiseArray.push(getCoversCount('nexus', global.user.account, false))

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
  getAllCoversCount
}
