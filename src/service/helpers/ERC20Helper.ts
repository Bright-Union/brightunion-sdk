import {toBN} from 'web3-utils'
import axios from 'axios'
import {toWei} from 'web3-utils'

export default class ERC20Helper {

    static USDTtoERCDecimals (usdtAmount:any) {
        return toBN(usdtAmount).mul(toBN(10 ** 12)).toString();
    }

    static ERCtoUSDTDecimals (ercAmount:any) {
        return toBN(ercAmount).div(toBN(10 ** 12)).toString();
    }

    static async approveAndCall ( erc20Instance:any, spender:any, amount:any, onTxHash:any, onConfirmation:any, onError:any) {
      let transactionData:any = {
        from: global.user.account,
      }

      if(global.user.networkId == 137 ){

        let gasEstimationCost : any = null;
        let estimatedGasPrice:any = null;

        let  gasPriceNow =  await axios.get("https://gasstation-mainnet.matic.network/")
        .then((response:any) => {
          return response.data.standard;
        },
        (error) => {
          console.error('gasstation-mainnet.matic.network error - ', error);
          return 50;
        });

        let gasPrice = Math.round(Number(gasPriceNow));
        estimatedGasPrice = toWei(toBN(Number(gasPrice)), "gwei").toString();

        await erc20Instance.methods.approve(spender, amount).estimateGas({
          from: global.user.account,
          gas: estimatedGasPrice,
          // value: amount
        }).then(function(gasAmount:any){
          gasEstimationCost = gasAmount && gasAmount.toString()
        }).catch(function(error:any){
          global.sentry.captureException("Simulated transaction to estimate gas costs", error);
        });

        transactionData.gas = gasEstimationCost;
        transactionData.gasLimit = 2500000;
        transactionData.gasPrice = estimatedGasPrice;
      }

      return erc20Instance.methods.approve(spender, amount).send(transactionData)
      .on('transactionHash', () => {
        onTxHash();
        //
      })
      .on('confirmation', (confirmationNumber:any) => {
        if (confirmationNumber === 0) {
          onConfirmation();
        }
      })
      .on('error', (err:any, receipt:any) => {
        onError(err, receipt);
      })
    }

    //  @dev USDT (unfortunately) doesn't allow to change the allowance, let say from X to Y
    //  Instead, we have to set it to 0 first, and then set it to Y
    static approveUSDTAndCall (erc20Instance:any, spender:any, amount:any, onAllowanceReset:any, onTxHash:any, onConfirmation:any, onError:any) {

        erc20Instance.methods.allowance(global.user.account, spender).call().then((currentAllowance:any) => {

            if (toBN(ERC20Helper.USDTtoERCDecimals(currentAllowance)).gte(toBN(amount))) {
                //current allowance is sufficient
                onConfirmation();
            } else if (currentAllowance !== '0' && toBN(ERC20Helper.USDTtoERCDecimals(currentAllowance)).lt(toBN(amount))) {
                //there is a allowance, but not enough for buying
                //we have to set it to 0 first
                onAllowanceReset();
                erc20Instance.methods
                    .approve(spender, '0')
                    .send({from: global.user.account, spender})
                    .on('transactionHash', () => {
                        onTxHash();
                    })
                    .on('confirmation', (confirmationNumber:any) => {
                        if (confirmationNumber === 0) {
                            //starting over again
                            ERC20Helper.approveAndCall(erc20Instance, spender, ERC20Helper.ERCtoUSDTDecimals(amount), onTxHash, onConfirmation, onError);
                        }
                    })
                    .on('error', (err:any, receipt:any) => {
                      onError(err, receipt);
                    })

            } else {
                ERC20Helper.approveAndCall(erc20Instance, spender, ERC20Helper.ERCtoUSDTDecimals(amount), onTxHash, onConfirmation, onError);
            }
        });
    }

}
