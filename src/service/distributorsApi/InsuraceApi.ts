import axios from 'axios';
import NetConfig from '../config/NetConfig'
import CatalogHelper from '../helpers/catalogHelper';
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
            chain: NetConfig.netById(web3.networkId).symbol
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
        let url = `${NetConfig.netById(web3.networkId).insuraceAPI}/getCoverPremium?code=${encodeURIComponent(NetConfig.netById(web3.networkId).insuraceAPIKey)}`;
        return  axios.post(
            url, {
            chain: NetConfig.netById(web3.networkId).symbol,
            coverCurrency: currencyAddress,
            productIds: [productId],
            coverDays: [coverDays],
            coverAmounts: [coverAmount],
            owner: owner,
            referralCode: NetConfig.netById(web3.networkId).insuraceReferral ? NetConfig.netById(web3.networkId).insuraceReferral : ''
        })
        .then((response : any) => {
            return response.data;
        }).catch(error =>{
            console.log('ERROR on getCoverPremium : ' ,error);
        });
    }

    static confirmCoverPremium (state :any , params : any) {
        return axios.post(
            `${NetConfig.netById(state.web3.web3Active.networkId).insuraceAPI}/confirmCoverPremium?code=${encodeURIComponent(NetConfig.netById(state.web3.web3Active.networkId).insuraceAPIKey)}`, {
            chain: state.web3.web3Active.symbol,
            params: params
        }).then((response : any) => {
            return response.data;
        }).catch(error =>{
            console.log('ERROR on confirmCoverPremium : ',error);
        });;
    }


    static async fetchInsuraceQuote (web3:any, amount:string | number, currency:string , period:number, protocol:any): Promise<object> {
        let quoteCurrency = currency;
        let amountInWei = web3.utils.toWei(amount.toString(), 'ether');

        // if (currency === 'USD') {
        //         currency = risk_carriers.INSURACE.fallbackQuotation[web3.symbol];
        // }
        // if (sixDecimalsCurrency(web3.networkId, currency)) {
        //     amountInWei = ERC20Helper.ERCtoUSDTDecimals(amountInWei);
        // }

        let currencies:object[] = await this.getCurrencyList(web3)
        let selectedCurrency:any = currencies.find((curr:any) => {return curr.name == currency});

        if (!selectedCurrency) {
          console.error(`Selected currency is not supported by InsurAce: ${currency} on net ${web3.networkId}`)
          return;
        }

        web3.symbol = NetConfig.netById(web3.networkId).symbol;
        // web3.coinbase = NetConfig.netById(web3.networkId);

        return await this.getCoverPremium(
                web3,
                selectedCurrency.address,
                parseInt(protocol.productId),
                period,
                amountInWei,
                web3.coinbase
            ).then( (response: any) => {

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
                        // remainingCapacity: protocol.stats.capacityRemaining
                    }
                );
                return quote;
            })
    }//fetchInsuraceQuote method


}

export default InsuraceApi;
