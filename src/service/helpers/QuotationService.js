import {BRIDGE, INSURACE, NEXUS} from './risk_carriers'
import InsuraceApi from './InsuraceApi'
import {quoteFromCoverable} from './objectFactory'
import {toBN} from 'web3-utils'
import NexusApi from '@/services/NexusApi'
import BigNumber from 'bignumber.js'
import {bridgePolicyBookRegistryContract, nexusDistributorContract, nexusQuotationContract} from '@/service/helpers/contractFactory'
import {getBridgePolicyBookContract} from '@/utils/getContract'
import {insuraceDePegTestCurrency,sixDecimalsCurrency} from '@/service/config/network_config'
import ERC20Helper from '@/service/helpers/ERC20Helper'
import GasStationApi from "@/service/helpers/GasStationApi";
import ExchangeRateAPI from "@/service/helpers/ExchangeRateAPI";
let capacity = '';
let quoteCurrency = '';
let capacityETH = null;
let capacityDAI = null;

// getQuotes ({dispatch, commit, state}, {amount, currency, period, protocol}) {
//   commit('resetBuyCoverQuotes');
//
//   let allQuotesReadyPromises = [];
//
//   let ethereum = [state.web3.web3Active, ...state.web3.web3Passive].find(net => {
//     return net.symbol === 'ETH'
//   });
//   //quote Ethereum, either 'active' (Metamask  connected) or from 'passive' list
//   allQuotesReadyPromises.push(dispatch('getNexusQuote', { web3: ethereum, amount, currency, period, protocol}));
//   allQuotesReadyPromises.push(dispatch('getBridgeQuote', { web3: ethereum, amount, currency, period, protocol}));
//   //quote all
//   allQuotesReadyPromises.push(dispatch('getInsuraceQuote', {web3: state.web3.web3Active, amount, currency, period, protocol}))
//   for (let net of state.web3.web3Passive) {
//     allQuotesReadyPromises.push(dispatch('getInsuraceQuote', {web3: net, amount, currency, period, protocol}))
//   }
//   Promise.all(allQuotesReadyPromises).then(() =>{
//     commit('allQuotesLoaded');
//   });
// },

function availableOnNetwork(networkId, module) {
  return netById(networkId).modules.find(mod => mod === module);
}

function getInsuraceQuote({state, commit, getters}, {web3, amount, currency, period, protocol}) {
  if (availableOnNetwork(web3.networkId, 'INSURACE') && protocol.productId) {
    return QuotationService.fetchInsuraceQuote({state, getters}, {web3, amount, currency, period, protocol}).then(quote => {
      if (quote) {
        commit('buyCoverQuote', quote);
      }
      return;
    })
  }
}
function getNexusQuote ({commit}, {state, web3, amount, currency, period, protocol}) {
  if (availableOnNetwork(web3.networkId, 'NEXUS_MUTUAL') && protocol.nexusCoverable){
    return QuotationService.fetchNexusQuote({state, web3, amount, currency, period, protocol}).then(quote => {
      if (quote) {
        commit('buyCoverQuote', quote);
      }
      return;
    })
  }
},
function getBridgeQuote ({commit, getters}, {web3, amount, currency, period, protocol}) {
  if (availableOnNetwork(web3.networkId, 'BRIDGE_MUTUAL') && protocol.bridgeCoverable) {
    return QuotationService.fetchBridgeQuote({getters}, {web3, amount, currency, period, protocol}).then(quote => {
      if (quote) {
        commit('buyCoverQuote', quote);
      }
      return;
    })
  }
}

async function getGasPrice(web3) {

   if(web3.symbol === "POLYGON"){
       let result = await GasStationApi.fetchMaticGasPrice();
       return {gasPrice: result.standard, USDRate: await ExchangeRateAPI.fetchExchangeRate('MATIC')};
   }

    if(web3.symbol === "BSC"){
        let result = await GasStationApi.fetchBSCGasPrice();
        return {gasPrice: result.standard, USDRate: await ExchangeRateAPI.fetchExchangeRate('BNB')};
    }

    if(web3.symbol === "ETH"){
        let result = await GasStationApi.fetchEthereumGasPrice();
        return  { gasPrice: result.SafeGasPrice, USDRate: await ExchangeRateAPI.fetchExchangeRate('ETH')};
    }
}


class QuotationService {

   static getCapacity (protocol) {
        NexusApi.fetchCapacity(protocol).then(capacity => {
            capacityETH = capacity.capacityETH;
            capacityDAI = capacity.capacityDAI;
        })
    }

