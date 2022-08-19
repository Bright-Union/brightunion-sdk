export default class GasCostEstimator {

  static estimateMethod (_method:any, _gasPrice:any) {

    let gasPriceNow = await axios.get("https://gasstation-mainnet.matic.network/")
    .then((response: any) => {
      return response.data.standard;
    },
    (error) => {
      console.error('gasstation-mainnet.matic.network error - ', error);
      return 50;
    });



    let gasPrice = Math.round(Number(gasPriceNow));
    estimatedGasPrice = toWei(toBN(Number(gasPrice)), "gwei").toString();

    await contractInstance.methods.buyCoverInsurace(buyingObj).estimateGas({
      from: global.user.account,
      gas: estimatedGasPrice,
      value: _quotes.price
    }).then(function (gasAmount: any) {
      gasEstimationCost = gasAmount && gasAmount.toString()
    })
    .catch(function (error: any) {
      console.info("Simulated transaction to estimate gas costs", error)
    });

    buyTransactionData.gas = gasEstimationCost;
    buyTransactionData.gasLimit = 2500000;
    buyTransactionData.gasPrice = estimatedGasPrice;



  }

}
