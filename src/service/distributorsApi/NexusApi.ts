require('dotenv').config();
import axios from 'axios';
import NetConfig from '../config/NetConfig'
import RiskCarriers from '../config/RiskCarriers'
import CatalogHelper from '../helpers/catalogHelper'
import BigNumber from 'bignumber.js'
import {toBN, toWei} from 'web3-utils'
import {  _getNexusDistributor,
          _getNexusDistributorsContract,
          _getDistributorsContract } from '../helpers/getContract'




export default class NexusApi {

    static fetchCoverables () {
        return axios.get(`${NetConfig.netById(global.user.networkId).nexusAPI}/coverables/contracts.json`)
            .then((response) => {
                return response.data;
            }).catch(error => {
              console.log('ERROR Nexus fetchCoverables:',error.response.data && error.response.data.message);
            });
    }

    static fetchQuote ( amount:number, currency:string, period:number, protocol:any) :Promise<any> {

      const amountInWei:any = toBN(toWei(amount.toString(), 'ether'));

       if (currency === 'USD') {
           currency = RiskCarriers.NEXUS.fallbackQuotation;
       }
       if (!Number.isInteger(amount)) {
           amount = Math.round(amount);
       }

       return axios.get(
         `${NetConfig.netById(global.user.networkId).nexusAPI}/v1/quote?coverAmount=${amount}&currency=${currency}&period=${period}&contractAddress=${protocol.nexusCoverable}`,
         {
           headers : {
             // Origin: process.env.API_REQUEST_ORIGIN,
           }
         }
       )
      .then(async (response:any) => {

        let basePrice = toBN(response.data.price);
        let distributor:any;
        
        if(global.user.networkId === 1 ){ 
          distributor =  await _getNexusDistributor(NetConfig.netById(global.user.networkId).nexusDistributor)
        }else{
          const sideChainAddress = await _getDistributorsContract().methods.getDistributorAddress('nexus').call();
          distributor = await _getNexusDistributorsContract(sideChainAddress);
        }
        let fee:any = await distributor.methods.feePercentage().call();
        fee = toBN(fee);
        let priceWithFee:any = basePrice.mul(fee).div(toBN(10000)).add(basePrice);

        return CatalogHelper.quoteFromCoverable(
          'nexus',
          protocol,
          {
            amount: amountInWei,
            currency: currency,
            period: period,
            chain: 'ETH',
            chainId: global.user.networkId,
            // price: basePrice,
            price: priceWithFee.toString(),
            pricePercent: new BigNumber(priceWithFee).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000), //%, annualize
            response: response.data,
            estimatedGasPrice: 123,//estimatedGasPrice,
            estimatedGasPriceCurrency: 123, //defaultCurrencySymbol,
            estimatedGasPriceDefault: 123, //feeInDefaultCurrency,
          },
          {
            remainingCapacity: 123,
            activeCoversETH: 1, //activeCoversETH,
            activeCoversDAI: 1,//activeCoversDAI,
            capacityETH: 1,//capacityETH,
            capacityDAI: 1,//capacityDAI,
            totalCovers: 1, //totalCovers,
            totalActiveCoversDAI: 1,//totalActiveCoversDAI,
            totalActiveCoversETH: 1, //totalActiveCoversETH,
            nexusMaxCapacityError: null //nexusMaxCapacityError
          }
        );

        // return response.data;


      }).catch(function (error) {
            if ((error.response && error.response.status === 400) || (error.response && error.response.status === 409)) {
                //wrong parameters
                if (error.response.data.message.details || error.response.data.message) {
                    let errorMsg = '';
                    if(!error.response.data.message.details) {
                        errorMsg = error.response.data.message;
                    } else {
                        errorMsg = error.response.data.message.details[0].message;
                    }

                    if (errorMsg.toLowerCase().includes("\"period\" must be")) {
                        errorMsg = "Minimum duration is 30 days. Maximum is 365";
                    }
                    return new Promise((resolve) => {
                        resolve(CatalogHelper.quoteFromCoverable(
                            'nexus',
                            protocol,
                            {
                                amount: amountInWei,
                                currency: currency,
                                period: period,
                                chain: 'ETH',
                                chainId: global.user.networkId,
                                price: 0,
                                pricePercent: 0,
                                estimatedGasPrice: 0,
                                errorMsg: errorMsg,
                            },
                            {
                                // capacityETH: capacityETH,
                                // capacityDAI: capacityDAI,
                            }
                        ))
                    });
                }
            } else {
                return new Promise(() => {
                    return
                });
            }
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
