import {toBN} from 'web3-utils'

export default class ERC20Helper {

    static USDTtoERCDecimals (usdtAmount:any) {
        return toBN(usdtAmount).mul(toBN(10 ** 12)).toString();
    }

    static ERCtoUSDTDecimals (ercAmount:any) {
        return toBN(ercAmount).div(toBN(10 ** 12)).toString();
    }

    static approveAndCall ( erc20Instance:any, spender:any, amount:any, onConfirmation:any, onError:any) {
        return erc20Instance.methods
            .approve(spender, amount)
            .send({from: global.user.account})
            .on('transactionHash', () => {
                //
            })
            .on('confirmation', (confirmationNumber:any) => {
                if (confirmationNumber === 0) {
                    onConfirmation();
                }
            })
            .on('error', (err:any, receipt:any) => {
                console.error(err, receipt)
                onError(err, receipt);
            })
    }

    //  @dev USDT (unfortunately) doesn't allow to change the allowance, let say from X to Y
    //  Instead, we have to set it to 0 first, and then set it to Y
    static approveUSDTAndCall (state:any, erc20Instance:any, spender:any, amount:any, onAllowanceReset:any, onConfirmation:any, onError:any) {

        erc20Instance.methods.allowance(state.web3.web3Active.coinbase, spender).call().then((currentAllowance:any) => {

            if (toBN(ERC20Helper.USDTtoERCDecimals(currentAllowance)).gte(toBN(amount))) {
                //current allowance is sufficient
                console.log('approveUSDTAndCall: calling onConfirmation() ')
                onConfirmation();
            } else if (currentAllowance !== '0' && toBN(ERC20Helper.USDTtoERCDecimals(currentAllowance)).lt(toBN(amount))) {
                //there is a allowance, but not enough for buying
                //we have to set it to 0 first
                onAllowanceReset();
                erc20Instance.methods
                    .approve(spender, '0')
                    .send({from: state.web3.web3Active.coinbase, spender})
                    .on('confirmation', (confirmationNumber:any) => {
                        if (confirmationNumber === 0) {
                            //starting over again
                            ERC20Helper.approveAndCall(erc20Instance, spender, ERC20Helper.ERCtoUSDTDecimals(amount), onConfirmation, onError);
                        }
                    })
            } else {
                ERC20Helper.approveAndCall(erc20Instance, spender, ERC20Helper.ERCtoUSDTDecimals(amount), onConfirmation, onError);
            }
        });
    }

}
