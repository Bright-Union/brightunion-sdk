import axios from "axios";
import data from "../abi/ease.json"


export default class EaseApi {
    static fetchCoverables() {
        // console.log(data)
        // return data;
        return axios.get('https://app.ease.org/api/v1/vaults')
            .then((response) => {
                console.log(response)
                return response;
            }).catch(error => {
                return [];
            });
    }
}

