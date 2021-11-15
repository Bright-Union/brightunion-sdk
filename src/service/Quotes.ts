import NexusApi from './distributorsApi/NexusApi';
import InsuraceApi from './distributorsApi/InsuraceApi';
import { getQuote } from "./dao/Quotes";
import CatalogHelper from './helpers/catalogHelper';
import NetConfig from '../service/config/NetConfig';
import CurrencyHelper from './helpers/currencyHelper';
import RiskCarriers from './config/RiskCarriers';


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
  const quotesPromiseArray = [];

  quotesPromiseArray.push(getQuoteFrom('nexus', _amount, _currency, _period, _protocol))
  quotesPromiseArray.push(getQuoteFrom('insurace' , _amount, _currency, _period, _protocol))
  quotesPromiseArray.push(getQuoteFrom('bridge' , _amount, _currency, _period, _protocol))

  for (let net of global.user.web3Passive) {
    quotesPromiseArray.push( getInsuraceQuote(net , _amount, _currency, _period, _protocol))
  }

  return Promise.all(quotesPromiseArray).then((data:any) => {
    const allQuotes:object[] = data.filter((q:any) => { if(q)return q });

    return allQuotes;
  })

}

/**
 *
 * Get Quote from specific Distributor
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

      //prepare Multichain Quote logc from UI
      // let ethereum = [global.user.web3, ...global.user.web3Passive].find(net => {
        //   console.log(net);
        //   return net.symbol === 'ETH'
        // });

  if(_distributorName == 'bridge'){
     return await getBridgeQuote(_amount,_currency,_period,_protocol);
  }else if(_distributorName == 'nexus'){
    return await getNexusQuote(_amount,_currency,_period,_protocol );
  }else if(_distributorName == 'insurace'){
    return await getInsuraceQuote( global.user.web3 , _amount,_currency,_period,_protocol);
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
 async function getBridgeQuote(_amount :any, _currency:any, _period :any, _protocol :any ) : Promise<object>{

   if (CatalogHelper.availableOnNetwork(global.user.networkId, 'BRIDGE_MUTUAL') && _protocol.bridgeProductAddress) {

     let amountInWei:any = global.user.web3.utils.toWei(_amount.toString(), 'ether');

     if (_currency === 'ETH') {
       amountInWei = CurrencyHelper.eth2usd(amountInWei);
     }
     _currency = RiskCarriers.BRIDGE.fallbackQuotation;

     const bridgeEpochs = Math.min(52, Math.ceil(Number(_period) / 7));

     const quote =  await getQuote(
       'bridge',
       bridgeEpochs,
       amountInWei,
      _protocol.bridgeProductAddress,
     '0x0000000000000000000000000000000000000000',
     '0x0000000000000000000000000000000000000000',
     global.user.web3.utils.hexToBytes(global.user.web3.utils.numberToHex(500)),
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
       prop7              : quote.prop7,
     }

     const actualPeriod = Math.floor(Number(bridgeQuote.totalSeconds) / 3600 / 24);

     return CatalogHelper.quoteFromCoverable(
       'bridge',
       _protocol,
       {
         amount: amountInWei,
         currency: _currency,
         period: _period,
         chain: '',
         chainId: global.user.networkId,
         actualPeriod: actualPeriod,
         price: bridgeQuote.totalPrice,
         response: bridgeQuote,
         // pricePercent: new BigNumber(totalPrice).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(actualPeriod)).times(365).times(100).toNumber() / 1000, //%, annualize
         // estimatedGasPrice: estimatedGasPrice,
         // estimatedGasPriceCurrency: defaultCurrencySymbol,
         // estimatedGasPriceDefault: feeInDefaultCurrency
       },
       {
         // totalUSDTLiquidity: toBN(totalLiquidity),
         // maxCapacity: _stats[0].maxCapacity,
         // stakedSTBL: _stats[0].stakedSTBL,
         // activeCovers: toBN(coverTokens),
         // utilizationRatio: toBN(coverTokens).mul(toBN(10000)).div(toBN(totalLiquidity)).toNumber() / 100,
       }
     );


   }
 }


 export async function getNexusQuote( _amount :any,_currency :any,_period :any,_protocol :any ) : Promise<object> {
    if (CatalogHelper.availableOnNetwork(global.user.networkId, 'NEXUS_MUTUAL') && _protocol.nexusCoverable){
     return await NexusApi.fetchQuote( _amount , _currency, _period, _protocol);
   }
 }


export async function getInsuraceQuote( _web3:any, _amount :any,_currency :any,_period :any,_protocol :any ) : Promise<object> {

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

  if (CatalogHelper.availableOnNetwork(_web3.networkId, 'INSURACE') && _protocol.productId) {
    return await InsuraceApi.fetchInsuraceQuote(_web3, _amount , _currency, _period, _protocol);
  }
}


// export async function getInsuraceQuoteWithConfirm( _amount:number, _currency:string, _period: number, _protocol:any ) {
//   if (CatalogHelper.availableOnNetwork(global.user.networkId, 'INSURACE') && _protocol.productId) {
//
//     const _owner        = global.user.account;
//     const chainSymbol   = NetConfig.netById(global.user.networkId).symbol;
//     const premium : any = await InsuraceApi.getCoverPremium( _amount, _currency, _period,_protocol, _owner);
//     const quote   : any = await InsuraceApi.confirmCoverPremium(chainSymbol, premium.params);
//
//     return quote;
//   }
// }


export default {
  getQuoteFrom,
  // getInsuraceQuoteWithConfirm
};
