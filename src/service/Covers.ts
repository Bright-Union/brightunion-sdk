// import NetConfig from '@/service/config/NetConfig';
// import NexusApi  from '@/service/distributorsApi/NexusApi';

import NetConfig from './config/NetConfig';
import {getCovers} from './dao/Covers'

export async function getAllCovers(

): Promise<any> {

  const coversPromiseArray:any[] = [];

  coversPromiseArray.push(getNexusCovers())
  coversPromiseArray.push(getInsuraceCovers())
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

export async function getBridgeCovers(): Promise<any[]> {
    return await getCovers('bridge' , global.user.account , false, 50);
}

export async function getNexusCovers(): Promise<any[]> {
  return await getCovers('nexus' , global.user.account , false, 50);
  }

  export async function getInsuraceCovers() : Promise<any[]> {
    return await getCovers('insurace' , global.user.account , false, 50);
}


export default {
  getAllCovers,
}
