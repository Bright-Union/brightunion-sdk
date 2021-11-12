import axios from "axios";
import ExchangeRateHelper from "./exchangeRateHelper";

class GasHelper {

    public static async  getGasPrice(web3:any) {

        if(web3.symbol === "POLYGON"){
            const result:any = await this.fetchMaticGasPrice();
            return {gasPrice: result.standard, USDRate: await ExchangeRateHelper.fetchExchangeRate('MATIC')};
        }

        if(web3.symbol === "BSC"){
            const result:any = await this.fetchBSCGasPrice();
            return {gasPrice: result.standard, USDRate: await ExchangeRateHelper.fetchExchangeRate('BNB')};
        }

        if(web3.symbol === "ETH"){
            const result = await this.fetchEthereumGasPrice();
            return  { gasPrice: result.SafeGasPrice, USDRate: await ExchangeRateHelper.fetchExchangeRate('ETH')};
        }
    }

    static fetchEthereumGasPrice() {
        return axios.get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=N1AR8EKTZMBZMVSPW6F3XY45D6DKWUQUP5")
            .then((response:any) => {
                return response.data.result;
            });
    }

    static fetchMaticGasPrice() {
        return axios.get("https://gasstation-mainnet.matic.network/")
            .then((response:any) => {
                return response.data;
            });
    }

    static fetchBSCGasPrice() {
        return axios.get("https://bscgas.info/gas?apikey=710258a55e7b4687b7219d1fbf1a0c20")
            .then((response) => {
                return response.data
            }, error => {
                console.log(error)
                return {};
            });
    }


    static  fetchGasPrice(symbol:string) {
        if (symbol === "POLYGON") {
            return  this.fetchMaticGasPrice().then((data) => {
                return {
                    rapid: data.fastest,
                    fast: data.fast,
                    standard: data.standard,
                    slow: data.safeLow
                };
            });
        } else if (symbol === "BSC") {
            return  this.fetchBSCGasPrice().then((data:any) => {
                return {
                    rapid: data.instant,
                    fast: data.fast,
                    standard: data.standard,
                    slow: data.slow
                };
            });
        } else {
            return  this.fetchEthereumGasPrice().then((data:any) => {
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

export default GasHelper;