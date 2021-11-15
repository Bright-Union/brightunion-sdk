import axios from "axios";



class ExchangeRateHelper {

    static fetchExchangeRate(currency:string) {
        return axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=USD`)
            .then((response:any) => {
                return Number(response.data.USD);
            });
    }
}

export default ExchangeRateHelper;