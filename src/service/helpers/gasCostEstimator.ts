import axios from "axios";
import {toWei, toBN} from "web3-utils";
import GasStationApi from "./gasStationApi"

export default class  GasCostEstimator {

  static async estimateMethod ( _methodArgument:any , _contractMethod:any , _quotes:any ) {

    // let gasPriceNow = GasStationApi.fetchGasPrice();

    let gasPriceNow = await axios.get("https://gasstation-mainnet.matic.network/")
    .then((response: any) => {
      return response.data.standard;
    },
    (error) => {
      console.error('gasstation-mainnet.matic.network error - ', error);
      return 50;
    });

    let gasPrice = Math.round(Number(gasPriceNow));
    let estimatedGasPrice = toWei(toBN(Number(gasPrice)), "gwei").toString();
    let gasEstimationCost = 0;

    await _contractMethod(_methodArgument).estimateGas({
      from: global.user.account,
      gas: estimatedGasPrice,
      value: _quotes.price
    }).then(function (gasAmount: any) {
      gasEstimationCost = gasAmount && gasAmount.toString()
    })
    .catch(function (error: any) {
      console.info("Simulated transaction to estimate gas costs", error)
    });

    let buyTransactionData:any = {};
    buyTransactionData.gas = gasEstimationCost;
    buyTransactionData.gasLimit = 2500000;
    buyTransactionData.gasPrice = estimatedGasPrice;

    return buyTransactionData;

  }

}
