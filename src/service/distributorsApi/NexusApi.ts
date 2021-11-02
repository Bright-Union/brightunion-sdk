require('dotenv').config();
import axios from 'axios';
import NetConfig from '../config/NetConfig'
import RiskCarriers from '../config/RiskCarriers'
import CatalogHelper from '../helpers/catalogHelper'


export default class NexusApi {

    static fetchCoverables () {
        return axios.get(`https://api.nexusmutual.io/coverables/contracts.json`)
            .then((response) => {
                return response.data;
            }).catch(error => {
              console.log('ERROR Nexus fetchCoverables:',error.response.data && error.response.data.message);
            });
    }

    static fetchQuote ( amount:number, currency:string, period:number, protocol:any) :Promise<object[]> {

       if (currency === 'USD') {
           currency = RiskCarriers.NEXUS.fallbackQuotation;
       }
       if (!Number.isInteger(amount)) {
           amount = Math.round(amount);
       }

       return axios.get(
         `${NetConfig.netById(global.user.networkId).nexusAPI}/v1/quote?coverAmount=${amount}&currency=${currency}&period=${period}&contractAddress=${protocol.nexusCoverable}`
         ,
         {
           headers : {
             // Origin: process.env.API_REQUEST_ORIGIN,
           }
         }
       )

      .then((response:any) => {

        return CatalogHelper.quoteFromCoverable(
          'nexus',
          protocol,
          {
            amount: amount,
            currency: currency,
            period: period,
            chain: 'ETH',
            chainId: global.user.networkId,
            // price: priceWithFee.toString(),
            // pricePercent: new BigNumber(priceWithFee).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000), //%, annualize
            response: response.data,
            // estimatedGasPrice: estimatedGasPrice,
            // estimatedGasPriceCurrency: defaultCurrencySymbol,
            // estimatedGasPriceDefault: feeInDefaultCurrency,
          },
          {
            // activeCoversETH: activeCoversETH,
            // activeCoversDAI: activeCoversDAI,
            // capacityETH: capacityETH,
            // capacityDAI: capacityDAI,
            // totalCovers: totalCovers,
            // totalActiveCoversDAI: totalActiveCoversDAI,
            // totalActiveCoversETH: totalActiveCoversETH,
            // nexusMaxCapacityError: nexusMaxCapacityError
          }
        );




        return response.data;


      }).catch(error => {
        console.log('ERROR Nexus fetchQuote:',error.response.data && error.response.data.message);
      });
    }

    /*
    Note!
    This will give the 'base' quotation. without our possible fee.
    Use action from $store instead!
    */
    //
    // static fetchCapacity (protocol) {
    //     return axios.get(`https://api.nexusmutual.io/v1/contracts/${protocol}/capacity`)
    //         .then((response) => {
    //             return response.data
    //         });
    // }

}
