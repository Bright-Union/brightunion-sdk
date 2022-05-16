import axios from "axios";
import CatalogHelper from "@/service/helpers/catalogHelper";
import CurrencyHelper from "@/service/helpers/currencyHelper";


export default class EaseApi {
    static fetchCoverables() {
        return axios.get('https://app.ease.org/api/v1/vaults')
            .then((response) => {
                return response.data;
            }).catch(error => {
                return [];
            });
    }

    static rangeArray(array:any) {
        array.sort((a:any, b:any) => (a - b));
        array = array.length < 2 ? array : [array[0], array[array.length - 1]]
        return array;
    }

    static fetchQuote ( amount:number, currency:string, period:number, protocol:any) {
        return axios.get('https://app.ease.org/api/v1/vaults').then(async (response:any) => {
            const protocolName = protocol.name.toLowerCase().split(" ")[0];
            const vault = response.data.filter((item: any) => item.token.name.toLowerCase().includes(protocolName));
            let capacityArr:any = [];
            let price = currency === 'ETH' ? vault[0].token.priceETH : vault[0].token.priceUSD;
            vault.forEach((item: any) => {
                capacityArr.push(item.remaining_capacity);
            })
            capacityArr = this.rangeArray(capacityArr);
            const exceedsCapacity = currency === 'USD' ? amount > capacityArr[1] :  amount > Number(CurrencyHelper.usd2eth(capacityArr[1]));
            const errorMsg = exceedsCapacity ? { message: `Maximum available capacity is `, currency: currency, errorType:"capacity"} : null;

                global.events.emit("quote" , {
                    status: "INITIAL_DATA" ,
                    distributorName: "Ease",
                    pricePercent:vault[0].token.apy,
                    amount:amount,
                    currency:currency,
                    period:period,
                    protocol:protocol,
                    chain: 'ETH',
                    rawData: vault[0],
                    protocolAddress: vault[0].address,
                    logo: vault[0].icon,
                    name: CatalogHelper.unifyCoverName(vault[0].display_name, 'ease' ),
                    source: 'ease',
                    rawDataEase: vault[0],
                    type: vault[0].protocol_type,
                    stats: {"capacityRemaining": vault[0].remaining_capacity, "unitCost":vault[0].token.apy, "priceETH": vault[0].token.priceETH, "priceUSD": vault[0].token.priceUSD}
                } );

            return CatalogHelper.quoteFromCoverable(
                'ease',
                protocol,
                {
                    amount: amount,
                    currency: currency,
                    period: period,
                    chain: 'ETH',
                    chainId: global.user.ethNet.networkId,
                    price: price,
                    pricePercent: vault[0].token.apy,
                    response: [],
                    source: 'ease',
                    minimumAmount: 1,
                    errorMsg: errorMsg,
                    type: vault[0].protocol_type,
                    typeDescription: vault[0].protocol_type,
                },
                {
                    capacity: capacityArr,
                    // activeCoversETH: activeCoversETH,
                    // activeCoversDAI: activeCoversDAI,
                    // capacityETH: capacityETH,
                    // capacityDAI: capacityDAI,
                    // totalCovers: totalCovers,
                    // totalActiveCoversDAI: totalActiveCoversDAI,
                    // totalActiveCoversETH: totalActiveCoversETH,
                }
            );
        })
    }
}

