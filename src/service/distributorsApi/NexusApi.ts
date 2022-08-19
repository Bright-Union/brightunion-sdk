import axios from 'axios';
import NetConfig from '../config/NetConfig'
import RiskCarriers from '../config/RiskCarriers'
import CatalogHelper from '../helpers/catalogHelper'
import CurrencyHelper from '../helpers/currencyHelper';
import BigNumber from 'bignumber.js'
import {toBN, toWei, asciiToHex, fromWei} from 'web3-utils'
import {  _getNexusDistributor,  _getNexusDistributorsContract, _getDistributorsContract, _getNexusQuotationContract , _getNexusMasterContract } from '../helpers/getContract'
import {getCoverMin} from "../helpers/cover_minimums"
import UniswapV3Api from '../helpers/UniswapV3Api';


export default class NexusApi {

    static fetchCoverables () {

      return axios.get(`${NetConfig.netById(global.user.ethNet.networkId).nexusAPI}/coverables/contracts.json`)
        // return axios.get(`https://api.nexusmutual.io/coverables/contracts.json`)
            .then((response) => {
                return response.data;
            }).catch(error => {
              return [];
            });
    }

    static async setNXMBasedquotePrice ( priceInNXM:any , quoteCurrency: string, fee:any ){

      let priceInNXMWithFee:any = fromWei(priceInNXM.mul(fee).div(toBN(10000)).add(priceInNXM));

      priceInNXMWithFee = Number(priceInNXMWithFee);

      let [ priceInCurrencyFromNXM, routeData ]: any = await UniswapV3Api.getNXMPriceFor(quoteCurrency, priceInNXMWithFee );

      const BrightFeeCoef:any = toBN(120); // Margin added - 20%
      let finalPrice:any = null;
      if(priceInCurrencyFromNXM){
        finalPrice = toBN(priceInCurrencyFromNXM).mul(BrightFeeCoef).div(toBN(100))
      }

      return [ finalPrice, priceInCurrencyFromNXM ? toBN(priceInCurrencyFromNXM) : null ,routeData ] ;
    }

