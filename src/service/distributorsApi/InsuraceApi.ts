import axios from 'axios';
import NetConfig from '../config/NetConfig'
import BigNumber from 'bignumber.js'
import ERC20Helper from '../helpers/ERC20Helper';
import RiskCarriers from '../config/RiskCarriers'
import CatalogHelper from '../helpers/catalogHelper'
import CurrencyHelper from '../helpers/currencyHelper'
import {toBN,fromWei, toWei} from 'web3-utils'
import GasHelper from "@/service/helpers/gasHelper";


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
        // .catch(error =>{
        //     console.log('ERROR on Insurace getCoverPremium : ' , error.response.data && error.response.data.message);
        //     return error;
        // });
    }

    static confirmCoverPremium (chainSymbol :any, params : any) {

        return axios.post(
            `${NetConfig.netById(global.user.networkId).insuraceAPI}/confirmCoverPremium?code=${encodeURIComponent(NetConfig.netById(global.user.networkId).insuraceAPIKey)}`, {
            chain: chainSymbol,
            params: params
        }).then((response : any) => {
            return response.data;
        }).catch(error =>{
            console.log('ERROR on Insurace confirmCoverPremium : ', error.response.data && error.response.data.message);
        });
    }


    static async fetchInsuraceQuote ( web3:any, amount:string | number, currency:string , period:number, protocol:any): Promise<object> {
        let quoteCurrency = currency;

        let amountInWei = toWei(amount.toString(), 'ether');

        if (currency === 'USD') {
          currency = RiskCarriers.INSURACE.fallbackQuotation[NetConfig.netById(web3.networkId).symbol];
        }

        if (NetConfig.sixDecimalsCurrency(web3.networkId, currency)) {
          amountInWei = ERC20Helper.ERCtoUSDTDecimals(amountInWei);
        }

        let currencies:object[] = await this.getCurrencyList(web3.networkId);
        let selectedCurrency:any = currencies.find((curr:any) => {return curr.name == currency});

        if (!selectedCurrency) {
          return {error: `Selected currency is not supported by InsurAce: ${currency} on net ${web3.networkId}`};
        }

        web3.symbol = NetConfig.netById(web3.networkId).symbol;

        [currency, selectedCurrency] = NetConfig.insuraceDePegTestCurrency(protocol,currency,web3.symbol,selectedCurrency);

        return await this.getCoverPremium(
          web3,
          amountInWei,
          selectedCurrency.address,
          period,
          parseInt(protocol.productId),
          global.user.account,
        ).then( async (response: any) => {

          const defaultCurrencySymbol = web3.symbol === 'POLYGON' ? 'MATIC' : web3.symbol === 'BSC' ? 'BNB' : 'ETH';
            let premium: number = response.premiumAmount;
            if (NetConfig.sixDecimalsCurrency(web3.networkId, currency)) {
                premium = Number(ERC20Helper.USDTtoERCDecimals(premium));
            }
            const pricePercent = new BigNumber(premium).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000);

            global.events.emit("quote" , {
              status: "INITIAL_DATA" ,
              distributorName:"insurace",
              price: premium ,
              pricePercent:pricePercent,
              amount:amountInWei,
              currency:currency,
              period:period,
              protocol:protocol,
              chain: web3.symbol,
              chainId: web3.networkId,
              rawData: response,
            } );

            const cashbackInStable = .075 *
                parseFloat(toBN(premium)
                    .div(toBN(10 ** 18)).toNumber().toString());


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

            const insurPrice = CurrencyHelper.insurPrice();

            const quote = CatalogHelper.quoteFromCoverable(
                'insurace',
                protocol,
                {
                    amount: amountInWei,
                    currency: currency,
                    period: period,
                    chain: web3.symbol,
                    chainId: web3.networkId,
                    price: premium,
                    cashBack: [(cashbackInStable / insurPrice), cashbackInStable],
                    cashBackInWei: toWei(cashbackInStable.toString(), 'ether'),
                    pricePercent: pricePercent,  //%, annualize
                    response: response,
                    estimatedGasPrice: estimatedGasPrice,
                    estimatedGasPriceCurrency: defaultCurrencySymbol,
                    estimatedGasPriceDefault: feeInDefaultCurrency
                },
                {
                    remainingCapacity: protocol['stats_'+currency] ? protocol['stats_'+currency].capacityRemaining : 0
                }
            );
            return quote;
        })
            .catch((e) => {
                let errorMsg = e.response && e.response.data ? e.response.data.message : e.message;

                let defaultCapacity = protocol['stats_'+currency] ? protocol['stats_'+currency].capacityRemaining : 0;


                if (errorMsg.includes('GPCHK') && errorMsg.includes(String(4))) {
                    errorMsg = "Invalid amount or period.";
                } else if (errorMsg.includes('GPCHK') && errorMsg.includes(String(5))) {
                    errorMsg = "Invalid amount or period";
                } else if (errorMsg.includes('S') && errorMsg.includes(String(4))) {
                    errorMsg = "Invalid amount or period";
                } else if (errorMsg.includes('GPCHK') && errorMsg.includes(String(3))) {
                    errorMsg = "Currency is NOT a valid premium currency"
                } else if (errorMsg.includes('GPCHK') && errorMsg.includes(String(6))) {
                    errorMsg = "Not sufficient capital available"
                } else if (errorMsg.match('GP: 4')) {
                    errorMsg = "Minimum duration is 1 day. Maximum is 365";
                } else if (errorMsg.includes('amount exceeds the maximum capacity')) {
                    let currency = 'ETH';
                    if (quoteCurrency === 'USD') {
                        defaultCapacity = CurrencyHelper.eth2usd(defaultCapacity);
                        currency = 'USD';
                    }
                    errorMsg = `MAX capacity is ${fromWei(defaultCapacity.toString())} ${currency}`
                }
                const quote = CatalogHelper.quoteFromCoverable(
                    "insurace",
                    protocol, {
                        amount: amountInWei,
                        currency: currency,
                        period: period,
                        chain: web3.symbol,
                        chainId: web3.networkId,
                        price: 0,
                        cashBack: [0, 0],
                        pricePercent: 0,
                        estimatedGasPrice: 0,
                        errorMsg: errorMsg,
                    }, {
                        remainingCapacity: defaultCapacity,
                    }
                );
                return quote;
            });
            // .catch( (err:any) => {
            //   console.log('err' , err);
            //   return {}
            // })
    }

}
export default InsuraceApi;
