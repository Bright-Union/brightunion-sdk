import { Coverage, Risk } from "@solace-fi/sdk"
import axios from "axios";
import CatalogHelper from "@/service/helpers/catalogHelper";
import {fromWei, toWei} from "web3-utils";
import CurrencyHelper from "@/service/helpers/currencyHelper";

export default class SolaceSDK {

    static async getCoverables() {
        return axios.get('https://risk-data.solace.fi/series')
            .then((response:any) => {
                return response.data.data.protocolMap;
            }).catch(error => {
                return [];
            });
    }

    static async fetchQuote(amount: number, currency: string, period: number, protocol: any) {
        const risk = new Risk();
        const coverage = new Coverage(1);
        const nullAddress = '0x0000000000000000000000000000000000000001';
        // let walletAddress = global.user.account !== nullAddress ? global.user.account : nullAddress;
        let walletAddress = nullAddress; // till we want the same info for connected and disconnected wallets
        const array = await risk.getSolaceRiskBalances(walletAddress, 1)
        let capacity:any = await coverage.availableCoverCapacity();

        if(currency === 'ETH') {
            capacity = CurrencyHelper.usd2eth(capacity);
        }
        const exceedsCapacity =  amount > +fromWei(capacity.toString());
        const errorMsg = exceedsCapacity ? { message: `Maximum available capacity is `, capacity: fromWei(capacity.toString()), currency: currency, errorType:"capacity"} : null;

        // if (array && global.user.account !== '0x0000000000000000000000000000000000000001') {
        if (array) {
            return axios.post('https://risk-data.solace.fi/scores',
                {account: walletAddress, positions: array})
                .then((response) => {
                    const data:any = response.data;
                    if(data) {
                        let balance = 0;
                        data.protocols.forEach((protocol:any)=> {
                            balance = balance + protocol.balanceUSD
                        })
                        // const price = global.user.account !== nullAddress ? balance * data.current_rate : amount * data.current_rate;
                        const price = amount * data.current_rate / 365.25 * period

                        global.events.emit("quote", {
                            status: "INITIAL_DATA",
                            distributorName: "solace",
                            amount: amount,
                            currency: currency,
                            period: period,
                            protocol: protocol,
                            price: toWei(price.toString()),
                            pricePercent: data.current_rate,
                            chain: 'ETH',
                            source: 'solace',
                            rawDataSolace: data,
                            errorMsg: null,
                        });
                        return CatalogHelper.quoteFromCoverable(
                            'solace',
                            protocol,
                            {
                                amount: amount,
                                currency: currency,
                                period: period,
                                chain: 'ETH',
                                chainId: global.user.ethNet.networkId,
                                price: toWei(price.toString()),
                                pricePercent: data.current_rate,
                                response: data,
                                source: 'solace',
                                minimumAmount: 1,
                                errorMsg: errorMsg,
                                capacity: capacity,
                                nonPartnerLink: 'https://app.solace.fi/cover',
                            },
                            {
                                capacity: capacity,
                            }
                        );
                    } else return []
                }).catch(error => {
                    return [];
                });
        } else return [];
    }
}
