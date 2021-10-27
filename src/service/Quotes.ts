/**

    THIS IS A BUSINESS LOGIC CLASS, SINCE ITS NOT AN OUTPUT OF THE PROTOCOL
    BUT A MIX OF ONCHAIN AND HTTP DATA.

    IF WE KEEP THE CONTRACT ACCESS OBJECT CALLS IN SEPARATE DIR AND USE THEM
    ONLY TO FORM THE CUSTOM LOGIC, TYPESCRIPT CAN GIVE US THE OOO APPROACH
    WE NEED, AS OPPOSED TO THE APP UI...

*/

import NexusApi from '@/service/distributorsApi/NexusApi';
import InsuraceApi from '@/service/distributorsApi/InsuraceApi';
import CatalogHelper from '@/service/helpers/catalogHelper';


export async  function getQuote(_web3:any): Promise<any[]> {

  const nexusQuotes =  await getNexusQuote(_web3);
  const insuraceQuotes =  await getInsuraceQuotes(_web3);

  return Promise.all([nexusQuotes, insuraceQuotes]).then(() =>{
    const mergedCoverables = nexusQuotes.concat(insuraceQuotes);
    console.log(mergedCoverables , 'mergedCoverables');
    return mergedCoverables;
  })

}

export async function getNexusQuote(_web3:any): Promise<any[]> {

   let amount:number = 1000;
   let currency:string = 'ETH';
   let period:string = '180'
   let protocol:any = ''

    // return await NexusApi.fetchQuote( _web3 , amount , currency, period, protocol);
    return [1,2];
  }

  export async function getInsuraceQuotes(_web3:any) : Promise<any[]> {
    // web3:any, amount:string | number, currency:string , period:string, protocol:any

    let amount:number = 1000;
    let currency:string = 'ETH';
    let period:string = '180'
    let protocol:any = ''

    // return await InsuraceApi.fetchInsuraceQuote(_web3 , amount , currency, period, protocol);
    return [1,2];
    // const trustWalletAssets:object[] = await CatalogHelper.getTrustWalletAssets();

  }



export default {
  getQuote
}
