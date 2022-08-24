import { CoverageV3, Risk } from "@solace-fi/sdk"
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
        const coverage = new CoverageV3(1);
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

        let quote = CatalogHelper.quoteFromCoverable(
          'solace',
          protocol,
          {
            status: "INITIAL_DATA",
            amount: amount,
            currency: currency,
            period: period,
            chain: 'ETH',
            chainId: global.user.ethNet.networkId,
            minimumAmount: 1,
            errorMsg: errorMsg,
            capacity: capacity,
            nonPartnerLink: 'https://app.solace.fi/cover',
          },
          {
            capacity: capacity,
          }
        );

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

                        const price = amount * data.current_rate / 365.25 * period

                        quote.price = toWei(price.toString()),
                        quote.pricePercent = data.current_rate * 100,
                        quote.rawData = data;

                        global.events.emit("quote", quote );

                        quote.status = "FINAL_DATA";

                        return quote;

                    } else return []
                }).catch(error => {
                    return  {error: error};
                });
        } else return [];
    }
}
