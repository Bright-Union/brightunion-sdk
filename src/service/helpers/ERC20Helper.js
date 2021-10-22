import {toBN} from 'web3-utils'

export default class ERC20Helper {

    static USDTtoERCDecimals (usdtAmount) {
        return toBN(usdtAmount).mul(toBN(10 ** 12)).toString();
    }

    static ERCtoUSDTDecimals (ercAmount) {
        return toBN(ercAmount).div(toBN(10 ** 12)).toString();
    }

    static approveAndCall (state, erc20Instance, spender, amount, onConfirmation, onError) {
        return erc20Instance.methods
            .approve(spender, amount)
            .send({from: state.web3.web3Active.coinbase})
            .on('transactionHash', () => {
                //
            })
            .on('confirmation', (confirmationNumber) => {
                if (confirmationNumber === 0) {
                    onConfirmation();
                }
            })
            .on('error', (err, receipt) => {
                console.error(err, receipt)
                onError(err, receipt);
            })
    }

    //  @dev USDT (unfortunately) doesn't allow to change the allowance, let say from X to Y
    //  Instead, we have to set it to 0 first, and then set it to Y
    static approveUSDTAndCall (state, erc20Instance, spender, amount, onAllowanceReset, onConfirmation, onError) {
        erc20Instance.methods.allowance(state.web3.web3Active.coinbase, spender).call().then(currentAllowance => {
            if (toBN(ERC20Helper.USDTtoERCDecimals(currentAllowance)).gte(toBN(amount))) {
                //current allowance is sufficient
                onConfirmation();
            } else if (currentAllowance !== '0' && toBN(ERC20Helper.USDTtoERCDecimals(currentAllowance)).lt(toBN(amount))) {
                //there is a allowance, but not enough for buying
                //we have to set it to 0 first
                onAllowanceReset();
                erc20Instance.methods
                    .approve(spender, '0')
                    .send({from: state.web3.web3Active.coinbase, spender})
                    .on('confirmation', (confirmationNumber) => {
                        if (confirmationNumber === 0) {
                            //starting over again
                            ERC20Helper.approveAndCall(state, erc20Instance, spender, ERC20Helper.ERCtoUSDTDecimals(amount), onConfirmation, onError);
                        }
                    })
            } else {
                ERC20Helper.approveAndCall(state, erc20Instance, spender, ERC20Helper.ERCtoUSDTDecimals(amount), onConfirmation, onError);
            }
        });
    }

}
