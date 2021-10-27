import axios from 'axios';
import NetConfig from '../config/NetConfig'

export default class NexusApi {

    static fetchCoverables () {
        return axios.get(`https://api.nexusmutual.io/coverables/contracts.json`)
            .then((response) => {
                return response.data;
            });
    }

    static fetchQuote (web3:any, amount:number, currency:string, period:number, protocol:any) :Promise<object[]> {
      return axios.get(`${NetConfig.netById(web3.networkId).nexusAPI}/v1/quote?coverAmount=${amount}&currency=${currency}&period=${period}&contractAddress=${protocol.nexusCoverable}`)
      .then((response:any) => {
        return response.data;
      });
    }

    /*
    Note!
    This will give the 'base' quotation. without our possible fee.
    Use action from $store instead!
    */
    //
    // static fetchCapacity (protocol) {
    //     return axios.get(`https://api.nexusmutual.io/v1/contracts/${protocol}/capacity`)
    //         .then((response) => {
    //             return response.data
    //         });
    // }

}
