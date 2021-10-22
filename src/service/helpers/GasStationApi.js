import axios from "axios";


export default class GasStationApi {

    static fetchEthereumGasPrice() {
       return axios.get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=N1AR8EKTZMBZMVSPW6F3XY45D6DKWUQUP5")
           .then((response) => {
              return response.data.result;
           });
    }

    static fetchMaticGasPrice() {
        return axios.get("https://gasstation-mainnet.matic.network/")
            .then((response) => {
                return response.data;
            });
    }

    static fetchBSCGasPrice() {
        return axios.get("https://bscgas.info/gas?apikey=710258a55e7b4687b7219d1fbf1a0c20")
            .then((response) => {
                return response.data
            });
    }


    static  fetchGasPrice(symbol) {
        if (symbol === "POLYGON") {
            return  GasStationApi.fetchMaticGasPrice().then((data) => {
                return {
                    rapid: data.fastest,
                    fast: data.fast,
                    standard: data.standard,
                    slow: data.safeLow
                };
            });
        } else if (symbol === "BSC") {
            return  GasStationApi.fetchBSCGasPrice().then((data) => {
                return {
                    rapid: data.instant,
                    fast: data.fast,
                    standard: data.standard,
                    slow: data.slow
                };
            });
        } else {
            return  GasStationApi.fetchEthereumGasPrice().then((data) => {
                return {
                    rapid: data.FastGasPrice,
                    fast: data.FastGasPrice,
                    standard: data.SafeGasPrice,
                    slow: data.ProposeGasPrice
                };
            });
        }
    }
}