import axios from 'axios';
import NetConfig from '../config/NetConfig'
import CatalogHelper from '../helpers/catalogHelper';
import BigNumber from 'bignumber.js'


class InsuraceApi {

    static fetchCoverables (): Promise<object> {
        return axios.post(
            `${NetConfig.netById(global.user.networkId).insuraceAPI}/getProductList?code=${encodeURIComponent(NetConfig.netById(global.user.networkId).insuraceAPIKey)}`, {
            chain: NetConfig.netById(global.user.networkId).symbol
        })
        .then((response:any) => {
            return response.data;
        });
    }

    static getCurrencyList () {
        return axios.post(
            `${NetConfig.netById(global.user.networkId).insuraceAPI}/getCurrencyList?code=${encodeURIComponent(NetConfig.netById(global.user.networkId).insuraceAPIKey)}`, {
            chain: NetConfig.netById(global.user.networkId).symbol
        })
        .then((response:any) => {
            return response.data;
        });
    }

    static getCoverPremium (
      web3: any,
        currencyAddress : any,
        productId : any,
        coverDays : any,
        coverAmount : any,
        owner : any) {
        let url = `${NetConfig.netById(global.user.networkId).insuraceAPI}/getCoverPremium?code=${encodeURIComponent(NetConfig.netById(global.user.networkId).insuraceAPIKey)}`;
        return  axios.post(
            url, {
            chain: NetConfig.netById(global.user.networkId).symbol,
            coverCurrency: currencyAddress,
            productIds: [productId],
            coverDays: [coverDays],
            coverAmounts: [coverAmount],
            owner: owner,
            referralCode: NetConfig.netById(global.user.networkId).insuraceReferral ? NetConfig.netById(global.user.networkId).insuraceReferral : ''
        })
        .then((response : any) => {
            return response.data;
        }).catch(error =>{
            console.log('ERROR on getCoverPremium : ' ,error);
        });
    }

    static confirmCoverPremium (state :any , params : any) {
        return axios.post(
            `${NetConfig.netById(global.user.networkId).insuraceAPI}/confirmCoverPremium?code=${encodeURIComponent(NetConfig.netById(global.user.networkId).insuraceAPIKey)}`, {
            chain: state.web3.web3Active.symbol,
            params: params
        }).then((response : any) => {
            return response.data;
        }).catch(error =>{
            console.log('ERROR on confirmCoverPremium : ',error);
        });;
    }


    static async fetchInsuraceQuote ( amount:string | number, currency:string , period:number, protocol:any): Promise<object> {
        let quoteCurrency = currency;

        console.log('global.user.web3 INUSRACE QUOTE' , global.user.web3);

        let amountInWei = global.user.web3.utils.toWei(amount.toString(), 'ether');

        // if (currency === 'USD') {
        //         currency = risk_carriers.INSURACE.fallbackQuotation[web3.symbol];
        // }
        // if (sixDecimalsCurrency(web3.networkId, currency)) {
        //     amountInWei = ERC20Helper.ERCtoUSDTDecimals(amountInWei);
        // }

        let currencies:object[] = await this.getCurrencyList()
        let selectedCurrency:any = currencies.find((curr:any) => {return curr.name == currency});

        if (!selectedCurrency) {
          console.error(`Selected currency is not supported by InsurAce: ${currency} on net ${global.user.networkId}`)
          return;
        }

        let web3 : any = global.user.web3;
        web3.symbol = NetConfig.netById(global.user.networkId).symbol;
        // web3.coinbase = NetConfig.netById(web3.networkId);

        return await this.getCoverPremium(
                web3,
                selectedCurrency.address,
                parseInt(protocol.productId),
                period,
                amountInWei,
                global.user.account,
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
