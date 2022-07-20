import { Risk } from "@solace-fi/sdk"
import axios from "axios";

export default class SolaceSDK {

    static async getCoverData () {
        const risk = new Risk()
        const array = await risk.getSolaceRiskBalances(global.user.account, 1)
        if(array && global.user.account !== '0x0000000000000000000000000000000000000001') {
            return axios.post('https://risk-data.solace.fi/scores',
                {account: global.user.account, positions: array})
                .then((response) => {
                    return response.data;
                }).catch(error => {
                    return [];
                });
        } else return [];
    }

}

