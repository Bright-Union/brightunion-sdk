import GoogleEvents from '../config/GoogleEvents';
import BuyReceipt from "../domain/BuyReceipt";
import {
    _getDistributorsContract,
    _getInsuraceDistributor,
    _getInsuraceDistributorsContract,
    _getNexusDistributorsContract,
    _getBridgeV2Distributor,
    _getBridgeV2PolicyBookContract,
    _getBridgeV2PolicyBookFacade,
    _getEaseContract,
    _getEaseDistributorContract

} from "../helpers/getContract";

import ERC20Helper from '../helpers/ERC20Helper';
import NetConfig from '../config/NetConfig';
import {fromWei, toBN, toWei} from 'web3-utils'
import axios from 'axios'
import RiskCarriers from "@/service/config/RiskCarriers";

/**
 * Returns a transaction receipt.
 * (Emits a boughtCover event at contract level)
 *
 * @remarks At the moment this function is only supported
 * when intended distributor is Bridge & Nexus, for Insurace please
 * refer to buyCoverDecode function.2
 *
 * @param _distributorName
 * @param _contractAddress
 * @param _coverAsset
 * @param _sumAssured
 * @param _coverPeriod
 * @param _coverType
 * @param _maxPriceWithFee
 * @param _data
 * @returns BuyReceipt Object
 */
export async function buyCoverBridge(
    _ownerAddress: string,
    _distributorName: string,
    _contractAddress: string,
    _coverAsset: string,
    _sumAssured: number,
    _coverPeriod: number,
    _coverType: any,
    _maxPriceWithFee: number,
    _data: any,
    buyingWithNetworkCurrency: boolean,
    _quoteProtocol: any,
): Promise<any> {
    let tx: any;
    tx = {
        'hash': null,
        'distributor': "bridge",
        'premium': fromWei(_quoteProtocol.price),
        'name': _quoteProtocol.name,
        'amount': fromWei(_quoteProtocol.amount),
        'currency': _quoteProtocol.currency,
        'period': _quoteProtocol.period,
    }

    const brightRewardsAddress = NetConfig.netById(global.user.ethNet.networkId).brightTreasury;
    const policyBook = await _getBridgeV2PolicyBookContract(_contractAddress, global.user.web3);

    const policyBookFacadeAddress = await policyBook.methods.policyBookFacade().call();
    const policyBookFacade = _getBridgeV2PolicyBookFacade(policyBookFacadeAddress, global.user.web3);

    // convert period from days to bridge epochs (weeks)
    let epochs = Math.min(52, Math.ceil(_coverPeriod / 7));

    return await new Promise((resolve, reject) => {
        policyBookFacade.methods.buyPolicyFromDistributorFor(global.user.account, epochs, _sumAssured, brightRewardsAddress)
            .send({from: global.user.account})
            .on('transactionHash', (transactionHash: any) => {
                tx.hash = transactionHash;
                global.events.emit("buy", {status: "TX_GENERATED", data: tx});
                GoogleEvents.onTxHash(tx);
                resolve({success: transactionHash});
            })
            .on('error', (err: any, receipt: any) => {
                global.events.emit("buy", {status: "REJECTED"});
                GoogleEvents.onTxRejected(tx);
                reject({error: err, receipt: receipt})
            })
            .on('confirmation', (confirmationNumber: any) => {
                if (confirmationNumber === 0) {
                    GoogleEvents.onTxConfirmation(tx);
                    global.events.emit("buy", {status: "TX_CONFIRMED"});
                }
            });
    });

}

export async function buyCoverEase(
    _ownerAddress: string,
    _contractAddress: string,
    _coverAsset: string,
    _sumAssured: number,
    _coverPeriod: number,
    _coverType: any,
    _maxPriceWithFee: number,
    _data: any,
    _quoteProtocol: any,
): Promise<any> {

    let tx: any;
    tx = {
        'hash': null,
        'distributor': "ease",
        'name': _quoteProtocol.name,
        'amount': _data.amount,
        'currency': _quoteProtocol.asset,
    }

    return await new Promise(async (resolve, reject) => {
        await _getEaseDistributorContract(NetConfig.netById(1).easeDistributor).methods.buyCover(
            _contractAddress,
            _coverAsset,
            _data.amount,
            _data.user,
            _data.expiry,
            _data.vInt,
            _data.r,
            _data.s,
            _quoteProtocol.vault.liquidation_amount,
            _quoteProtocol.vault.liquidation_proof
        ).send({from: _data.user})
            .on('transactionHash', (res: any) => {
                tx.hash = res
                global.events.emit("buy", {status: "TX_GENERATED", data: tx});
                GoogleEvents.onTxHash(tx);
                resolve({success: res});
            })
            .on('error', (err: any, receipt: any) => {
                global.events.emit("buy", {status: "REJECTED"});
                GoogleEvents.onTxRejected(tx);
                reject({error: err, receipt: receipt})
            })
            .on('confirmation', (confirmationNumber: any) => {
                if (confirmationNumber === 0) {
                    GoogleEvents.onTxConfirmation(tx);
                    global.events.emit("buy", {status: "TX_CONFIRMED"});

                }
            });
    });

}

