import axios from 'axios';
import NetConfig from '../config/NetConfig'
import BigNumber from 'bignumber.js'
import ERC20Helper from '../helpers/ERC20Helper';
import RiskCarriers from '../config/RiskCarriers'
import CatalogHelper from '../helpers/catalogHelper'
import CurrencyHelper from '../helpers/currencyHelper'
import {toBN,fromWei, toWei} from 'web3-utils'
import GasHelper from "@/service/helpers/gasHelper";
import Filters from "../helpers/filters";
import {getCoverMin} from "../helpers/cover_minimums"


class InsuraceApi {

    static fetchCoverables (netSymbol : string): Promise<object> {
        return axios.post(
            `${NetConfig.netById(global.user.networkId).insuraceAPI}/getProductList?code=${encodeURIComponent(NetConfig.netById(global.user.networkId).insuraceAPIKey)}`, {
            chain: netSymbol
        })
        .then((response:any) => {
            return response.data;
        }).catch(error =>{
          console.log('ERROR on Insurace fetchCoverables : ' , error.response.data && error.response.data.message);
          return [];
        });
    }

    static getCurrencyList (_networkId:any) {
        return axios.post(
            `${NetConfig.netById(_networkId).insuraceAPI}/getCurrencyList?code=${encodeURIComponent(NetConfig.netById(_networkId).insuraceAPIKey)}`, {
            chain: NetConfig.netById(_networkId).symbol
        })
        .then((response:any) => {
            return response.data;
        }).catch(error =>{
            console.log('ERROR on Insurace getCurrencyList : ' , error.response.data && error.response.data.message);
        });
    }

    static async getCoverPremium (
        web3:any,
        amount : any,
        currency : any,
        period : any,
        protocolId : any,
        owner : any) {

        let url = `${NetConfig.netById(web3.networkId).insuraceAPI}/getCoverPremium?code=${encodeURIComponent(NetConfig.netById(web3.networkId).insuraceAPIKey)}`;

        return  axios.post(
            url, {
                    "chain": NetConfig.netById(web3.networkId).symbol,
                    "coverCurrency": currency,
                    "productIds": [protocolId],
                    "coverDays": [period],
                    "coverAmounts": [amount],
                    "owner": owner,
                    "referralCode": NetConfig.netById(web3.networkId).insuraceReferral,

        }).then((response : any) => {
            return response.data;
        })
    }

    static async getMultipleCoverPremiums (
        web3:any,
        amounts : any[],
        currency : any,
        periods : any[],
        protocolIds : any[]
      ) {

        let url = `${NetConfig.netById(web3.networkId).insuraceAPI}/getCoverPremium?code=${encodeURIComponent(NetConfig.netById(web3.networkId).insuraceAPIKey)}`;

        return  axios.post(
            url, {
                    "chain": NetConfig.netById(web3.networkId).symbol,
                    "coverCurrency": currency,
                    "productIds": protocolIds,
                    "coverDays": periods,
                    "coverAmounts": amounts,
                    "owner": global.user.account,
                    "referralCode": NetConfig.netById(web3.networkId).insuraceReferral,

        }).then((response : any) => {
            return response.data;
        })
    }

    static confirmCoverPremium (chainSymbol :any, params : any) {

        return axios.post(
            `${NetConfig.netById(global.user.networkId).insuraceAPI}/confirmCoverPremium?code=${encodeURIComponent(NetConfig.netById(global.user.networkId).insuraceAPIKey)}`, {
            chain: chainSymbol,
            params: params
        }).then((response : any) => {
            return response.data;
        });
    }

    static async formatQuoteDataforInsurace(amount:any , currency:any, web3:any, protocol:any ) {

      let amountInWei:any= toWei(amount.toString(), 'ether');

      if (currency === 'USD') {
        currency = RiskCarriers.INSURACE.fallbackQuotation[NetConfig.netById(web3.networkId).symbol];
      }

      let currencies:object[] = await this.getCurrencyList(web3.networkId);
      let selectedCurrency:any = currencies.find((curr:any) => {return curr.name == currency});

      if (!selectedCurrency) {
        return {error: `Selected currency is not supported by InsurAce: ${currency} on net ${web3.networkId}`};
      }

      [currency, selectedCurrency] = NetConfig.insuraceDePegTestCurrency(protocol,currency,web3.symbol,selectedCurrency);

      if (NetConfig.sixDecimalsCurrency(web3.networkId, currency)) {
        amountInWei = ERC20Helper.ERCtoUSDTDecimals(amountInWei);
      }

      return {amountInWei: amountInWei, currency:currency, selectedCurrency: selectedCurrency}

    }

