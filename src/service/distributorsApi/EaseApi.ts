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
            vault.forEach((item: any) => {
                capacityArr.push(item.remaining_capacity);
            })
            capacityArr = this.rangeArray(capacityArr);
            const type = CatalogHelper.commonCategory(vault[0].protocol_type, 'ease')
            const typeDescr = type ? type : 'protocol';
            const exceedsCapacity = currency === 'USD' ? amount > capacityArr[capacityArr.length - 1] :  amount > Number(CurrencyHelper.usd2eth(capacityArr[capacityArr.length - 1]));
            const errorMsg = exceedsCapacity ? { message: `Maximum available capacity is `, currency: currency, errorType:"capacity"} : null;

            if(currency === 'ETH') {
              for (var i = 0; i < capacityArr.length; i++) {
                capacityArr[i] = CurrencyHelper.usd2eth(capacityArr[i]);
              }
            }

            let quoteCapacity = capacityArr[1];

                global.events.emit("quote" , {
                    status: "INITIAL_DATA" ,
                    distributorName: "Ease",
                    amount:amount,
                    currency:currency,
                    period:period,
                    protocol:protocol,
                    chain: 'ETH',
                    name: CatalogHelper.unifyCoverName(vault[0].display_name, 'ease' ),
                    source: 'ease',
                    rawDataEase: vault,
                    type: type,
                    typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
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
                    price: 0,
                    pricePercent: 0,
                    response: vault,
                    source: 'ease',
                    minimumAmount: 1,
                    name: CatalogHelper.unifyCoverName(vault[0].display_name, 'ease' ),
                    errorMsg: errorMsg,
                    capacity:quoteCapacity,
                    type: type,
                    typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
                },
                {
                    capacity: capacityArr,
                }
            );
        })
    }
}
