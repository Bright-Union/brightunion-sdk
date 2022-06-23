import axios from 'axios';
import CatalogHelper from "@/service/helpers/catalogHelper";
import CurrencyHelper from "@/service/helpers/currencyHelper";
import { toWei } from 'web3-utils';

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
        return this.fetchCoverables()
            .then(async (data: any) => {
                let cover = data;

                const protocolName = protocol.name.toLowerCase().split(" ")[0];
                const quote = cover.find((item: any) => item.name.toLowerCase().includes(protocolName));
                const capacity = currency === 'USD' ? quote.sellerBalance : Number(CurrencyHelper.usd2eth(quote.sellerBalance));
                const price = currency === 'USD' ? toWei(String(quote.price)) : Number(CurrencyHelper.usd2eth(toWei(String(quote.price))));
                console.log(price)
                const exceedsCapacity = amount > capacity;
                const errorMsg = exceedsCapacity ? { message: `Maximum available capacity is `, currency: currency, errorType:"capacity"} : null;

                if(quote) {
                    let type = 'protocol';
                    const typeDescr = type ? type : 'protocol';

                    global.events.emit("quote", {
                        status: "INITIAL_DATA",
                        distributorName: "Tidal",
                        amount: amount,
                        currency: currency,
                        period: period,
                        protocol: protocol,
                        chain: 'ETH',
                        name: quote.name,
                        source: 'tidal',
                        rawDataTidal: quote,
                        type: type,
                        errorMsg: null,
                        typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
                    });

                    return CatalogHelper.quoteFromCoverable(
                        'tidal',
                        protocol,
                        {
                            amount: amount,
                            currency: currency,
                            period: period,
                            chain: 'ETH',
                            chainId: global.user.ethNet.networkId,
                            price: price,
                            pricePercent: quote.premiumRate / 10000,
                            response: quote,
                            source: 'tidal',
                            minimumAmount: 1,
                            name: quote.name,
                            errorMsg: errorMsg,
                            type: type,
                            typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
                            capacity: toWei(String(capacity)),
                        },
                        {
                            capacity: toWei(String(capacity)),
                        }
                    );
                }
            })

    }
}
