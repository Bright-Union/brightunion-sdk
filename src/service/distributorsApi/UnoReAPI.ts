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

        let quote =   CatalogHelper.quoteFromCoverable(
          'unore',
          protocol,
          {
            status: "INITIAL_DATA",
            amount: amount,
            currency: currency,
            period: period,
            chain: 'ETH',
            chainId: global.user.ethNet.networkId,
            minimumAmount: 1,
            errorMsg: null,
            capacity: "9999999999999999999999999999999999999999999999999999999",
            nonPartnerLink: 'https://app.unore.io/buy-cover',
          },
          {
            capacity: "9999999999999999999999999999999999999999999999999999999",
          }
        );

        return this.fetchCoverables()
            .then(async (data: any) => {
                let cover = data.data.data;

                const protocolName = protocol.name.toLowerCase().split(" ")[0];
                const quoteFound = cover.find((item: any) => item.name.toLowerCase().includes(protocolName));

                if(quoteFound) {
                    let type = CatalogHelper.commonCategory(quoteFound.category, 'unore');
                    const typeDescr = type ? type : 'protocol';
                    let price:any = 0;
                    let pricePercent:any = Number(quoteFound.premium_factor) * 100;
                    if(currency !== 'ETH') {
                        price = await this.fetchCoverPrice(quoteFound, amount, period, usdcPrice).then((res:any) => {
                            return toWei(String(res.data.premium))
                        })
                    } else {
                      let amountInUSD = Number(CurrencyHelper.eth2usd(amount));
                        price = await this.fetchCoverPrice(quoteFound, amountInUSD , period, usdcPrice).then((res:any) => {
                            const priceInETH = Number(CurrencyHelper.usd2eth(toWei(String(res.data.premium))));
                            return String(priceInETH);
                        })
                    }

                    quote.price = price;
                    quote.pricePercent = pricePercent;
                    quote.name = quoteFound.name;
                    quote.type = type;
                    quote.typeDescription = CatalogHelper.descriptionByCategory(typeDescr);
                    quote.rawData = quoteFound;

                    global.events.emit("quote", quote);
                    quote.status = "FINAL_DATA";

                    return quote
                }
            })

    }

    static fetchCovers():any {
      return [];
    }

}
