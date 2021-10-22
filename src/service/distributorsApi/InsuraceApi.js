import axios from 'axios';
import {netById} from '@/store/network_config'

export default class InsuraceApi {

    static fetchCoverables (web3) {
        return axios.post(
            `${netById(web3.networkId).insuraceAPI}/getProductList?code=${encodeURIComponent(netById(web3.networkId).insuraceAPIKey)}`, {
            chain: web3.symbol
        })
        .then((response) => {
            return response.data;
        });
    }

    static getCurrencyList (web3) {
        return axios.post(
            `${netById(web3.networkId).insuraceAPI}/getCurrencyList?code=${encodeURIComponent(netById(web3.networkId).insuraceAPIKey)}`, {
            chain: web3.symbol
        })
        .then((response) => {
            return response.data;
        });
    }

    static getCoverPremium (web3, currencyAddress, productId, coverDays, coverAmount, owner) {
        return axios.post(
            `${netById(web3.networkId).insuraceAPI}/getCoverPremium?code=${encodeURIComponent(netById(web3.networkId).insuraceAPIKey)}`, {
            chain: web3.symbol,
            coverCurrency: currencyAddress,
            productIds: [productId],
            coverDays: [coverDays],
            coverAmounts: [coverAmount],
            owner: owner,
            referralCode: netById(web3.networkId).insuraceReferral ? netById(web3.networkId).insuraceReferral : ''
        })
        .then((response) => {
            return response.data;
        });
    }

    static confirmCoverPremium (state, params) {
        return axios.post(
            `${netById(state.web3.web3Active.networkId).insuraceAPI}/confirmCoverPremium?code=${encodeURIComponent(netById(state.web3.web3Active.networkId).insuraceAPIKey)}`, {
            chain: state.web3.web3Active.symbol,
            params: params
        })
            .then((response) => {
                return response.data;
            });
    }


}
