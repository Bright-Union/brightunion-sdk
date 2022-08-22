import axios from "axios";

export default class GasStationApi {

    static fetchEthereumGasPrice() {
      const backupFetch = () => {
        return axios.get("https://gas.mycryptoapi.com/")
        .then((response) => {
          return response.data;
        },
        (error) => {
          console.error('gas.mycryptoapi.com - ', error);
        })
      }

      return axios.get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=N1AR8EKTZMBZMVSPW6F3XY45D6DKWUQUP5")
      .then((response:any) => {
        if(!response.data.result){
          return backupFetch();
        }
        return response.data.result;
      },
      (error) => {
        console.error('api.etherscan.io error - ', error);
        return backupFetch();
      });

    }

    static fetchMaticGasPrice() {
        return axios.get("https://gasstation-mainnet.matic.network/")
            .then((response) => {
                return response.data;
            },
            (error) => {
              console.error('gasstation-mainnet.matic.network error - ', error);
            });
    }

    static fetchBSCGasPrice() {
      return axios.get("https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=4CHWVTJA4XX6DGXI7WHI3P8768ZIPUR1C5")
      .then((response) => {
        return response.data
      }, error => {
        console.error("bscscan.com error - " , error)
        return axios.get("https://owlracle.info/bsc/gas?apikey=710258a55e7b4687b7219d1fbf1a0c20").then((response) => {
          return response.data
        }, error => {
          console.error("owlracle.info error - " , error)
          return {};
        })
      });
    }

    static fetchAvalancheGasPrice() {
      // return axios.get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=N1AR8EKTZMBZMVSPW6F3XY45D6DKWUQUP5")
      return axios.get("https://gavax.blockscan.com/gasapi.ashx?apikey=key&method=gasoracle")
      .then((response:any) => {
        return response.data.result;
      },
      (error) => {
        console.error('gavax.blockscan.com error - ', error);
      });
    }

    static  fetchGasPrice(symbol:any) {
        if (symbol === "POLYGON") {
            return  GasStationApi.fetchMaticGasPrice().then(async(data:any) => {
            // const  USDRate = await ExchangeRateAPI.fetchExchangeRate('MATIC');
                return {
                    rapid: data.fastest,
                    fast: data.fast,
                    standard: data.standard,
                    slow: data.safeLow,
                    // USDRate: USDRate,
                };
            });
        } else if (symbol === "BSC") {
            return  GasStationApi.fetchBSCGasPrice().then(async(data:any) => {
              // const USDRate = await ExchangeRateAPI.fetchExchangeRate('BNB')
              if( data.speeds){
                return {
                  rapid: data.speeds[0].gasPrice,
                  fast: data.speeds[1].gasPrice,
                  standard: data.speeds[2].gasPrice,
                  slow: data.speeds[3].gasPrice,
                  // USDRate: USDRate,

                };
              }else if(data.result){
                return{
                  rapid: data.result.FastGasPrice,
                  fast: data.result.FastGasPrice,
                  standard: data.result.ProposeGasPrice,
                  slow:data.result.SafeGasPrice,
                  // USDRate: USDRate,
                }
              }
            });

          } else if (symbol === "AVALANCHE") {
            return  GasStationApi.fetchAvalancheGasPrice().then(async(data) => {
              // const USDRate = await ExchangeRateAPI.fetchExchangeRate('AVAX')
                return {
                    rapid: data.FastGasPrice,
                    fast: data.FastGasPrice,
                    standard: data.SafeGasPrice,
                    slow: data.ProposeGasPrice,
                    // USDRate: USDRate,
                };
            });

        } else if (symbol === "ETH") {
            return  GasStationApi.fetchEthereumGasPrice().then(async(data) => {
              // const USDRate = await ExchangeRateAPI.fetchExchangeRate('ETH')
                // if(!data) return {
                  // USDRate: USDRate,
                // };
                if(data.FastGasPrice){
                  return {
                    rapid: data.FastGasPrice,
                    fast: data.FastGasPrice,
                    standard: data.SafeGasPrice,
                    slow: data.ProposeGasPrice,
                    // USDRate: USDRate,
                  };
                }else if(data.fast) {
                  return {
                    rapid: data.fastest,
                    fast: data.fast,
                    standard: data.standard,
                    slow: data.safeLow,
                    // USDRate: USDRate,
                  };
                }
            });
        }
    }
}
