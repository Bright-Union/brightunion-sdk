import axios from 'axios';
import NetConfig from '../config/NetConfig'
import BigNumber from 'bignumber.js'
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

    static async getCoverPremium (
        amount : any,
        currency : any,
        period : any,
        protocol : any,
        owner : any) {
        let url = `${NetConfig.netById(global.user.networkId).insuraceAPI}/getCoverPremium?code=${encodeURIComponent(NetConfig.netById(global.user.networkId).insuraceAPIKey)}`;
        let referral = `${NetConfig.netById(global.user.networkId).insuraceReferral}`;

        return  axios.post(
            url, {
                
                    "chain": NetConfig.netById(global.user.networkId).symbol,
                    "coverCurrency": currency,
                    "productIds": [protocol],
                    "coverDays": [period],
                    "coverAmounts": [amount],
                    "owner": owner,
                    "referralCode": ""
                  
        }).then((response : any) => {
            return response.data;
        }).catch(error =>{
            console.log('ERROR on Insurace getCoverPremium : ' , error.response.data && error.response.data.message);
        });
    }

    static confirmCoverPremium (chainSymbol :any, params : any) {
        console.log('calling  confirm...')
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

}
export default InsuraceApi;
