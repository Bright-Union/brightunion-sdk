import { Coverage, Risk } from "@solace-fi/sdk"
import axios from "axios";
import CatalogHelper from "@/service/helpers/catalogHelper";
import {fromWei, toWei} from "web3-utils";

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
        const nullAddress = '0x0000000000000000000000000000000000000001'; // '0xC6C9D802bC16d8746AAfCAc4781F9a8d442D585D'
        let walletAddress = global.user.account !== nullAddress ? global.user.account : nullAddress;
        const array = await risk.getSolaceRiskBalances(walletAddress, 1)
        const capacity = await coverage.availableCoverCapacity();
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
                        const price = global.user.account !== nullAddress ? balance * data.current_rate : amount * data.current_rate;
                        // const price = balance * data.current_rate / 365.25 * period

                        global.events.emit("quote", {
                            status: "INITIAL_DATA",
                            distributorName: "Solace",
                            amount: amount,
                            currency: currency,
                            period: period,
                            protocol: protocol,
                            chain: 'ETH',
                            // name: CatalogHelper.unifyCoverName(cover.appId, 'solace' ),
                            source: 'solace',
                            rawDataSolace: data,
                            errorMsg: null,
                            // typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
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
                                price: price,
                                pricePercent: data.current_rate,
                                response: data,
                                source: 'solace',
                                minimumAmount: 1,
                                // name: CatalogHelper.unifyCoverName(cover.appId, 'solace' ),
                                // errorMsg: null,
                                // type: cover.type,
                                // typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
                                capacity: capacity
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