    static fetchInsuraceQuote ({state, getters}, {web3, amount, currency, period, protocol}) {
        quoteCurrency = currency;
        let amountInWei = web3.web3Instance.utils.toWei(amount.toString(), 'ether');

        if (currency === 'USD') {
                currency = INSURACE.fallbackQuotation[web3.symbol];
        }
        if (sixDecimalsCurrency(web3.networkId, currency)) {
            amountInWei = ERC20Helper.ERCtoUSDTDecimals(amountInWei);
        }
        return InsuraceApi.getCurrencyList(web3).then(currencies => {
            let selectedCurrency = currencies.find(curr => curr.name === currency);
            if (!selectedCurrency) {
                console.error(`Selected currency is not supported by InsurAce: ${currency} on net ${web3.networkId}`)
                return;
            }

            [currency, selectedCurrency] = insuraceDePegTestCurrency(protocol,currency,web3.symbol,selectedCurrency);

            return InsuraceApi.getCoverPremium(
                web3,
                selectedCurrency.address,
                parseInt(protocol.productId),
                parseInt(period),
                amountInWei,
                web3.coinbase
            ).then(async response => {
                const insurPrice = getters.insurPrice(state);
                let premium = response.premiumAmount;
                if (sixDecimalsCurrency(web3.networkId, currency)) {
                    premium = ERC20Helper.USDTtoERCDecimals(premium);
                }
                const cashbackInStable = .05 *
                    parseFloat(toBN(premium)
                        .div(toBN(10 ** 18)).toNumber());

                const {gasPrice, USDRate} = await getGasPrice(web3);
                let estimatedGasPrice = (INSURACE.description.estimatedGas * gasPrice) * USDRate / (10**9);
                let feeInDefaultCurrency = (INSURACE.description.estimatedGas * gasPrice) / 10**9;
                let defaultCurrencySymbol = web3.symbol === 'POLYGON'? 'MATIC': web3.symbol === 'BSC' ? 'BNB' : 'ETH';

                const quote = quoteFromCoverable(
                    'insurace',
                    protocol,
                    {
                        amount: amountInWei,
                        currency: currency,
                        period: period,
                        chain: web3.symbol,
                        chainId: web3.networkId,
                        price: premium,
                        cashBack: [(cashbackInStable / insurPrice), cashbackInStable],
                        cashBackInWei: web3.web3Instance.utils.toWei(cashbackInStable.toString(), 'ether'),
                        pricePercent: new BigNumber(premium).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000), //%, annualize
                        response: response,
                        estimatedGasPrice: estimatedGasPrice,
                        estimatedGasPriceCurrency: defaultCurrencySymbol,
                        estimatedGasPriceDefault: feeInDefaultCurrency
                    },
                    {
                        remainingCapacity: protocol.stats.capacityRemaining
                    }
                );
                return quote;
            }).catch((e) => {
                let errorMsg = e.response && e.response.data ? e.response.data.message : e.message;

                if (errorMsg.includes('GPCHK') && errorMsg.includes(String(4))) {
                    errorMsg = "Invalid amount or period.";
                } else if (errorMsg.includes('GPCHK') && errorMsg.includes(String(5))) {
                    errorMsg = "Invalid amount or period";
                } else if (errorMsg.includes('S') && errorMsg.includes(String(4))) {
                    errorMsg = "Invalid amount or period";
                } else if (errorMsg.includes('GPCHK') && errorMsg.includes(String(3))) {
                    errorMsg = "Currency is NOT a valid premium currency"
                } else if (errorMsg.includes('GPCHK') && errorMsg.includes(String(6))) {
                    errorMsg = "Not sufficient capital available"
                } else if (errorMsg.match('GP: 4')) {
                    errorMsg = "Minimum duration is 1 day. Maximum is 365";
                } else if (errorMsg.includes('amount exceeds the maximum capacity')) {
                    let defaultCapacity = protocol.stats.capacityRemaining;
                    let currency = 'ETH';
                    if (quoteCurrency === 'USD') {
                        defaultCapacity = getters.eth2usd(protocol.stats.capacityRemaining);
                        currency = 'USD';
                    }
                    const capacity = web3.web3Instance.utils.fromWei(defaultCapacity)
                    const max = Number((Math.floor(Number(capacity) * 100) / 100).toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2 });
                    errorMsg = `MAX capacity is ${max} ${currency}`
                }
                const quote = quoteFromCoverable(
                    "insurace",
                    protocol, {
                        amount: amountInWei,
                        currency: currency,
                        period: period,
                        chain: web3.symbol,
                        chainId: web3.networkId,
                        price: 0,
                        cashBack: [0, 0],
                        pricePercent: 0,
                        estimatedGasPrice: 0,
                        errorMsg: errorMsg,
                    }, {
                        remainingCapacity: protocol.stats.capacityRemaining
                    }
                );
                return quote;
            });
        }).catch((e) => {
            console.error('Failed fetching currencies from Insurace', e);
        });
    }


    static fetchNexusQuote ({web3, amount, currency, period, protocol}) {
        this.getCapacity(protocol.protocolAddress);
        const amountInWei = toBN(web3.web3Instance.utils.toWei(amount.toString(), 'ether'));
        if (currency === 'USD') {
            currency = NEXUS.fallbackQuotation;
        }
        if (!Number.isInteger(amount)) {
            amount = Math.round(amount);
        }
        return NexusApi.fetchQuote(web3, {
            amount: amount,
            currency: currency,
            period: period,
            protocol: protocol.nexusCoverable
        }).then(response => {
            let basePrice = toBN(response.price);
            return nexusDistributorContract(web3).then(distributor => {
                return distributor.methods.feePercentage().call().then(async (fee) => {
                    fee = toBN(fee);
                    let priceWithFee = basePrice.mul(fee).div(toBN(10000)).add(basePrice);
                    return nexusQuotationContract(web3).then(quotationContract => {
                        return quotationContract.methods.getCoverLength().call().then(totalCovers => {
                            return quotationContract.methods.getTotalSumAssuredSC(protocol.nexusCoverable, web3.web3Instance.utils.asciiToHex('ETH')).call().then(activeCoversETH => {
                                return quotationContract.methods.getTotalSumAssuredSC(protocol.nexusCoverable, web3.web3Instance.utils.asciiToHex('DAI')).call().then(activeCoversDAI => {
                                    return quotationContract.methods.getTotalSumAssured(web3.web3Instance.utils.asciiToHex('ETH')).call().then(totalActiveCoversETH => {
                                        return quotationContract.methods.getTotalSumAssured(web3.web3Instance.utils.asciiToHex('DAI')).call().then(async totalActiveCoversDAI => {

                                            const {gasPrice, USDRate} = await getGasPrice(web3);
                                            let estimatedGasPrice = (NEXUS.description.estimatedGas * gasPrice) * USDRate / (10**9);
                                            let feeInDefaultCurrency = (NEXUS.description.estimatedGas * gasPrice) / 10**9;
                                            let defaultCurrencySymbol = web3.symbol === 'POLYGON'? 'MATIC': web3.symbol === 'BSC' ? 'BNB' : 'ETH';

                                            return quoteFromCoverable(
                                                'nexus',
                                                protocol,
                                                {
                                                    amount: amountInWei.toString(),
                                                    currency: currency,
                                                    period: period,
                                                    chain: 'ETH',
                                                    chainId: web3.networkId,
                                                    price: priceWithFee.toString(),
                                                    pricePercent: new BigNumber(priceWithFee).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000), //%, annualize
                                                    response: response,
                                                    estimatedGasPrice: estimatedGasPrice,
                                                    estimatedGasPriceCurrency: defaultCurrencySymbol,
                                                    estimatedGasPriceDefault: feeInDefaultCurrency,
                                                },
                                                {
                                                    activeCoversETH: activeCoversETH,
                                                    activeCoversDAI: activeCoversDAI,
                                                    capacityETH: capacityETH,
                                                    capacityDAI: capacityDAI,
                                                    totalCovers: totalCovers,
                                                    totalActiveCoversDAI: totalActiveCoversDAI,
                                                    totalActiveCoversETH: totalActiveCoversETH
                                                }
                                            );
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }).catch(function (error) {
            if (error.response && error.response.status === 400) {
                //wrong parameters
                if (error.response.data.message.details) {
                    let errorMsg = error.response.data.message.details[0].message;

                    if (errorMsg.toLowerCase().includes("\"period\" must be")) {
                        errorMsg = "Minimum duration is 30 days. Maximum is 365";
                    }
                    return new Promise((resolve) => {
                        resolve(quoteFromCoverable(
                            'nexus',
                            protocol,
                            {
                                amount: amountInWei,
                                currency: currency,
                                period: period,
                                chain: 'ETH',
                                chainId: web3.networkId,
                                price: 0,
                                pricePercent: 0,
                                estimatedGasPrice: 0,
                                errorMsg: errorMsg
                            },
                            {
                                capacityETH: capacityETH,
                                capacityDAI: capacityDAI,
                            }
                        ))
                    });
                }
            } else {
                return new Promise(() => {
                    return
                });
            }
        });
    }

    static fetchBridgeQuote ({getters}, {web3, amount, currency, period, protocol}) {
        let amountInWei = web3.web3Instance.utils.toWei(amount.toString(), 'ether');
        if (currency === 'ETH') {
            amountInWei = getters.eth2usd(amountInWei);
        }
        currency = BRIDGE.fallbackQuotation;
        return bridgePolicyBookRegistryContract(web3).then(policyBookRegistry => {
            return policyBookRegistry.methods.isPolicyBook(protocol.bridgeProductAddress).call().then(isPolicyPresent => {
                if (isPolicyPresent) {
                    return getBridgePolicyBookContract(protocol.bridgeProductAddress, web3.web3Instance).then(policyBookContract => {
                        const bridgeEpochs = Math.ceil(Number(period) / 7);
                        return policyBookContract.methods.getPolicyPrice(bridgeEpochs, amountInWei).call().then(({totalSeconds, totalPrice}) => {
                            return policyBookContract.methods.totalLiquidity().call().then(totalLiquidity => {
                                return policyBookContract.methods.totalCoverTokens().call().then(coverTokens => {
                                    const policyBookContractArray = Array.of(policyBookContract._address);
                                    return policyBookRegistry.methods.stats(policyBookContractArray).call().then( async _stats => {
                                        capacity = _stats[0].maxCapacity;
                                        const {gasPrice, USDRate} = await getGasPrice(web3);
                                        let estimatedGasPrice = (BRIDGE.description.estimatedGas * gasPrice) * USDRate / (10**9);
                                        let feeInDefaultCurrency = (BRIDGE.description.estimatedGas * gasPrice) / 10**9;
                                        let defaultCurrencySymbol = web3.symbol === 'POLYGON'? 'MATIC': web3.symbol === 'BSC' ? 'BNB' : 'ETH';

                                        const actualPeriod = Math.floor(Number(totalSeconds) / 3600 / 24);
                                        return quoteFromCoverable(
                                            'bridge',
                                            protocol,
                                            {
                                                amount: amountInWei,
                                                currency: currency,
                                                period: period,
                                                chain: 'ETH',
                                                chainId: web3.networkId,
                                                actualPeriod: actualPeriod,
                                                price: totalPrice,
                                                pricePercent: new BigNumber(totalPrice).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(actualPeriod)).times(365).times(100).toNumber() / 1000, //%, annualize
                                                estimatedGasPrice: estimatedGasPrice,
                                                estimatedGasPriceCurrency: defaultCurrencySymbol,
                                                estimatedGasPriceDefault: feeInDefaultCurrency
                                            },
                                            {
                                                totalUSDTLiquidity: toBN(totalLiquidity),
                                                maxCapacity: _stats[0].maxCapacity,
                                                activeCovers: toBN(coverTokens),
                                                utilizationRatio: toBN(coverTokens).mul(toBN(10000)).div(toBN(totalLiquidity)).toNumber() / 100,
                                            }
                                        );
                                    });
                                });
                            });
                        })
                            .catch(e => {
                                let errorMsg = e.message
                                const capacityFromWei = Number.parseFloat(web3.web3Instance.utils.fromWei(capacity)).toFixed(5)
                                const maxCapacity = (capacityFromWei && Number.parseFloat(capacityFromWei).toLocaleString('en-US'));
                                if (errorMsg.toLowerCase().includes("requiring more than there exists")) {
                                    errorMsg = `MAX capacity is ${maxCapacity} USDT`;
                                } else if (errorMsg.toLowerCase().includes("pb: wrong epoch duration")) {
                                    errorMsg = "Minimum duration is 1 day. Maximum is 365";
                                } else if (errorMsg.toLowerCase().includes("pb: wrong cover")) {
                                    errorMsg = "Invalid cover amount";
                                }
                                return quoteFromCoverable(
                                    'bridge',
                                    protocol,
                                    {
                                        amount: amountInWei,
                                        currency: currency,
                                        period: period,
                                        chain: 'ETH',
                                        chainId: web3.networkId,
                                        price: 0,
                                        pricePercent: 0,
                                        estimatedGasPrice: 0,
                                        errorMsg: errorMsg,
                                    },
                                    {
                                        maxCapacity: capacity,
                                    }
                                );
                            })
                    })
                }
            });
        });

    }

}

export default {
  QuotationService,
  availableOnNetwork,
  getInsuraceQuote,
  getNexusQuote,
  getBridgeQuote
}
