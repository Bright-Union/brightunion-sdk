import axios from "axios";
import CurrencyHelper from "@/service/helpers/currencyHelper";
import {_getUnslashedContract} from "@/service/helpers/getContract";
import {fromWei, toWei} from "web3-utils";
import CatalogHelper from "@/service/helpers/catalogHelper";


export default class UnoReAPI {
    static fetchCoverables() {

        return axios.get(`https://cover.unore.io/api/unlocked-smart-contract-params?first=0&search=&limit=100&type=2`)
            .then((response) => {
                return response.data;
            }).catch(error => {
                return [];
            });
    }

    static async fetchUSDCPrice() {
        return axios.get(`https://cover.unore.io/api/usdc-price`)
            .then((response) => {
                return response.data;
            }).catch(error => {
                return [];
            });
    }

    static fetchCoverPrice(cover:any, amount: number, period: number, usdcPrice:number) {
        cover.id = `Smart Contract Cover-${cover.address}-txHash`;
        cover.coverAmount = amount.toString();
        cover.usdcAmount = usdcPrice * amount;
        cover.coverDuration = Number(period);
        cover.coverDurType = "Year";
        cover.coverType = cover.product_type;
        cover.premiumFactor = cover.premium_factor;

        const body = {"data": [cover]}

        return axios.post(`https://cover.unore.io/api/getcoverusdprice`, body)
            .then((response) => {
                return response.data;
            }).catch(error => {
                return [];
            });
    }

    static async fetchQuote(amount: number, currency: string, period: number, protocol: any) {
        const usdcPrice = await this.fetchUSDCPrice().then((res:any) => {
            return res.data.usdcAmtForOneDollar;
        })
        return this.fetchCoverables()
            .then(async (data: any) => {
                let cover = data.data.data;

                const protocolName = protocol.name.toLowerCase().split(" ")[0];
                const quote = cover.find((item: any) => item.name.toLowerCase().includes(protocolName));

                if(quote) {
                    let type = CatalogHelper.commonCategory(quote.category, 'unore');
                    const typeDescr = type ? type : 'protocol';
                    let price:any = 0;
                    if(currency === 'USD') {
                        price = await this.fetchCoverPrice(quote, amount, period, usdcPrice).then((res:any) => {
                            return toWei(String(res.data.premium))
                        })
                    } else {
                        price = await this.fetchCoverPrice(quote, Number(CurrencyHelper.eth2usd(amount)), period, usdcPrice).then((res:any) => {
                            const convertedNumber = Number(CurrencyHelper.usd2eth(toWei(String(res.data.premium))));
                            return fromWei(String(convertedNumber))
                        })
                    }
                    global.events.emit("quote", {
                        status: "INITIAL_DATA",
                        distributorName: "Unore",
                        amount: amount,
                        currency: currency,
                        price: price,
                        pricePercent: Number(quote.premium_factor) * 100,
                        period: period,
                        protocol: protocol,
                        chain: 'ETH',
                        name: quote.name,
                        source: 'unore',
                        rawDataUnore: quote,
                        type: type,
                        errorMsg: null,
                        typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
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
                            price: price,
                            pricePercent: Number(quote.premium_factor) * 100,
                            response: quote,
                            source: 'unore',
                            minimumAmount: 1,
                            name: quote.name,
                            errorMsg: null,
                            type: type,
                            typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
                            capacity: "9999999999999999999999999999999999999999999999999999999",
                        },
                        {
                            capacity: "9999999999999999999999999999999999999999999999999999999",
                        }
                    );
                }
            })

    }

    static fetchCovers():any {
      return [];
    }

}
