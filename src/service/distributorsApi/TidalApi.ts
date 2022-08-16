import axios from 'axios';
import CatalogHelper from "@/service/helpers/catalogHelper";
import CurrencyHelper from "@/service/helpers/currencyHelper";
import {fromWei, toWei } from 'web3-utils';

export default class TidalApi {
    static fetchCoverables() {

        return axios.get(`https://tidal-0828.unseenmagic.com/get_all_assets`)
            .then((response) => {
                return response.data;
            }).catch(error => {
                return [];
            });
    }

    static async fetchQuote(amount: number, currency: string, period: number, protocol: any) {

        let quote:any = CatalogHelper.quoteFromCoverable(
            'tidal',
            protocol,
            {
                status: "INITIAL_DATA",
                amount: amount,
                currency: currency,
                period: period,
                chain: 'POLYGON',
                chainId: global.user.ethNet.networkId,
                minimumAmount: 1,
                nonPartnerLink: 'https://app.tidal.finance/',
            },
            {}
        );

        return this.fetchCoverables()
            .then(async (data: any) => {
                let cover = data;

                const protocolName = protocol.name.toLowerCase().split(" ")[0];
                const quoteFound = cover.find((item: any) => item.name.toLowerCase().includes(protocolName));
                const capacity = currency === 'USD' ? quoteFound.sellerBalance : Number(CurrencyHelper.usd2eth(quoteFound.sellerBalance));
                const price = currency === 'USD' ? toWei(String(quoteFound.price)) : Number(CurrencyHelper.usd2eth(toWei(String(quoteFound.price))));
                const exceedsCapacity = amount > capacity;
                const errorMsg = exceedsCapacity ? { message: `Maximum available capacity is `, currency: currency, errorType:"capacity"} : null;

                const pricePercentAnnual = (quoteFound.premiumRate / 10000 * 52) ;
                let periodPrice = amount * ( pricePercentAnnual / 100) * ( period / 365 );

                if(quoteFound) {
                    const type = CatalogHelper.commonCategory(quoteFound.category, 'tidal');
                    const typeDescr = type ? type : 'protocol';

                    quote.price = toWei(periodPrice.toString());
                    quote.pricePercent = pricePercentAnnual;
                    quote.rawData = quoteFound;
                    quote.name = quoteFound.name;
                    quote.errorMsg = errorMsg;
                    quote.type = type;
                    quote.typeDescription = CatalogHelper.descriptionByCategory(typeDescr);
                    quote.capacity = toWei(String(capacity));

                    quote.status = {
                      capacity: toWei(String(capacity)),
                    };

                    global.events.emit("quote", quote);

                    quote.status = "FINAL_DATA";

                    return quote;
                }
            })

    }
}
