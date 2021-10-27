import * as risk_carriers from '@/service/config/risk_carriers'
import InsuraceApi from '@/service/distributorsApi/InsuraceApi'
import CatalogHelper from '@/service/helpers/catalogHelper'
import {toBN, fromWei} from 'web3-utils'
import NexusApi from '@/service/distributorsApi/NexusApi'
import BigNumber from 'bignumber.js'
// import {bridgePolicyBookRegistryContract, nexusDistributorContract, nexusQuotationContract} from '@/utils/contractFactory'
// import {getBridgePolicyBookContract} from '@/utils/getContract'
// import {insuraceDePegTestCurrency,sixDecimalsCurrency} from '@/store/network_config'
// import ERC20Helper from '@/services/ERC20Helper'
// import GasStationApi from "@/services/GasStationApi";
// import ExchangeRateAPI from "@/services/ExchangeRateAPI";
// import {flexDecimals} from "@/utils/filters";
// let capacity = '';
// let quoteCurrency = '';
// let capacityETH:number = null;
// let capacityDAI:number = null;
// let nexusMaxCapacityError = '';

// async function getGasPrice(web3) {
//
//    if(web3.symbol === "POLYGON"){
//        let result = await GasStationApi.fetchMaticGasPrice();
//        return {gasPrice: result.standard, USDRate: await ExchangeRateAPI.fetchExchangeRate('MATIC')};
//    }
//
//     if(web3.symbol === "BSC"){
//         let result = await GasStationApi.fetchBSCGasPrice();
//         return {gasPrice: result.standard, USDRate: await ExchangeRateAPI.fetchExchangeRate('BNB')};
//     }
//
//     if(web3.symbol === "ETH"){
//         let result = await GasStationApi.fetchEthereumGasPrice();
//         return  { gasPrice: result.SafeGasPrice, USDRate: await ExchangeRateAPI.fetchExchangeRate('ETH')};
//     }
// }


export default class QuotationService {

   // static getCapacity (protocol) {
   //      NexusApi.fetchCapacity(protocol).then(capacity => {
   //          capacityETH = capacity.capacityETH;
   //          capacityDAI = capacity.capacityDAI;
   //      })
   //  }

    // static checkNexusCapacity(currency, amount, capacityETH, capacityDAI) {
    //     if(currency === 'DAI' ) {
    //         let capacityDifference = capacityDAI - amount;
    //         if(capacityDifference < 0) {
    //             const maxCapacity = flexDecimals(fromWei(capacityDAI.toString()));
    //             nexusMaxCapacityError = `MAX capacity is ${maxCapacity} USD`
    //         } else {
    //             nexusMaxCapacityError = null;
    //         }
    //     } else if(currency === 'ETH' ) {
    //         let capacityDifference = capacityETH - amount;
    //         if(capacityDifference < 0) {
    //             const maxCapacity = flexDecimals(fromWei(capacityETH.toString()));
    //             nexusMaxCapacityError = `MAX capacity is ${maxCapacity} ETH`
    //         } else {
    //             nexusMaxCapacityError = null;
    //         }
    //     }
    // }

