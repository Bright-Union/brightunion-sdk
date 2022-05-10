import axios from "axios";
import data from "../abi/ease.json"
import CatalogHelper from "@/service/helpers/catalogHelper";
import NetConfig from "@/service/config/NetConfig";


export default class EaseApi {
    static fetchCoverables() {
        // console.log(data)
        // return data;
        return axios.get('https://app.ease.org/api/v1/vaults')
            .then((response) => {
                console.log(response)
                return response;
            }).catch(error => {
                return [];
            });
    }

    // static fetchQuote ( amount:number, currency:string, period:number, protocol:any) :Promise<any> {
    //     return axios.get(
    //         `${NetConfig.netById(global.user.ethNet.networkId).nexusAPI}/v1/quote?coverAmount=${amount}&currency=${currency}&period=${period}&contractAddress=${protocol.nexusCoverable}`,
    //         {
    //             headers : {
    //             }
    //         }
    //     ).then(async (response:any) => {
    //         console.log(response)
    //         return CatalogHelper.quoteFromCoverable(
    //             'ease',
    //             protocol,
    //             {
    //                 // amount: amountInWei,
    //                 currency: currency,
    //                 period: period,
    //                 chain: 'ETH',
    //                 chainId: global.user.ethNet.networkId,
    //                 // price: priceWithFee.toString(),
    //                 // pricePercent: pricePercent,
    //                 response: response.data,
    //                 // defaultCurrencySymbol:defaultCurrencySymbol,
    //                 // errorMsg: nexusMaxCapacityError,
    //                 // minimumAmount: minimumAmount,
    //             },
    //             {
    //                 // activeCoversETH: activeCoversETH,
    //                 // activeCoversDAI: activeCoversDAI,
    //                 // capacityETH: capacityETH,
    //                 // capacityDAI: capacityDAI,
    //                 // totalCovers: totalCovers,
    //                 // totalActiveCoversDAI: totalActiveCoversDAI,
    //                 // totalActiveCoversETH: totalActiveCoversETH,
    //             }
    //         );
    //     })
    // }
}

