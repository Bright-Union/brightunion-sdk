import axios from "axios";
import data from "../abi/ease.json"
import CatalogHelper from "@/service/helpers/catalogHelper";
import NetConfig from "@/service/config/NetConfig";
import {startsWith} from "lodash";
import {fromWei} from "web3-utils";


export default class EaseApi {
    static fetchCoverables() {
        return axios.get('https://app.ease.org/api/v1/vaults')
            .then((response) => {
                return response.data;
            }).catch(error => {
                return [];
            });
    }

    static fetchQuote ( amount:number, currency:string, period:number, protocol:any) {
        return axios.get('https://app.ease.org/api/v1/vaults').then(async (response:any) => {
            const protocolName = protocol.name.toLowerCase().split(" ")[0];
            const vault = response.data.filter((item: any) => item.token.name.toLowerCase().includes(protocolName));
            const exceedsCapacity = amount > Number(vault[0].remaining_capacity.toFixed(0));
            const errorMsg = exceedsCapacity ? { message: `Maximum available capacity is `, currency: 'USD', errorType:"capacity"} : null;
            let capacityArr:any = [];

            vault.forEach((item: any) => {
                capacityArr.push(item.remaining_capacity)
            })
            capacityArr.sort((a:any, b:any) => (a - b));
            capacityArr = capacityArr.length < 2 ? capacityArr : [capacityArr[0], capacityArr[capacityArr.length - 1]]

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

            console.log(capacityArr)
            return CatalogHelper.quoteFromCoverable(
                'ease',
                protocol,
                {
                    amount: amount,
                    currency: currency,
                    period: period,
                    chain: 'ETH',
                    chainId: global.user.ethNet.networkId,
                    price: 100,
                    pricePercent: 10,
                    response: vault,
                    source: 'ease',
                    errorMsg: errorMsg,
                    // minimumAmount: minimumAmount,
                },
                {
                    capacity: capacityArr
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