    // static async fetchInsuraceQuote (web3:any, amount:string | number, currency:string , period:string, protocol:any) {
    //     let quoteCurrency = currency;
    //     let amountInWei = web3.web3Instance.utils.toWei(amount.toString(), 'ether');
    //
    //     // if (currency === 'USD') {
    //     //         currency = risk_carriers.INSURACE.fallbackQuotation[web3.symbol];
    //     // }
    //     // if (sixDecimalsCurrency(web3.networkId, currency)) {
    //     //     amountInWei = ERC20Helper.ERCtoUSDTDecimals(amountInWei);
    //     // }
    //
    //     let currencies:object[] = await InsuraceApi.getCurrencyList(web3)
    //     let selectedCurrency:any = currencies.find((curr:any) => {curr.name === currency});
    //
    //     if (!selectedCurrency) {
    //       console.error(`Selected currency is not supported by InsurAce: ${currency} on net ${web3.networkId}`)
    //       return;
    //     }
    //
    //     // [currency, selectedCurrency] = insuraceDePegTestCurrency(protocol,currency,web3.symbol,selectedCurrency);
    //
    //     return InsuraceApi.getCoverPremium(
    //             web3,
    //             selectedCurrency.address,
    //             parseInt(protocol.productId),
    //             parseInt(period),
    //             amountInWei,
    //             web3.coinbase
    //         ).then(async response => {
    //             // const insurPrice = getters.insurPrice(state);
    //             let premium = response.premiumAmount;
    //             // if (sixDecimalsCurrency(web3.networkId, currency)) {
    //             //     premium = ERC20Helper.USDTtoERCDecimals(premium);
    //             // }
    //             // const cashbackInStable = .05 *
    //             //     parseFloat(toBN(premium)
    //             //         .div(toBN(10 ** 18)).toNumber());
    //
    //             // const {gasPrice, USDRate} = await getGasPrice(web3);
    //             // let estimatedGasPrice = (risk_carriers.INSURACE.description.estimatedGas * gasPrice) * USDRate / (10**9);
    //             // let feeInDefaultCurrency = (risk_carriers.INSURACE.description.estimatedGas * gasPrice) / 10**9;
    //             let defaultCurrencySymbol = web3.symbol === 'POLYGON'? 'MATIC': web3.symbol === 'BSC' ? 'BNB' : 'ETH';
    //
    //             const quote = CatalogHelper.quoteFromCoverable(
    //                 'insurace',
    //                 protocol,
    //                 {
    //                     amount: amountInWei,
    //                     currency: currency,
    //                     period: period,
    //                     chain: web3.symbol,
    //                     chainId: web3.networkId,
    //                     price: premium,
    //                     // cashBack: [(cashbackInStable / insurPrice), cashbackInStable],
    //                     // cashBackInWei: web3.web3Instance.utils.toWei(cashbackInStable.toString(), 'ether'),
    //                     pricePercent: new BigNumber(premium).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000), //%, annualize
    //                     response: response,
    //                     // estimatedGasPrice: estimatedGasPrice,
    //                     estimatedGasPriceCurrency: defaultCurrencySymbol,
    //                     // estimatedGasPriceDefault: feeInDefaultCurrency
    //                 },
    //                 {
    //                     remainingCapacity: protocol.stats.capacityRemaining
    //                 }
    //             );
    //             return quote;
    //         }).catch((e) => {
    //             let errorMsg = e.response && e.response.data ? e.response.data.message : e.message;
    //
    //             if (errorMsg.includes('GPCHK') && errorMsg.includes(String(4))) {
    //                 errorMsg = "Invalid amount or period.";
    //             } else if (errorMsg.includes('GPCHK') && errorMsg.includes(String(5))) {
    //                 errorMsg = "Invalid amount or period";
    //             } else if (errorMsg.includes('S') && errorMsg.includes(String(4))) {
    //                 errorMsg = "Invalid amount or period";
    //             } else if (errorMsg.includes('GPCHK') && errorMsg.includes(String(3))) {
    //                 errorMsg = "Currency is NOT a valid premium currency"
    //             } else if (errorMsg.includes('GPCHK') && errorMsg.includes(String(6))) {
    //                 errorMsg = "Not sufficient capital available"
    //             } else if (errorMsg.match('GP: 4')) {
    //                 errorMsg = "Minimum duration is 1 day. Maximum is 365";
    //             } else if (errorMsg.includes('amount exceeds the maximum capacity')) {
    //                 let defaultCapacity = protocol.stats.capacityRemaining;
    //                 let currency = 'ETH';
    //                 if (quoteCurrency === 'USD') {
    //                     // defaultCapacity = getters.eth2usd(protocol.stats.capacityRemaining);
    //                     currency = 'USD';
    //                 }
    //                 const capacity = web3.web3Instance.utils.fromWei(defaultCapacity)
    //                 const max = Number((Math.floor(Number(capacity) * 100) / 100).toFixed(2)).toLocaleString(undefined, { minimumFractionDigits: 2 });
    //                 errorMsg = `MAX capacity is ${max} ${currency}`
    //             }
    //             const quote = CatalogHelper.quoteFromCoverable(
    //                 "insurace",
    //                 protocol, {
    //                     amount: amountInWei,
    //                     currency: currency,
    //                     period: period,
    //                     chain: web3.symbol,
    //                     chainId: web3.networkId,
    //                     price: 0,
    //                     cashBack: [0, 0],
    //                     pricePercent: 0,
    //                     estimatedGasPrice: 0,
    //                     errorMsg: errorMsg,
    //                 }, {
    //                     remainingCapacity: protocol.stats.capacityRemaining
    //                 }
    //             );
    //             return quote;
    //         });
    // }//fetchInsuraceQuote method


