import axios from 'axios';
import {netById} from '@/store/network_config'

export default class NexusApi {

    static fetchCoverables () {
        return axios.get(`https://api.nexusmutual.io/coverables/contracts.json`)
            .then((response) => {
                return response.data;
            });
    }

    /*
    Note!
    This will give the 'base' quotation. without our possible fee.
    Use action from $store instead!
    */
    static fetchQuote (web3, {amount, currency, period, protocol}) {
        return axios.get(`${netById(web3.networkId).nexusAPI}/v1/quote?coverAmount=${amount}&currency=${currency}&period=${period}&contractAddress=${protocol}`)
            .then((response) => {
                return response.data;
            });
    }

    static fetchCapacity (protocol) {
        return axios.get(`https://api.nexusmutual.io/v1/contracts/${protocol}/capacity`)
            .then((response) => {
                return response.data
            });
    }

}
