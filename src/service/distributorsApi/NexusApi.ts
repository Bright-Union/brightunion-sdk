require('dotenv').config();
import axios from 'axios';
import NetConfig from '../config/NetConfig'
import RiskCarriers from '../config/RiskCarriers'
import CatalogHelper from '../helpers/catalogHelper'
import BigNumber from 'bignumber.js'
import {toBN, toWei, asciiToHex, fromWei} from 'web3-utils'
import {  _getNexusDistributor,  _getNexusDistributorsContract, _getDistributorsContract, _getNexusQuotationContract , _getNexusMasterContract } from '../helpers/getContract'
import GasHelper from "../helpers/gasHelper"

export default class NexusApi {

    static fetchCoverables () {

      return axios.get(`${NetConfig.netById(global.user.ethNet.networkId).nexusAPI}/coverables/contracts.json`)
        // return axios.get(`https://api.nexusmutual.io/coverables/contracts.json`)
            .then((response) => {
                return response.data;
            }).catch(error => {
              console.log('ERROR Nexus fetchCoverables:',error.response.data && error.response.data.message);
            });
    }

    static fetchQuote ( amount:number, currency:string, period:number, protocol:any) :Promise<any> {

      let capacityETH:any = null;
      let capacityDAI:any = null;

     this.fetchCapacity(protocol.nexusCoverable).then((capacity:any) => {
        capacityETH = capacity.capacityETH;
        capacityDAI = capacity.capacityDAI;
      })

      const amountInWei:any = toBN(toWei(amount.toString(), 'ether'));

       if (currency === 'USD') {
           currency = RiskCarriers.NEXUS.fallbackQuotation;
       }
       if (!Number.isInteger(amount)) {
           amount = Math.round(amount);
       }

       return axios.get(
         `${NetConfig.netById(global.user.ethNet.networkId).nexusAPI}/v1/quote?coverAmount=${amount}&currency=${currency}&period=${period}&contractAddress=${protocol.nexusCoverable}`,
         {
           headers : {
             // Origin: process.env.API_REQUEST_ORIGIN,
           }
         }
       )
      .then(async (response:any) => {

        let basePrice = toBN(response.data.price);
        let distributor:any;

        if(global.user.ethNet.networkId === 1 ){
          distributor =  await _getNexusDistributor(NetConfig.netById(global.user.ethNet.networkId).nexusDistributor)
        }else{
          const sideChainAddress = await _getDistributorsContract().methods.getDistributorAddress('nexus').call();
          distributor = await _getNexusDistributorsContract(sideChainAddress);
        }
        let fee:any = await distributor.methods.feePercentage().call();
        fee = toBN(fee);
        let priceWithFee:any = basePrice.mul(fee).div(toBN(10000)).add(basePrice);
        let pricePercent = new BigNumber(priceWithFee).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000);

        global.events.emit("quote" , {
          status: "INITIAL_DATA" ,
          distributorName:"nexus",
          price: priceWithFee ,
          pricePercent:pricePercent,
          amount:amount,
          currency:currency,
          period:period,
          protocol:protocol,
          chain: 'ETH',
          chainId: global.user.ethNet.networkId,
          rawData: response.data,
        } );

        const masterAddress = await distributor.methods.master().call()
        const masterContract = await _getNexusMasterContract(masterAddress );
        const quotationAddress =  await masterContract.methods.getLatestAddress(asciiToHex('QD')).call();
        const quotationContract = await _getNexusQuotationContract(quotationAddress);
        const totalCovers = await quotationContract.methods.getCoverLength().call();
        const activeCoversETH  = await quotationContract.methods.getTotalSumAssuredSC(protocol.nexusCoverable, asciiToHex('ETH')).call();
        const activeCoversDAI = await quotationContract.methods.getTotalSumAssuredSC(protocol.nexusCoverable, asciiToHex('DAI')).call();
        const totalActiveCoversETH = await quotationContract.methods.getTotalSumAssured( asciiToHex('ETH')).call();
        const totalActiveCoversDAI = await quotationContract.methods.getTotalSumAssured(asciiToHex('DAI')).call();
        const {gasPrice, USDRate} = await GasHelper.getGasPrice(global.user.ethNet.symbol);

        let estimatedGasPrice = (RiskCarriers.NEXUS.description.estimatedGas * gasPrice) * USDRate / (10**9);
        let feeInDefaultCurrency = (RiskCarriers.NEXUS.description.estimatedGas * gasPrice) / 10**9;
        let defaultCurrencySymbol = global.user.ethNet.symbol === 'POLYGON'? 'MATIC': global.user.ethNet.symbol === 'BSC' ? 'BNB' : 'ETH';
        const nexusMaxCapacityError = this.checkNexusCapacity(currency, amountInWei.toString(), capacityETH, capacityDAI);

        return CatalogHelper.quoteFromCoverable(
          'nexus',
          protocol,
          {
            amount: amountInWei,
            currency: currency,
            period: period,
            chain: 'ETH',
            chainId: global.user.ethNet.networkId,
            price: priceWithFee.toString(),
            pricePercent: pricePercent , //%, annualize
            response: response.data,
            estimatedGasPrice:estimatedGasPrice, //estimatedGasPrice,
            defaultCurrencySymbol:defaultCurrencySymbol, //defaultCurrencySymbol,
            feeInDefaultCurrency:feeInDefaultCurrency //feeInDefaultCurrency,
          },
          {
            // remainingCapacity:123,
            activeCoversETH: activeCoversETH,
            activeCoversDAI: activeCoversDAI,
            capacityETH: capacityETH,
            capacityDAI: capacityDAI,
            totalCovers: totalCovers,
            totalActiveCoversDAI: totalActiveCoversDAI,
            totalActiveCoversETH: totalActiveCoversETH,
            nexusMaxCapacityError: nexusMaxCapacityError //nexusMaxCapacityError
          }
        );

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
                    return CatalogHelper.quoteFromCoverable(
                            'nexus',
                            protocol,
                            {
                                amount: amountInWei,
                                currency: currency,
                                period: period,
                                chain: 'ETH',
                                chainId: global.user.ethNet.networkId,
                                price: 0,
                                pricePercent: 0,
                                estimatedGasPrice: 0,
                                errorMsg: errorMsg,
                                defaultCurrencySymbol:0, //defaultCurrencySymbol,
                                feeInDefaultCurrency:0, //feeInDefaultCurrency,
                                response: {error:error},
                            },
                            {
                                capacityETH: capacityETH,
                                capacityDAI: capacityDAI,
                            }
                        );
                }
            } else {
                return new Promise(() => {
                    return {error: error}
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
    static fetchCapacity (_protocol:any) {
        return axios.get(`https://api.nexusmutual.io/v1/contracts/${_protocol}/capacity`)
            .then((response) => {
                return response.data
            });
    }

    static checkNexusCapacity(currency:any, amount:any, capacityETH:any, capacityDAI:any) {
    if(currency === 'DAI' ) {
        let capacityDifference = capacityDAI - amount;
        if(capacityDifference < 0) {
            const maxCapacity = fromWei(capacityDAI.toString());
          return `MAX capacity is ${maxCapacity} USD`
        } else {
            return null;
        }
    } else if(currency === 'ETH' ) {
        let capacityDifference = capacityETH - amount;
        if(capacityDifference < 0) {
            const maxCapacity = fromWei(capacityETH.toString());
            return `MAX capacity is ${maxCapacity} ETH`
        } else {
            return null;
        }
    }
}

}
