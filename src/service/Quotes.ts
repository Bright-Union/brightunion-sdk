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
import { getQuote } from "./dao/Quotes";
import Web3 from 'web3';
import BigNumber from 'bignumber.js'

export async function getQuotes(): Promise<any[]> {

  const bridgeQuote =  await getBridgeQuote();
  const nexusQuote =  await getNexusQuote();
  const insuraceQuote =  await getInsuraceQuote();
  const quotesArray = [
    bridgeQuote,
    nexusQuote,
    insuraceQuote
  ]

  return Promise.all(quotesArray).then(() =>{
    const mergedCoverables:object[] = [
      insuraceQuote,
      nexusQuote,
      bridgeQuote
    ];

    console.log('mergedCoverables - ' , mergedCoverables , ' - mergedCoverables');
    return mergedCoverables;
  })

}

export async function getQuoteFrom(_distributorName:string): Promise<object> {
  if(_distributorName == 'bridge'){
    return await getBridgeQuote();
  }else if(_distributorName == 'nexus'){
    return await getNexusQuote();
  }else if(_distributorName == 'insurace'){
    return await getInsuraceQuote();
  }else {
    return  {error: 'supported distributor names are: bridge, insurace, nexus'}
  }
}


export async function getBridgeQuote() : Promise<object>{


  // if (currency === 'ETH') {
  //     amountInWei = getters.eth2usd(amountInWei);
  // }

  let periodInWeeks: number = 26;
  let amountWei:string = global.user.web3.utils.toWei( '10000', 'ether');
  // let amount: string = amountInWei;
  let amount: any = global.user.web3.utils.toBN(amountWei);
  let contractAddress: string = "0x85A976045F1dCaEf1279A031934d1DB40d7b0a8f"
  let interfaceCompliant1: string = "0x0000000000000000000000000000000000000000"
  let interfaceCompliant2: string = "0x0000000000000000000000000000000000000000"
  let data:number[] = global.user.web3.utils.hexToBytes(global.user.web3.utils.numberToHex(500));

  return await getQuote(
         'bridge',
         periodInWeeks,
         amount,
         contractAddress,
         interfaceCompliant1,
         interfaceCompliant2,
         data,
    );
}

export async function getNexusQuote(): Promise<object> {

   let amount:number = 1000;
   let currency:string = 'DAI';
   let period:number = 180
   let protocol:object = { nexusCoverable:"0x11111254369792b2Ca5d084aB5eEA397cA8fa48B" };

    return await NexusApi.fetchQuote( amount , currency, period, protocol);
    // return [1,2];
  }

  export async function getInsuraceQuote() : Promise<object> {
    // web3:any, amount:string | number, currency:string , period:string, protocol:any

    let amount:number = 1000;
    let currency:string = 'DAI';
    let period:number = 180
    let protocol:object = { productId:43 };

    return await InsuraceApi.fetchInsuraceQuote( amount , currency, period, protocol);
    // return [1,2];
    // const trustWalletAssets:object[] = await CatalogHelper.getTrustWalletAssets();

  }



export default {
  getQuotes,
  getQuoteFrom,
}
