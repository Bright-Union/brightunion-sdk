import axios from "axios";
import CatalogHelper from "@/service/helpers/catalogHelper";
import CurrencyHelper from "@/service/helpers/currencyHelper";
import {fromWei, toWei} from 'web3-utils';

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
              const capacity = item.remaining_capacity.toString().split('.')[0];
                capacityArr.push(toWei(capacity));
            })
            capacityArr = this.rangeArray(capacityArr);
            const type = CatalogHelper.commonCategory(vault[0].protocol_type, 'ease')
            const typeDescr = type ? type : 'protocol';
            const capacity = fromWei(capacityArr[capacityArr.length - 1].toString());
            const exceedsCapacity = currency === 'USD' ? amount > +capacity :  amount > Number(CurrencyHelper.usd2eth(capacityArr[capacityArr.length - 1]));

            const errorMsg = exceedsCapacity ? { message: `Maximum available capacity is `, capacity: fromWei(capacityArr[capacityArr.length - 1].toString()), currency: currency, errorType:"capacity"} : null;

            if(currency === 'ETH') {
              for (var i = 0; i < capacityArr.length; i++) {
                capacityArr[i] = CurrencyHelper.usd2eth(capacityArr[i]);
              }
            }
            let quoteCapacity = capacityArr[1];

            let quote:any = CatalogHelper.quoteFromCoverable(
                'ease',
                protocol,
                {
                    status: "INITIAL_DATA",
                    amount: amount,
                    currency: currency,
                    period: period,
                    chain: 'ETH',
                    chainId: global.user.ethNet.networkId,
                    price: 0,
                    pricePercent: 0,
                    rawData: vault,
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

            global.events.emit("quote" , quote );

            quote.status = "FINAL_DATA";

            return quote;
        })
    }
}
