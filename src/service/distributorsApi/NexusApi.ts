import axios from 'axios';
import NetConfig from '../config/NetConfig'
import RiskCarriers from '../config/RiskCarriers'

export default class NexusApi {

    static fetchCoverables () {
        return axios.get(`https://api.nexusmutual.io/coverables/contracts.json`)
            .then((response) => {
                return response.data;
            }).catch(error => {
              console.log('ERROR Nexus fetchCoverables:',error.response.data && error.response.data.message);
            });
    }
    
    static fetchQuote ( amount:number, currency:string, period:number, protocol:any) :Promise<object[]> {
 
      return axios.get(
        `${NetConfig.netById(global.user.networkId).nexusAPI}/v1/quote?coverAmount=${amount}&currency=${currency}&period=${period}&contractAddress=${protocol.nexusCoverable}`
        ,{headers : {
          Origin: 'http://localhost:3000',
        }})
 
      .then((response:any) => {
        return response.data;
      }).catch(error => {
        console.log('ERROR Nexus fetchQuote:',error.response.data && error.response.data.message);
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
