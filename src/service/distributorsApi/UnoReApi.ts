import axios from "axios";
import CurrencyHelper from "@/service/helpers/currencyHelper";
import {_getUnslashedContract} from "@/service/helpers/getContract";
import {fromWei, toWei} from "web3-utils";
import CatalogHelper from "@/service/helpers/catalogHelper";


export default class UnoReApi {
    static fetchCoverables() {

        return axios.get(`https://cover.unore.io/api/unlocked-smart-contract-params?first=0&search=&limit=100&type=2`)
            .then((response) => {
                return response.data;
            }).catch(error => {
                return [];
            });
    }

    static fetchQuote(amount: number, currency: string, period: number, protocol: any) {
        return this.fetchCoverables()
            .then(async (data: any) => {
                let cover = data.data.data;
                if(currency === 'USD') {
                    amount = Number(CurrencyHelper.usd2eth(amount))
                }
                const protocolName = protocol.name.toLowerCase().split(" ")[0];
                const quote = cover.find((item: any) => item.name.toLowerCase().includes(protocolName));

                if(quote) {
                    // const errorMsg = quote.cover.static.soldOut ? {message: `Sold out`, errorType: "capacity"} : null;
                    global.events.emit("quote", {
                        status: "INITIAL_DATA",
                        distributorName: "Unore",
                        amount: amount,
                        currency: currency,
                        period: period,
                        protocol: protocol,
                        chain: 'ETH',
                        name: quote.name,
                        source: 'unore',
                        rawDataUnore: quote,
                        type: quote.type,
                    });

                    return CatalogHelper.quoteFromCoverable(
                        'unore',
                        protocol,
                        {
                            amount: amount,
                            currency: currency,
                            period: period,
                            chain: 'ETH',
                            chainId: global.user.ethNet.networkId,
                            price: 0,
                            pricePercent: Number(quote.premium_factor) * 100,
                            response: quote,
                            source: 'unore',
                            minimumAmount: 1,
                            name: quote.name,
                            // errorMsg: errorMsg,
                            type: quote.type,
                        },
                        {
                            capacity: 100000,
                        }
                    );
                }
            })

    }
}