    static async fetchQuote ( amount:number, currency:string, period:number, protocol:any) :Promise<any> {

      let capacityETH:any = null;
      let capacityDAI:any = null;

      let quoteCapacity:any = null;

     await this.fetchCapacity(protocol.nexusCoverable).then((capacity:any) => {
        capacityETH = capacity.capacityETH;
        capacityDAI = capacity.capacityDAI;
        quoteCapacity = currency === 'ETH' ? capacityETH : capacityDAI;
      })



      const amountInWei:any = toBN(toWei(amount.toString(), 'ether'));

       if (currency === 'USD') {
           currency = RiskCarriers.NEXUS.fallbackQuotation;
       }

       const minimumAmount= getCoverMin("nexus", global.user.ethNet.symbol , currency );


       let quote:any = CatalogHelper.quoteFromCoverable(
         'nexus',
         protocol,
         {
           status: "INITIAL_DATA" ,
           amount: amountInWei,
           currency: currency,
           period: period,
           chain: 'ETH',
           chainId: global.user.ethNet.networkId,
           minimumAmount: minimumAmount,
           capacity: quoteCapacity,
         },
         {
         }
       );

       return axios.get(
         `${NetConfig.netById(global.user.ethNet.networkId).nexusAPI}/v1/quote?coverAmount=${amount}&currency=${currency}&period=${period}&contractAddress=${protocol.nexusCoverable}`,
         {
           headers : {
           }
         }
       )
      .then(async (response:any) => {

        let basePrice = toBN(response.data.price);

        const distributor = await _getNexusDistributorsContract(NetConfig.netById(global.user.ethNet.networkId).nexusDistributor);
        // hardcoded address, as Bright Distributors contract cannot be called by passive net - fix for Nexus Multichain Quotation
        let fee:any = await distributor.methods.feePercentage().call();
        fee = toBN(fee);

        let priceWithFee:any = basePrice.mul(fee).div(toBN(10000)).add(basePrice);

        const nexusMaxCapacityError = this.checkNexusCapacity(currency, amountInWei.toString(), capacityETH, capacityDAI);

        let pricePercentNXM:any = null;
        let pricePercent:any = 0;
        let [ nxmBasedPrice, nxmBasedPriceNoMargin]:any = [ null, 0 ];
        let routeData:any = {};

        if(!nexusMaxCapacityError){

          [ nxmBasedPrice, nxmBasedPriceNoMargin, routeData] = await NexusApi.setNXMBasedquotePrice( toBN(response.data.priceInNXM) , currency , fee );

          pricePercent = new BigNumber(priceWithFee).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000);

          if( nxmBasedPrice && nxmBasedPrice > 0 ){
            pricePercentNXM = new BigNumber(nxmBasedPrice).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000);
          }
        }


        quote.rawData =  response.data;
        quote.errorMsg =  nexusMaxCapacityError;
        quote.uniSwapRouteData =  routeData;
        quote.priceOrigin = priceWithFee.toString();
        quote.price = nxmBasedPrice ? nxmBasedPrice : priceWithFee;
        quote.priceNoMargin = nxmBasedPriceNoMargin;
        quote.pricePercentOrigin =pricePercent;
        quote.pricePercent =pricePercentNXM ? pricePercentNXM : pricePercent;
        quote.priceInNXM = response.data.priceInNXM;

        global.events.emit("quote" , quote );

        const masterAddress = await distributor.methods.master().call()
        const masterContract = await _getNexusMasterContract(masterAddress );
        const quotationAddress =  await masterContract.methods.getLatestAddress(asciiToHex('QD')).call();
        const quotationContract = await _getNexusQuotationContract(quotationAddress);
        const totalCovers = await quotationContract.methods.getCoverLength().call();
        const activeCoversETH  = await quotationContract.methods.getTotalSumAssuredSC(protocol.nexusCoverable, asciiToHex('ETH')).call();
        const activeCoversDAI = await quotationContract.methods.getTotalSumAssuredSC(protocol.nexusCoverable, asciiToHex('DAI')).call();
        const totalActiveCoversETH = await quotationContract.methods.getTotalSumAssured( asciiToHex('ETH')).call();
        const totalActiveCoversDAI = await quotationContract.methods.getTotalSumAssured(asciiToHex('DAI')).call();

        let defaultCurrencySymbol = NetConfig.netById(global.user.ethNet.networkId).defaultCurrency;

        quote.stats = {
          activeCoversETH: activeCoversETH,
          activeCoversDAI: activeCoversDAI,
          capacityETH: capacityETH,
          capacityDAI: capacityDAI,
          totalCovers: totalCovers,
          totalActiveCoversDAI: totalActiveCoversDAI,
          totalActiveCoversETH: totalActiveCoversETH,
        }
        quote.defaultCurrencySymbol = defaultCurrencySymbol;
        quote.status = "FINAL_DATA";

        return  quote;

      }).catch(function (error) {

            if ( (error.response && error.response.status === 400) || (error.response && error.response.status === 409) ) {
                //wrong parameters
                if (error.response.data.message.details || error.response.data.message) {
                    let errorMsg:any = null;
                    if(!error.response.data.message.details) {
                        errorMsg = {message: error.response.data.message};
                    } else {
                        errorMsg = {message:error.response.data.message.details[0].message }
                    }
                    if (errorMsg.message.toLowerCase().includes("\"period\" must be")) {
                        errorMsg = { message: "Minimum duration is 30 days. Maximum is 365" , errorType: "period"};
                    }
                    if  (errorMsg.message.includes("coverAmount") && errorMsg.message.includes("required pattern")){
                       errorMsg = { message: "Nexus supports only whole amounts to cover (e.g. 1999)" , errorType: "amount"};
                    }
                    if  (errorMsg.message.includes("only allows ETH as a currency")){
                       errorMsg = { message: "Nexus supports only ETH currency for this cover"};
                    }

                    quote.priceOrigin = 0,
                    quote.price =  0,
                    quote.pricePercentOrigin = 0,
                    quote.pricePercent = 0,
                    quote.errorMsg = errorMsg,
                    quote.rawData = {error:error},
                    quote.status = {
                      capacityETH: capacityETH,
                      capacityDAI: capacityDAI,
                    };
                    quote.errorMsg = errorMsg;
                    quote.status = "FINAL_DATA";

                    return quote ;
                }
            } else {
              return {error: error}
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
          return { message: `Maximum available capacity is `, capacity:maxCapacity, currency:"USD", errorType:"capacity"}
        } else {
            return null;
        }
    } else if(currency === 'ETH' ) {
        let capacityDifference = capacityETH - amount;
        if(capacityDifference < 0) {
            const maxCapacity = fromWei(capacityETH.toString());
            return { message: `Maximum available capacity is `, capacity:maxCapacity, currency:"ETH", errorType:"capacity"}
        } else {
            return null;
        }
    }
}

}
