import axios from 'axios';
import NetConfig from '../config/NetConfig'
import CatalogHelper from '@/service/helpers/catalogHelper';
import BigNumber from 'bignumber.js'


class InsuraceApi {

    static fetchCoverables (_web3NetworkId:string): Promise<object> {
        return axios.post(
            `${NetConfig.netById(_web3NetworkId).insuraceAPI}/getProductList?code=${encodeURIComponent(NetConfig.netById(_web3NetworkId).insuraceAPIKey)}`, {
            chain: NetConfig.netById(_web3NetworkId).symbol
        })
        .then((response:any) => {
            return response.data;
        });
    }

    static getCurrencyList (web3:any) {
        return axios.post(
            `${NetConfig.netById(web3.networkId).insuraceAPI}/getCurrencyList?code=${encodeURIComponent(NetConfig.netById(web3.networkId).insuraceAPIKey)}`, {
            chain: web3.symbol
        })
        .then((response:any) => {
            return response.data;
        });
    }

    static getCoverPremium (
        web3 : any,
        currencyAddress : any,
        productId : any,
        coverDays : any,
        coverAmount : any,
        owner : any) {
        return axios.post(
            `${NetConfig.netById(web3.networkId).insuraceAPI}/getCoverPremium?code=${encodeURIComponent(NetConfig.netById(web3.networkId).insuraceAPIKey)}`, {
            chain: web3.symbol,
            coverCurrency: currencyAddress,
            productIds: [productId],
            coverDays: [coverDays],
            coverAmounts: [coverAmount],
            owner: owner,
            referralCode: NetConfig.netById(web3.networkId).insuraceReferral ? NetConfig.netById(web3.networkId).insuraceReferral : ''
        })
        .then((response : any) => {
            console.log(response)
            return response.data;
        });
    }

    static confirmCoverPremium (state :any , params : any) {
        return axios.post(
            `${NetConfig.netById(state.web3.web3Active.networkId).insuraceAPI}/confirmCoverPremium?code=${encodeURIComponent(NetConfig.netById(state.web3.web3Active.networkId).insuraceAPIKey)}`, {
            chain: state.web3.web3Active.symbol,
            params: params
        }).then((response : any) => {
                return response.data;
            });
    }


    static async fetchInsuraceQuote (web3:any, amount:string | number, currency:string , period:string, protocol:any) {
        let quoteCurrency = currency;
        let amountInWei = web3.web3Instance.utils.toWei(amount.toString(), 'ether');

        // if (currency === 'USD') {
        //         currency = risk_carriers.INSURACE.fallbackQuotation[web3.symbol];
        // }
        // if (sixDecimalsCurrency(web3.networkId, currency)) {
        //     amountInWei = ERC20Helper.ERCtoUSDTDecimals(amountInWei);
        // }

        let currencies:object[] = await this.getCurrencyList(web3)
        let selectedCurrency:any = currencies.find((curr:any) => {curr.name === currency});

        if (!selectedCurrency) {
          console.error(`Selected currency is not supported by InsurAce: ${currency} on net ${web3.networkId}`)
          return;
        }

        // [currency, selectedCurrency] = insuraceDePegTestCurrency(protocol,currency,web3.symbol,selectedCurrency);

        return this.getCoverPremium(
                web3,
                selectedCurrency.address,
                parseInt(protocol.productId),
                parseInt(period),
                amountInWei,
                web3.coinbase
            ).then(async response => {
                // const insurPrice = getters.insurPrice(state);
                let premium = response.premiumAmount;
                // if (sixDecimalsCurrency(web3.networkId, currency)) {
                //     premium = ERC20Helper.USDTtoERCDecimals(premium);
                // }
                // const cashbackInStable = .05 *
                //     parseFloat(toBN(premium)
                //         .div(toBN(10 ** 18)).toNumber());

                // const {gasPrice, USDRate} = await getGasPrice(web3);
                // let estimatedGasPrice = (risk_carriers.INSURACE.description.estimatedGas * gasPrice) * USDRate / (10**9);
                // let feeInDefaultCurrency = (risk_carriers.INSURACE.description.estimatedGas * gasPrice) / 10**9;
                let defaultCurrencySymbol = web3.symbol === 'POLYGON'? 'MATIC': web3.symbol === 'BSC' ? 'BNB' : 'ETH';

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
                        // cashBack: [(cashbackInStable / insurPrice), cashbackInStable],
                        // cashBackInWei: web3.web3Instance.utils.toWei(cashbackInStable.toString(), 'ether'),
                        pricePercent: new BigNumber(premium).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000), //%, annualize
                        response: response,
                        // estimatedGasPrice: estimatedGasPrice,
                        estimatedGasPriceCurrency: defaultCurrencySymbol,
                        // estimatedGasPriceDefault: feeInDefaultCurrency
                    },
                    {
                        remainingCapacity: protocol.stats.capacityRemaining
                    }
                );
                return quote;
            }).catch((e) => {
                let errorMsg = e.response && e.response.data ? e.response.data.message : e.message;

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
                    let defaultCapacity = protocol.stats.capacityRemaining;
                    let currency = 'ETH';
                    if (quoteCurrency === 'USD') {
                        // defaultCapacity = getters.eth2usd(protocol.stats.capacityRemaining);
                        currency = 'USD';
                    }
                    const capacity = web3.web3Instance.utils.fromWei(defaultCapacity)
                    const max = Number((Math.floor(Number(capacity) * 100) / 100).toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2 });
                    errorMsg = `MAX capacity is ${max} ${currency}`
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
                        remainingCapacity: protocol.stats.capacityRemaining
                    }
                );
                return quote;
            });
    }//fetchInsuraceQuote method


}

export default InsuraceApi;
