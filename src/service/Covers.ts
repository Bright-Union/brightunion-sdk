// import NetConfig from '@/service/config/NetConfig';
// import NexusApi  from '@/service/distributorsApi/NexusApi';

import NetConfig from './config/NetConfig';


export async function getAllCovers(
  // _distributorName : string,
  // _ownerAddress : string,
  // _activeCover : boolean,
  // _limit : number,

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

  return;
  }

export async function getNexusCovers(): Promise<any[]> {

    return ;
  }

  export async function getInsuraceCovers() : Promise<object[]> {
    return;
}


export default {
  getAllCovers,
}
