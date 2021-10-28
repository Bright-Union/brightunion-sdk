import axios from 'axios';
import NetConfig from '../config/NetConfig'

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
}

export default InsuraceApi;
