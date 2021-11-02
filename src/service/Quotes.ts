import NexusApi from './distributorsApi/NexusApi';
import InsuraceApi from './distributorsApi/InsuraceApi';
import { getQuote } from "./dao/Quotes";
import CatalogHelper from './helpers/catalogHelper';
import NetConfig from '../service/config/NetConfig';


/**
 *
 * Simple to fetch http premiums and quotes from distributors
 * 
 * @remarks
 * Bridge is native contract call to Bridge Mutual contract
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
     const quote =  await getQuote( 'bridge', _period, _amount, _protocol.bridgeProductAddress,
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

 export async function getNexusQuote( _amount :any,_currency :any,_period :any,_protocol :any ) : Promise<object> {
     return await NexusApi.fetchQuote( _amount , _currency, _period, _protocol);
 }

 export async function getInsuraceQuote( _amount:number, _currency:string, _period: number, _protocol:any ) {
      const _owner        = global.user.account;
      const chainSymbol   = NetConfig.netById(global.user.networkId).symbol;
      const premium : any = await InsuraceApi.getCoverPremium( _amount, _currency, _period,_protocol, _owner);
      const confirm       = await InsuraceApi.confirmCoverPremium(chainSymbol,premium.params);
      
      return confirm;
}



export default getQuoteFrom;
