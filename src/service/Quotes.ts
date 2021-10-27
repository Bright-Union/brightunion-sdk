/**

    THIS IS A BUSINESS LOGIC CLASS, SINCE ITS NOT AN OUTPUT OF THE PROTOCOL
    BUT A MIX OF ONCHAIN AND HTTP DATA.

    IF WE KEEP THE CONTRACT ACCESS OBJECT CALLS IN SEPARATE DIR AND USE THEM
    ONLY TO FORM THE CUSTOM LOGIC, TYPESCRIPT CAN GIVE US THE OOO APPROACH
    WE NEED, AS OPPOSED TO THE APP UI...

*/

import NexusApi from './distributorsApi/NexusApi';
import InsuraceApi from './distributorsApi/InsuraceApi';
import CatalogHelper from './helpers/catalogHelper';

export async  function getQuotes(_web3:any): Promise<any[]> {

  const nexusQuote =  await getNexusQuote(_web3);
  const insuraceQuotes =  await getInsuraceQuotes(_web3);

  return Promise.all([nexusQuote, insuraceQuotes]).then(() =>{
    const mergedCoverables:object[] = [insuraceQuotes];
    mergedCoverables.push(nexusQuote);
    console.log('mergedCoverables - ' , mergedCoverables , ' - mergedCoverables');
    return mergedCoverables;
  })

}

export async function getNexusQuote(_web3:any): Promise<object> {

   let amount:number = 1000;
   let currency:string = 'DAI';
   let period:number = 180
   let protocol:object = { nexusCoverable:"0x11111254369792b2Ca5d084aB5eEA397cA8fa48B" };

    return await NexusApi.fetchQuote( _web3 , amount , currency, period, protocol);
    // return [1,2];
  }

  export async function getInsuraceQuotes(_web3:any) : Promise<object> {
    // web3:any, amount:string | number, currency:string , period:string, protocol:any

    let amount:number = 1000;
    let currency:string = 'DAI';
    let period:number = 180
    let protocol:object = { productId:43 };

    return await InsuraceApi.fetchInsuraceQuote(_web3 , amount , currency, period, protocol);
    // return [1,2];
    // const trustWalletAssets:object[] = await CatalogHelper.getTrustWalletAssets();

  }



export default {
  getQuotes
}