    // static fetchNexusQuote (web3:any , amount:number, currency:string, period:string, protocol:any) {
    //     // this.getCapacity(protocol.protocolAddress);
    //     // const amountInWei = toBN(web3.web3Instance.utils.toWei(amount.toString(), 'ether'));
    //     // if (currency === 'USD') {
    //     //     currency = risk_carriers.NEXUS.fallbackQuotation;
    //     // }
    //     if (!Number.isInteger(amount)) {
    //         amount = Math.round(amount);
    //     }
    //     NexusApi.fetchQuote(  web3,   amount,  currency,  period, protocol.nexusCoverable ).then((response:any) => {
    //
    //       console.log(response);
    //
    //     })
    //   }
    //
    // }//class QuotationService



            // let basePrice = toBN(response.price);
            // return nexusDistributorContract(web3).then(distributor => {
            //     return distributor.methods.feePercentage().call().then(async (fee) => {
            //         fee = toBN(fee);
            //         let priceWithFee = basePrice.mul(fee).div(toBN(10000)).add(basePrice);
            //
            //
            //         return nexusQuotationContract(web3).then(quotationContract => {
            //             return quotationContract.methods.getCoverLength().call().then(totalCovers => {


                            // return quotationContract.methods.getTotalSumAssuredSC(protocol.nexusCoverable, web3.web3Instance.utils.asciiToHex('ETH')).call().then(activeCoversETH => {
                            //     return quotationContract.methods.getTotalSumAssuredSC(protocol.nexusCoverable, web3.web3Instance.utils.asciiToHex('DAI')).call().then(activeCoversDAI => {
                            //         return quotationContract.methods.getTotalSumAssured(web3.web3Instance.utils.asciiToHex('ETH')).call().then(totalActiveCoversETH => {
                            //             return quotationContract.methods.getTotalSumAssured(web3.web3Instance.utils.asciiToHex('DAI')).call().then(async totalActiveCoversDAI => {
                            //
                            //                 const {gasPrice, USDRate} = await getGasPrice(web3);
                            //                 let estimatedGasPrice = (risk_carriers.NEXUS.description.estimatedGas * gasPrice) * USDRate / (10**9);
                            //                 let feeInDefaultCurrency = (risk_carriers.NEXUS.description.estimatedGas * gasPrice) / 10**9;
                            //                 let defaultCurrencySymbol = web3.symbol === 'POLYGON'? 'MATIC': web3.symbol === 'BSC' ? 'BNB' : 'ETH';
                            //                 this.checkNexusCapacity(currency, amountInWei.toString(), capacityETH, capacityDAI);
                            //                 return CatalogHelper.quoteFromCoverable(
                            //                     'nexus',
                            //                     protocol,
                            //                     {
                            //                         amount: amountInWei.toString(),
                            //                         currency: currency,
                            //                         period: period,
                            //                         chain: 'ETH',
                            //                         chainId: web3.networkId,
                            //                         price: priceWithFee.toString(),
                            //                         pricePercent: new BigNumber(priceWithFee).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000), //%, annualize
                            //                         response: response,
                            //                         estimatedGasPrice: estimatedGasPrice,
                            //                         estimatedGasPriceCurrency: defaultCurrencySymbol,
                            //                         estimatedGasPriceDefault: feeInDefaultCurrency,
                            //                     },
                            //                     {
                            //                         activeCoversETH: activeCoversETH,
                            //                         activeCoversDAI: activeCoversDAI,
                            //                         capacityETH: capacityETH,
                            //                         capacityDAI: capacityDAI,
                            //                         totalCovers: totalCovers,
                            //                         totalActiveCoversDAI: totalActiveCoversDAI,
                            //                         totalActiveCoversETH: totalActiveCoversETH,
                            //                         nexusMaxCapacityError: nexusMaxCapacityError
                            //                     }
                            //                 );
                            //             });
                            //         });
                            //     });
                            // });
            //             });
            //         });
            //     });
            // });
    //     });
    // }



// static fetchBridgeQuote ({getters}, {web3, amount, currency, period, protocol}) {
  //     let amountInWei = web3.web3Instance.utils.toWei(amount.toString(), 'ether');
  //     if (currency === 'ETH') {
    //         amountInWei = getters.eth2usd(amountInWei);
    //     }
    //     currency = risk_carriers.BRIDGE.fallbackQuotation;
    //     return bridgePolicyBookRegistryContract(web3).then(policyBookRegistry => {
      //         return policyBookRegistry.methods.isPolicyBook(protocol.bridgeProductAddress).call().then(isPolicyPresent => {
        //             if (isPolicyPresent) {
          //                 return getBridgePolicyBookContract(protocol.bridgeProductAddress, web3.web3Instance).then(policyBookContract => {
            //                     const bridgeEpochs = Math.ceil(Number(period) / 7);
            //                     return policyBookContract.methods.getPolicyPrice(bridgeEpochs, amountInWei).call().then(({totalSeconds, totalPrice}) => {
              //                         return policyBookContract.methods.totalLiquidity().call().then(totalLiquidity => {
                //                             return policyBookContract.methods.totalCoverTokens().call().then(coverTokens => {
                  //                                 const policyBookContractArray = Array.of(policyBookContract._address);
                  //                                 return policyBookRegistry.methods.stats(policyBookContractArray).call().then( async _stats => {
                    //                                     capacity = _stats[0].maxCapacity;
                    //                                     const {gasPrice, USDRate} = await getGasPrice(web3);
                    //                                     let estimatedGasPrice = (risk_carriers.BRIDGE.description.estimatedGas * gasPrice) * USDRate / (10**9);
                    //                                     let feeInDefaultCurrency = (risk_carriers.BRIDGE.description.estimatedGas * gasPrice) / 10**9;
                    //                                     let defaultCurrencySymbol = web3.symbol === 'POLYGON'? 'MATIC': web3.symbol === 'BSC' ? 'BNB' : 'ETH';
                    //
                    //                                     const actualPeriod = Math.floor(Number(totalSeconds) / 3600 / 24);
                    //                                     return CatalogHelper.quoteFromCoverable(
                      //                                         'bridge',
                      //                                         protocol,
                      //                                         {
                        //                                             amount: amountInWei,
                        //                                             currency: currency,
                        //                                             period: period,
                        //                                             chain: 'ETH',
                        //                                             chainId: web3.networkId,
                        //                                             actualPeriod: actualPeriod,
                        //                                             price: totalPrice,
                        //                                             pricePercent: new BigNumber(totalPrice).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(actualPeriod)).times(365).times(100).toNumber() / 1000, //%, annualize
                        //                                             estimatedGasPrice: estimatedGasPrice,
                        //                                             estimatedGasPriceCurrency: defaultCurrencySymbol,
                        //                                             estimatedGasPriceDefault: feeInDefaultCurrency
                        //                                         },
                        //                                         {
                          //                                             totalUSDTLiquidity: toBN(totalLiquidity),
                          //                                             maxCapacity: _stats[0].maxCapacity,
                          //                                             stakedSTBL: _stats[0].stakedSTBL,
                          //                                             activeCovers: toBN(coverTokens),
                          //                                             utilizationRatio: toBN(coverTokens).mul(toBN(10000)).div(toBN(totalLiquidity)).toNumber() / 100,
                          //                                         }
                          //                                     );
                          //                                 });
                          //                             });
                          //                         });
                          //                     })
                          //                         .catch(e => {
                            //                             let errorMsg = e.message
                            //                             const capacityFromWei = Number.parseFloat(web3.web3Instance.utils.fromWei(capacity)).toFixed(5)
                            //                             const maxCapacity = (capacityFromWei && Number.parseFloat(capacityFromWei).toLocaleString('en-US'));
                            //                             if (errorMsg.toLowerCase().includes("requiring more than there exists")) {
                              //                                 errorMsg = `MAX capacity is ${maxCapacity} USD`;
                              //                             } else if (errorMsg.toLowerCase().includes("pb: wrong epoch duration")) {
                                //                                 errorMsg = "Minimum duration is 1 day. Maximum is 365";
                                //                             } else if (errorMsg.toLowerCase().includes("pb: wrong cover")) {
                                  //                                 errorMsg = "Invalid cover amount";
                                  //                             }
                                  //                             return CatalogHelper.quoteFromCoverable(
                                    //                                 'bridge',
                                    //                                 protocol,
                                    //                                 {
                                      //                                     amount: amountInWei,
                                      //                                     currency: currency,
                                      //                                     period: period,
                                      //                                     chain: 'ETH',
                                      //                                     chainId: web3.networkId,
                                      //                                     price: 0,
                                      //                                     pricePercent: 0,
                                      //                                     estimatedGasPrice: 0,
                                      //                                     errorMsg: errorMsg,
                                      //                                 },
                                      //                                 {
                                        //                                     maxCapacity: capacity,
                                        //                                 }
                                        //                             );
                                        //                         })
                                        //                 })
                                        //             }
                                        //         });
                                        //     });
                                        //
                                        // }