export async function buyCoverNexus(
    _ownerAddress: string,
    _distributorName: string,
    _coverAsset: string,
    _sumAssured: number,
    _amountOut: number,
    _priceWithSlippage: number,
    _coverPeriod: number,
    _maxPriceWithFee: number,
    buyingWithNetworkCurrency: boolean,
    _quoteProtocol: any,
) {

    let tx: any = {
        'hash': null,
        'distributor': _quoteProtocol.distributorName,
        'premium': fromWei(_quoteProtocol.price),
        'name': _quoteProtocol.name,
        'amount': fromWei(_quoteProtocol.amount),
        'currency': _quoteProtocol.currency,
        'period': _quoteProtocol.period,
    }

    const sendValue = buyingWithNetworkCurrency ? _maxPriceWithFee : 0;

    return await new Promise(async (resolve, reject) => {
        if (_quoteProtocol.uniSwapRouteData.protocol) {
            const nexusAddress = await _getDistributorsContract(global.user.web3).methods.getDistributorAddress('nexus2').call();

            const swapData = global.user.web3.eth.abi.encodeParameters(
                [
                    'address[]', 'uint24[]', 'string',
                    'uint256', 'address', 'uint256',
                    'uint256', 'uint256'
                ],
                [
                    _quoteProtocol.uniSwapRouteData.swapVia,
                    _quoteProtocol.uniSwapRouteData.poolFees,
                    _quoteProtocol.uniSwapRouteData.protocol,
                    _amountOut,
                    _coverAsset,
                    _amountOut,
                    _priceWithSlippage,
                    _maxPriceWithFee
                ]
            );
            const buyCoverParams:any = [
                0,                                                      // coverId
                _ownerAddress,                                          // owner
                _quoteProtocol.nexusProductId.toString(),               // productId
                RiskCarriers.NEXUS.assetsIds[_quoteProtocol.currency],  // coverAsset
                _sumAssured.toString(),                                 // amount
                Number(_coverPeriod) * 24 * 3600,                       // period
                _quoteProtocol.priceInNXM,                              // maxPremiumInAsset, NXM amount we buy
                '255',                                                  // paymentAsset, NXM
                '1765',                                                 // commissionRatio, 17.5% we got in NXM as a kickback fee
                '0xac0734c62b316041d190438d5d3e5d1359614407',           // commissionDestination, treasury
                ''                                                      // ipfsData
            ];
            const poolAllocationRequest: any = _quoteProtocol.rawData.quote.poolAllocationRequests;

            _getNexusDistributorsContract(nexusAddress).methods.buyCover(
                    buyCoverParams,
                    poolAllocationRequest,
                    swapData
            ).send({from: _ownerAddress, value: sendValue})
                .on('transactionHash', (res: any) => {
                    tx.hash = res
                    global.events.emit("buy", {status: "TX_GENERATED", data: tx});
                    GoogleEvents.onTxHash(tx);
                    resolve({success: res});
                })
                .on('error', (err: any, receipt: any) => {
                    global.events.emit("buy", {status: "REJECTED"});
                    GoogleEvents.onTxRejected(tx);
                    reject({error: err, receipt: receipt})
                })
                .on('confirmation', (confirmationNumber: any) => {
                    if (confirmationNumber === 0) {
                        GoogleEvents.onTxConfirmation(tx);
                        global.events.emit("buy", {status: "TX_CONFIRMED"});

                    }
                });

        } else {
            // Warning! TODO - can't find a route for NXM buy on Uni!
        }

    });
}


/**
 * Returns a transaction receipt.
 * (Emits a boughtCover event at contract level)
 *
 * @remarks Buy coverages for Insurance
 *
 * @param _distributorName
 * @param _products
 * @param _durationInDays
 * @param _amounts
 * @param _currency
 * @param _premiumAmount
 * @param _helperParameters
 * @param _securityParameters
 * @param _v
 * @param _r
 * @param _s
 * @returns  BuyReceipt Object
 */

export async function buyCoverInsurace(buyingObj: any, buyingWithNetworkCurrency: boolean, _quotes: any) {

    let insuraceAddress: any;
    const sendValue = buyingWithNetworkCurrency ? buyingObj.premium : 0;

    let tx: any = {
        'hash': null,
        'distributor': 'insurace',
        'premium': _quotes.price,
        'name': _quotes.name,
        'amount': _quotes.amount,
        'currency': _quotes.currency,
        'period': _quotes.period,
    }

    insuraceAddress = await _getDistributorsContract(global.user.web3).methods.getDistributorAddress('insurace').call();

    const contractInstance = _getInsuraceDistributorsContract(insuraceAddress);
    let gasEstimationCost: any = null;
    let estimatedGasPrice: any = null;

    let buyTransactionData: any = {
        from: global.user.account,
        value: sendValue,
    }

    if (global.user.networkId == 137) {
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

    return await new Promise((resolve, reject) => {
        contractInstance.methods
            .buyCoverInsurace(buyingObj)
            .send(buyTransactionData)
            .on('transactionHash', (res: any) => {
                tx.hash = res;
                global.events.emit("buy", {status: "TX_GENERATED", data: tx});
                GoogleEvents.onTxHash(tx);
                resolve({success: res});
            })
            .on('error', (err: any, receipt: any) => {
                global.events.emit("buy", {status: "REJECTED"});
                GoogleEvents.onTxRejected(tx);
                reject({error: err, receipt: receipt})
            })
            .on('confirmation', (confirmationNumber: any) => {
                if (confirmationNumber === 0) {
                    global.events.emit("buy", {status: "TX_CONFIRMED"});
                    GoogleEvents.onTxConfirmation(tx);
                }
            });
    });
}


export default {
    buyCoverBridge, buyCoverInsurace, buyCoverNexus, buyCoverEase
}
