import NexusApi from './distributorsApi/NexusApi';
import InsuraceApi from './distributorsApi/InsuraceApi';
import { getQuote } from "./dao/Quotes";
import CatalogHelper from './helpers/catalogHelper';
import NetConfig from '../service/config/NetConfig';


/**
 *
 * Generci call, which will return an array of quotes from all supported distributors
 *
 * @param _amount
 * @param _currency
 * @param _period
 * @param _protocol
 * @returns Array of quotes from all supported distributors
 */


export async function getQuotes(
  _amount:number,
  _currency:string, // coverAddress for bridge
  _period: number,
  _protocol:any

): Promise<any[]> {

  const nexusQuote =  await getNexusQuote(_amount, _currency, _period, _protocol);
  const insuraceQuote =  await getInsuraceQuote(_amount, _currency, _period, _protocol);
  const bridgeQuote =  await getBridgeQuote(_amount, _period, _protocol);

  const quotesArray = [
    nexusQuote,
    insuraceQuote,
    bridgeQuote,
  ]

  return Promise.all(quotesArray).then(() =>{
    const mergedCoverables:object[] = [];

    if(insuraceQuote) mergedCoverables.push(insuraceQuote);
    if(nexusQuote) mergedCoverables.push(nexusQuote);
    if(bridgeQuote) mergedCoverables.push(bridgeQuote);

    return mergedCoverables;
  })

}

/**
 *
 * Trying to normalize params since they are all very similar
 *
 * @param _distributorName
 * @param _amount
 * @param _currency
 * @param _period
 * @param _protocol
 * @returns Distributor Quote
 */
export async function getQuoteFrom(
                                    _distributorName:string,
                                    _amount:number,
                                    _currency:string, // coverAddress for bridge
                                    _period: number,
                                    _protocol:any
    ): Promise<object> {

  if(_distributorName == 'bridge'){
     return await getBridgeQuote(_amount,_period,_protocol);
  }else if(_distributorName == 'nexus'){
    return await getNexusQuote(_amount,_currency,_period,_protocol );
  }else if(_distributorName == 'insurace'){
    return await getInsuraceQuote(_amount,_currency,_period,_protocol);
  }else {
    return  {error: 'supported distributor names are: bridge, insurace, nexus'}
  }
}

/**
 *  Hard coding only interface compliant since they are CONSTANTS
 *
 * @param _amount
 * @param _period
 * @param _protocol
 * @returns
 */
 async function getBridgeQuote( _amount :any,  _period :any, _protocol :any ) : Promise<object>{

   if (CatalogHelper.availableOnNetwork(global.user.networkId, 'BRIDGE_MUTUAL') && _protocol.bridgeCoverable) {
     const quote =  await getQuote( 'bridge', _period, _amount, _protocol.bridgeCoverable,
       '0x0000000000000000000000000000000000000000',
       '0x0000000000000000000000000000000000000000',
       global.user.web3.utils.hexToBytes(global.user.web3.utils.numberToHex(500))
     );

     // mapping to bridge object Or could be mapping to UI object
     // only reason of why we have diff get<provider>Quote methods
     const bridgeQuote = {
       totalSeconds       : quote.prop1,
       totalPrice         : quote.prop2,
       totalLiquidity     : quote.prop3,
       totalCoverTokens   : quote.prop4,
       prop5              : quote.prop5,
       prop6              : quote.prop6,
       prop7              : quote.prop7
     }
     return bridgeQuote;


   }
 }



 export async function getNexusQuote( _amount :any,_currency :any,_period :any,_protocol :any ) : Promise<object> {
    if (CatalogHelper.availableOnNetwork(global.user.networkId, 'NEXUS_MUTUAL') && _protocol.nexusCoverable){
     return await NexusApi.fetchQuote( _amount , _currency, _period, _protocol);
   }
 }

 export async function getInsuraceQuote( _amount:number, _currency:string, _period: number, _protocol:any ) {
    if (CatalogHelper.availableOnNetwork(global.user.networkId, 'INSURACE') && _protocol.productId) {

      const _owner        = global.user.account;
      const chainSymbol   = NetConfig.netById(global.user.networkId).symbol;
      const premium : any = await InsuraceApi.getCoverPremium( _amount, _currency, _period,_protocol, _owner);
      const quote   : any = await InsuraceApi.confirmCoverPremium(chainSymbol, premium.params);

      return quote;
    }
}

// export async function getInsuraceQuote( _amount :any,_currency :any,_period :any,_protocol :any ) : Promise<object> {
//   if (CatalogHelper.availableOnNetwork(global.user.networkId, 'INSURACE') && _protocol.productId) {
//     return await InsuraceApi.fetchInsuraceQuote( _amount , _currency, _period, _protocol);
//   }
// }



export default getQuoteFrom;
