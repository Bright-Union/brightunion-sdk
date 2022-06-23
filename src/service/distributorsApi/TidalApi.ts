import axios from 'axios';

export default class TidalApi {
    static fetchCoverables() {

        return axios.get(`https://tidal-0828.unseenmagic.com/get_all_assets`)
            .then((response) => {
                return response.data;
            }).catch(error => {
                return [];
            });
    }
}