    static async fetchInsuraceQuote ( web3:any, amount:string | number, currency:string , period:number, protocol:any): Promise<object> {
      let quoteData = await this.formatQuoteDataforInsurace(amount, currency, web3, protocol);

        if (!quoteData.selectedCurrency) {
          return {error: `Selected currency is not supported by InsurAce: ${currency} on net ${web3.networkId}`};
        }

        web3.symbol = NetConfig.netById(web3.networkId).symbol;

        const minimumAmount= getCoverMin("insurace", web3.symbol, currency );

        return await this.getCoverPremium(
          web3,
          quoteData.amountInWei,
          quoteData.selectedCurrency.address,
          period,
          parseInt(protocol.productId),
          global.user.account,
        ).then( async (response: any) => {


          const defaultCurrencySymbol = web3.symbol === 'POLYGON' ? 'MATIC' : web3.symbol === 'BSC' ? 'BNB' : 'ETH';

            let premium: any = response.premiumAmount;

            if (NetConfig.sixDecimalsCurrency(web3.networkId, quoteData.currency)) {
                premium = ERC20Helper.USDTtoERCDecimals(premium);
                quoteData.amountInWei =  ERC20Helper.USDTtoERCDecimals(quoteData.amountInWei);
            }

            const pricePercent = new BigNumber(premium).times(1000).dividedBy(quoteData.amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000);

            global.events.emit("quote" , {
              status: "INITIAL_DATA" ,
              distributorName:"insurace",
              price: premium ,
              pricePercent:pricePercent,
              amount:quoteData.amountInWei,
              currency:quoteData.currency,
              period:period,
              protocol:protocol,
              chain: web3.symbol,
              chainId: web3.networkId,
              rawData: response,
              minimumAmount: minimumAmount,
            } );

            // const cashbackInStable = .075 * parseFloat(toBN(premium).div(toBN(10 ** 18)).toNumber().toString());

            const cashbackInInsur = Number(fromWei(response.ownerInsurReward));
            const insurPrice = CurrencyHelper.insurPrice();
            const cashbackInStable = cashbackInInsur * insurPrice;
            let cashBackPercent = (cashbackInStable / Number(fromWei(premium))) * 100;
            if ( defaultCurrencySymbol == quoteData.currency) {
              const premiumInUSD = Number(fromWei(CurrencyHelper.eth2usd(premium)));
              cashBackPercent = (cashbackInStable / premiumInUSD) * 100;
            }

            const {gasPrice, USDRate} = await GasHelper.getGasPrice(web3.symbol);

            let estimatedGasPrice;
            let feeInDefaultCurrency;

            if(gasPrice) {
                 estimatedGasPrice = (RiskCarriers.INSURACE.description.estimatedGas * gasPrice) * USDRate / (10 ** 9);
                 feeInDefaultCurrency = (RiskCarriers.INSURACE.description.estimatedGas * gasPrice) / 10 ** 9;
            } else {
                estimatedGasPrice = 0;
                feeInDefaultCurrency = 0;
            }

            const quote = CatalogHelper.quoteFromCoverable(
                'insurace',
                protocol,
                {
                    amount: quoteData.amountInWei,
                    currency: quoteData.currency,
                    period: period,
                    chain: web3.symbol,
                    chainId: web3.networkId,
                    price: premium,
                    cashBackPercent: cashBackPercent,
                    cashBack: [ cashbackInInsur , cashbackInStable ],
                    pricePercent: pricePercent,  //%, annualize
                    response: response,
                    estimatedGasPrice: estimatedGasPrice,
                    defaultCurrencySymbol: defaultCurrencySymbol,
                    feeInDefaultCurrency: feeInDefaultCurrency,
                    minimumAmount: minimumAmount,
                },
                {
                    remainingCapacity: protocol['stats_'+web3.symbol] ? protocol['stats_'+web3.symbol].capacityRemaining : 0
                }
            );

            return quote;
        })
            .catch((e) => {
                let errorMsg:any = { message: e.response && e.response.data ? e.response.data.message : e.message }

                let defaultCapacity = protocol['stats_'+web3.symbol] ? protocol['stats_'+web3.symbol].capacityRemaining : 0;

                if (errorMsg.message.includes('GPCHK') && errorMsg.includes(String(4))) {
                    errorMsg = {message:"Invalid amount or period." , errorType: "period or amount" }

                } else if (errorMsg.message.includes('GPCHK') && errorMsg.includes(String(5))) {
                  errorMsg = {message:"Invalid amount or period." , errorType: "period or amount" }

                } else if (errorMsg.message.includes('S') && errorMsg.includes(String(4))) {
                  errorMsg = {message:"Invalid amount or period." , errorType: "period or amount" }

                } else if (errorMsg.message.includes('GPCHK') && errorMsg.includes(String(3))) {
                  errorMsg = {message:"Currency is NOT a valid premium currency" , errorType: "currency" }

                } else if (errorMsg.message.includes('GPCHK') && errorMsg.includes(String(6))) {
                  errorMsg = {message:"Not sufficient capital available" , errorType: "capital" }

                } else if (errorMsg.message.match('GP: 4') || errorMsg.message.includes('cover duration is either too small or')) {
                  errorMsg = {message:"Minimum duration is 15 days. Maximum is 365" , errorType: "period" }

                } else if (errorMsg.message.includes('amount exceeds the maximum capacity')) {
                  let capacityCurrency = web3.symbol == "POLYGON" ? "MATIC" : web3.symbol == "BSC" ? "BNB" : "ETH";
                  errorMsg = { message: `Maximum available capacity is `, capacity:fromWei(defaultCapacity.toString()), currency: capacityCurrency, errorType:"capacity"}
                }
                const quote = CatalogHelper.quoteFromCoverable(
                    "insurace",
                    protocol, {
                        amount: quoteData.amountInWei,
                        currency: currency,
                        period: period,
                        chain: web3.symbol,
                        chainId: web3.networkId,
                        price: 0,
                        cashBack: [0, 0],
                        pricePercent: 0,
                        estimatedGasPrice: 0,
                        errorMsg: errorMsg,
                        minimumAmount: minimumAmount,

                    }, {
                        remainingCapacity: defaultCapacity,
                    }
                );
                return quote;
            })
    }

}
export default InsuraceApi;
