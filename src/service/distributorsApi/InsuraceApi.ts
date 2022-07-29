import axios from 'axios';
import NetConfig from '../config/NetConfig'
import BigNumber from 'bignumber.js'
import ERC20Helper from '../helpers/ERC20Helper';
import RiskCarriers from '../config/RiskCarriers'
import CatalogHelper from '../helpers/catalogHelper'
import CurrencyHelper from '../helpers/currencyHelper'
import {toBN,fromWei, toWei} from 'web3-utils'
import Filters from "../helpers/filters";
import {getCoverMin} from "../helpers/cover_minimums"
// import * as Sentry from "@sentry/browser";

class InsuraceApi {

    static fetchCoverables (netId : any): Promise<object> {

      const netConfig = NetConfig.netById(netId);

        return axios.post(
            `${netConfig.insuraceAPI}/getProductList?code=${encodeURIComponent(netConfig.insuraceAPIKey)}`, {
            chain: netConfig.symbol
        })
        .then((response:any) => {
            return response.data;
        }).catch(error =>{
          global.sentry.captureException(error);
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
          global.sentry.captureException(error);
        });
    }

    static async getCoverPremium (
        web3:any,
        amount : any,
        currency : any,
        period : any,
        protocolId : any,
        owner : any) {

        let url = `${NetConfig.netById(web3.networkId).insuraceAPI}/getCoverPremiumV2?code=${encodeURIComponent(NetConfig.netById(web3.networkId).insuraceAPIKey)}`;

        return  axios.post(
            url, {
                    "chain": NetConfig.netById(web3.networkId).symbol,
                    "coverCurrency": currency,
                    "premiumCurrency": currency,
                    "productIds": [protocolId],
                    "coverDays": [period],
                    "coverAmounts": [amount],
                    "coveredAddresses": [global.user.account],
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

        let url = `${NetConfig.netById(web3.networkId).insuraceAPI}/getCoverPremiumV2?code=${encodeURIComponent(NetConfig.netById(web3.networkId).insuraceAPIKey)}`;

        return  axios.post(
            url, {
                    "chain": NetConfig.netById(web3.networkId).symbol,
                    "coverCurrency": currency.address,
                    "premiumCurrency": currency,
                    "productIds": protocolIds,
                    "coverDays": periods,
                    "coverAmounts": amounts,
                    "coveredAddresses": [global.user.account],
                    "owner": global.user.account,
                    "referralCode": NetConfig.netById(web3.networkId).insuraceReferral,

        }).then((response : any) => {
          let quote:any = response.data;
          quote.currency = currency;
          return quote;
        })
    }

    static confirmCoverPremium (chainSymbol :any, params : any) {

        return axios.post(
            `${NetConfig.netById(global.user.networkId).insuraceAPI}/confirmCoverPremiumV2?code=${encodeURIComponent(NetConfig.netById(global.user.networkId).insuraceAPIKey)}`, {
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

    static formatCapacity(_currency:any, _quoteCapacity:any, _chain:any ){
      if(_currency === 'ETH') {
        return CurrencyHelper.usd2eth(ERC20Helper.USDTtoERCDecimals(_quoteCapacity ) )
      } else {
        if(_chain == "BSC"){
          return _quoteCapacity;
        }else {
          return ERC20Helper.USDTtoERCDecimals(_quoteCapacity);
        }
      }
    }

    static async fetchInsuraceQuote ( web3:any, amount:string | number, currency:string , period:number, protocol:any): Promise<object> {

      let quoteData = await this.formatQuoteDataforInsurace(amount, currency, web3, protocol);

        if (!quoteData.selectedCurrency) {
          return {error: `Selected currency is not supported by InsurAce: ${currency} on net ${web3.networkId}`};
        }

        web3.symbol = NetConfig.netById(web3.networkId).symbol;

        const minimumAmount = getCoverMin("insurace", web3.symbol, quoteData.selectedCurrency.name );

        return await this.getCoverPremium(
          web3,
          quoteData.amountInWei,
          quoteData.selectedCurrency.address,
          period,
          parseInt(protocol.productId),
          global.user.account,
        ).then( async (response: any) => {

          const defaultCurrencySymbol = NetConfig.netById(web3.networkId).defaultCurrency;

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


            const cashbackInInsur = Number(fromWei(response.ownerInsurReward));
            let cashbackInQuoteCurrency:any = cashbackInInsur * CurrencyHelper.insurPrice();

            if (quoteData.currency == "ETH") {
              cashbackInQuoteCurrency = fromWei(CurrencyHelper.usd2eth(toWei(cashbackInQuoteCurrency.toString())));
            }

            let cashBackPercent:number = (cashbackInQuoteCurrency / Number(fromWei(premium))) * 100;

            cashBackPercent = cashBackPercent ? Number(cashBackPercent.toFixed(1)) : 7.5;

            const quoteCapacity:any = this.formatCapacity( currency , protocol['stats_'+web3.symbol] ? protocol['stats_'+web3.symbol].capacityRemaining : 0 , web3.symbol );

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
                    cashBack: [ cashbackInInsur , cashbackInQuoteCurrency ],
                    pricePercent: pricePercent,  //%, annualize
                    response: response,
                    defaultCurrencySymbol: defaultCurrencySymbol,
                    minimumAmount: minimumAmount,
                    capacity: quoteCapacity,
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

                const quoteCapacity:any = this.formatCapacity( currency , protocol['stats_'+web3.symbol] ? protocol['stats_'+web3.symbol].capacityRemaining : 0 , web3.symbol );

                if (errorMsg.message.match('GP: 4') || errorMsg.message.includes('cover duration is either too small or')) {
                  errorMsg = {message:"Minimum duration is 15 days. Maximum is 90" , errorType: "period" }

                } else if (errorMsg.message.includes('exceeds available capacity')) {
                  let capacityCurrency = web3.symbol == "POLYGON" ? "MATIC" : web3.symbol == "BSC" ? "BNB" : "ETH";
                  errorMsg = { message: `Maximum available capacity is `, capacity: fromWei(quoteCapacity.toString()), currency: capacityCurrency, errorType:"capacity"}
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
                        capacity: quoteCapacity,

                    }, {
                        remainingCapacity: defaultCapacity,
                    }
                );
                return quote;
            })
    }

}
export default InsuraceApi;
