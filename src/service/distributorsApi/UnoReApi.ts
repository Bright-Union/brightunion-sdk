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

    static fetchCoverPrice(cover:any, amount: number, period: number) {
        cover.id = `Smart Contract Cover-${cover.address}-txHash`;
        cover.coverAmount = amount.toString();
        cover.usdcAmount = amount.toString();
        cover.coverDuration = Number(period);
        cover.coverDurType = "Year"
        // {"id": `Smart Contract Cover-${cover.address}-txHash`,
        //     "name": cover.name,
        //     "premium_factor": cover.premium_factor,
        //     "product_type": cover.product_type,
        //     "status": cover.status,
        //     "address": cover.address,
        //     "symbol": cover.symbol,
        //     "url": cover.url,
        //     "description": cover.description,
        //     "chain":"Multi-Chain",
        //     "logo": cover.logo,
        //     "audits": cover.audits,
        //     "audit_note": cover.audit_note,
        //     "gecko_id": cover.gecko_id,
        //     "cmcId": cover.cmcId,
        //     "category": cover.category,
        //     "chains":cover.chains,
        //     "coverDuration":period,
        //     "coverDurType":"Year",
        //     "coverAmount":amount,
        //     "usdcAmount": amount,
        //     "openDropdown":false,
        //     "coverType": cover.coverType,
        //     "premiumFactor": cover.premium_factor,
        //     "assetAddress": cover.address}

        const body = {"data": [cover]}
        console.log(body)

        return axios.post(`https://cover.unore.io/api/getcoverusdprice`, body)
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
                let price = await this.fetchCoverPrice(quote, amount, period).then((res:any) => {
                    console.log(res.data.premium)
                    return res.data.premium
                })
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
                            price: price,
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
