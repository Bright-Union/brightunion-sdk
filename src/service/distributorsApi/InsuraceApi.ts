import axios from 'axios';
import NetConfig from '../config/NetConfig'
import CatalogHelper from '../helpers/catalogHelper';
import BigNumber from 'bignumber.js'
import RiskCarriers from '../config/RiskCarriers'
// import ERC20Helper from '../helpers/ERC20Helper';

class InsuraceApi {

    static fetchCoverables (): Promise<object> {
        return axios.post(
            `${NetConfig.netById(global.user.networkId).insuraceAPI}/getProductList?code=${encodeURIComponent(NetConfig.netById(global.user.networkId).insuraceAPIKey)}`, {
            chain: NetConfig.netById(global.user.networkId).symbol
        })
        .then((response:any) => {
            return response.data;
        }).catch(error =>{
            console.log('ERROR on Insurace fetchCoverables : ' , error.response.data && error.response.data.message);
        });
    }

    static getCurrencyList () {
        return axios.post(
            `${NetConfig.netById(global.user.networkId).insuraceAPI}/getCurrencyList?code=${encodeURIComponent(NetConfig.netById(global.user.networkId).insuraceAPIKey)}`, {
            chain: NetConfig.netById(global.user.networkId).symbol
        })
        .then((response:any) => {
            return response.data;
        }).catch(error =>{
            console.log('ERROR on Insurace getCurrencyList : ' , error.response.data && error.response.data.message);
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
        let referral = `${NetConfig.netById(global.user.networkId).insuraceReferral}`;

        console.log('global.user.networkId ',global.user.networkId)

        return  axios.post(
            url, {
            chain: NetConfig.netById(1).symbol, // always get quotes from mainnet
            coverCurrency: currencyAddress,
            productIds: [productId],
            coverDays: [coverDays],
            coverAmounts: [coverAmount],
            owner: owner,
            referralCode: referral
        }).then((response : any) => {
            return response.data;
        }).catch(error =>{
            console.log('ERROR on Insurace getCoverPremium : ' , error.response.data && error.response.data.message);
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
            console.log('ERROR on Insurace confirmCoverPremium : ', error.response.data && error.response.data.message);
        });;
    }


    static async fetchInsuraceQuote ( amount:string | number, currency:string , period:number, protocol:any): Promise<object> {
        let quoteCurrency = currency;

        let amountInWei = global.user.web3.utils.toWei(amount.toString(), 'ether');

        if (currency === 'USD') {
          currency = RiskCarriers.INSURACE.fallbackQuotation[NetConfig.netById(global.user.networkId).symbol];
        }
        // if (NetConfig.sixDecimalsCurrency(global.user.networkId, currency)) {
          // amountInWei = ERC20Helper.ERCtoUSDTDecimals(amountInWei);
        // }

        let currencies:object[] = await this.getCurrencyList()
        let selectedCurrency:any = currencies.find((curr:any) => {return curr.name == currency});

        if (!selectedCurrency) {
          console.error(`Selected currency is not supported by InsurAce: ${currency} on net ${global.user.networkId}`)
          return;
        }

        let web3 : any = global.user.web3;
        web3.symbol = NetConfig.netById(1).symbol;
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
                let premium = 1000//response.premiumAmount;
                // if (sixDecimalsCurrency(web3.networkId, currency)) {
                //     premium = ERC20Helper.USDTtoERCDecimals(premium);
                // }
                // const cashbackInStable = .05 *
                //     parseFloat(toBN(premium)
                //         .div(toBN(10 ** 18)).toNumber());

                // const {gasPrice, USDRate} = await getGasPrice(web3);
                // let estimatedGasPrice = (RiskCarriers.INSURACE.description.estimatedGas * gasPrice) * USDRate / (10**9);
                // let feeInDefaultCurrency = (RiskCarriers.INSURACE.description.estimatedGas * gasPrice) / 10**9;
                let defaultCurrencySymbol = web3.symbol === 'POLYGON'? 'MATIC': web3.symbol === 'BSC' ? 'BNB' : 'ETH';

                const quote = CatalogHelper.quoteFromCoverable(
                    'insurace',
                    protocol,
                    {
                        amount: amountInWei,
                        currency: currency,
                        period: period,
                        chain: web3.symbol,
                        chainId: global.user.networkId,
                        price: premium,
                        // cashBack: [(cashbackInStable / insurPrice), cashbackInStable],
                        // cashBackInWei: web3.web3Instance.utils.toWei(cashbackInStable.toString(), 'ether'),
                        // pricePercent: new BigNumber(premium).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000), //%, annualize
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
    }
}

export default InsuraceApi;
