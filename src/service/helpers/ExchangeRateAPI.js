import axios from "axios";

export default class ExchangeRateAPI {

    static fetchExchangeRate(currency) {
        return axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=USD`)
            .then((response) => {
                return Number(response.data.USD);
            });
    }
}