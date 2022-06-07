import axios from 'axios';
import {_getUnslashedCapasityContract, _getUnslashedContract} from "@/service/helpers/getContract";
import CatalogHelper from '../helpers/catalogHelper';
import {fromWei, toWei} from "web3-utils";
import CurrencyHelper from "@/service/helpers/currencyHelper";


export default class UnslashedAPI {
    static fetchCoverables() {

        return axios.get(`https://static.unslashed.finance/networks/1.json`)
            .then((response) => {
                return response.data;
            }).catch(error => {
                return [];
            });
    }

    static fetchQuote(amount: number, currency: string, period: number, protocol: any) {
        return this.fetchCoverables()
            .then(async (data: any) => {
                let cover = data.BasketableMarket.data;
                let coverArr = Object.values(cover);
                let addressArr = Object.keys(cover);
                let fullCover:any = [];
                for (let i = 0; i < coverArr.length; i ++) {
                    let coverObj = {
                        address: addressArr[i],
                        cover: coverArr[i]
                    }
                    fullCover.push(coverObj);
                }
                console.log(currency)
                if(currency === 'USD') {
                    amount = Number(CurrencyHelper.usd2eth(amount))
                }
                const protocolName = protocol.name.toLowerCase().split(" ")[0];
                const quote = fullCover.find((item: any) => item.cover.static.name.toLowerCase().includes(protocolName));
                const unslashedInstance = await _getUnslashedContract(quote.address);
                const unslashedCapacityInstance = await _getUnslashedCapasityContract(quote.address);
                let apy = await unslashedInstance.methods.getDynamicPricePerYear18eRatio().call().then((pricePerYear:any) => {
                    return fromWei(pricePerYear);
                })
                let price = await unslashedInstance.methods.coverToPremium(toWei(String(amount))).call().then((premium:any) => {
                  return premium;
                })
                    price = currency === 'USD' ? Number(fromWei(CurrencyHelper.eth2usd(price))) : fromWei(price)
                console.log(amount)
                console.log(price)
                // console.log(unslashedCapacityInstance.methods)
                // unslashedCapacityInstance.methods.coverToPremium(toWei(String(amount))).call().then((premium:any) => {
                //     // console.log(fromWei(premium, 'ether'));
                //     console.log(premium);
                // })
                if(quote) {
                    const errorMsg = quote.cover.static.soldOut ? {message: `Sold out`, errorType: "capacity"} : null;
                    global.events.emit("quote", {
                        status: "INITIAL_DATA",
                        distributorName: "Unslashed",
                        amount: amount,
                        currency: currency,
                        period: period,
                        protocol: protocol,
                        chain: 'ETH',
                        name: quote.cover.name,
                        source: 'ease',
                        rawDataUnslashed: quote.cover.static,
                        type: quote.cover.type,
                    });

                    return CatalogHelper.quoteFromCoverable(
                        'unslashed',
                        protocol,
                        {
                            amount: amount,
                            currency: currency,
                            period: period,
                            chain: 'ETH',
                            chainId: global.user.ethNet.networkId,
                            price: price,
                            pricePercent: Number(apy) * 100,
                            response: quote.cover.static,
                            source: 'unslashed',
                            minimumAmount: 1,
                            name: quote.cover.static.name,
                            errorMsg: errorMsg,
                            type: quote.cover.static.type,
                        },
                        {
                            capacity: quote.cover.static.soldOut ? 0 : 100000,
                        }
                    );
                }
                // return {}
                })

    }
}
