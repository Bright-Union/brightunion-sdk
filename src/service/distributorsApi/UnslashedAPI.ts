import axios from 'axios';
import {
  _getUnslashedContract,
  _getUnslashedCoversContract,
} from "@/service/helpers/getContract";
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

                let cover = data.BasketMarket ? data.BasketMarket.data : [];
                let coverArr = Object.values(cover);
                let addressArr = Object.keys(cover);
                let fullCover:any = [];
                let coveredAmount:any = null;
                for (let i = 0; i < coverArr.length; i ++) {
                    let coverObj = {
                        address: addressArr[i],
                        cover: coverArr[i]
                    }
                    fullCover.push(coverObj);
                }
                coveredAmount = currency === 'USD' ? Number(CurrencyHelper.usd2eth(amount)) : amount;

                const protocolName = protocol.name.toLowerCase().split(" ")[0];
                const quote = fullCover.find((item: any) => item.cover.static.name.toLowerCase().includes(protocolName));
                const unslashedInstance = await _getUnslashedContract(quote.address);

                console.log("quote add - " , quote.address);

                let apy = await unslashedInstance.methods.getDynamicPricePerYear18eRatio().call().then(
                  (pricePerYear:any) => {
                    return fromWei(pricePerYear);
                  } , () => {
                    return 0;
                  }
                )

                let rolloverDate = await unslashedInstance.methods.getRolloverDate().call().then(
                  (timestamp:any) => {
                    return timestamp;
                  }, () => {
                    return 0;
                  }
                )

                let price = await unslashedInstance.methods.coverToPremium(toWei(String(coveredAmount))).call()
                .then(
                  (premium:any) => {
                    return premium;
                  }, () => {
                    return 0;
                  }
                )

                let errorMsg = null;
                if(quote.cover.static.soldOut || price == 0){
                  errorMsg = {message: `Sold out`, errorType: "capacity"}
                }

                price = currency === 'USD' ? Number(fromWei(CurrencyHelper.eth2usd(price))) : fromWei(price)

                if(quote) {
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
                        actualPeriod: rolloverDate,
                        rawDataUnslashed: quote.cover.static,
                        type: quote.cover.type,
                        typeDescription: quote.cover.static.description,
                    });

                    return CatalogHelper.quoteFromCoverable(
                        'unslashed',
                        protocol,
                        {
                            amount: amount,
                            actualPeriod: rolloverDate,
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
                            typeDescription: quote.cover.static.description,
                            capacity: quote.cover.static.soldOut ? 0 : "9999999999999999999999999999999999999999999999999999999",
                            nonPartnerLink: 'https://app.unslashed.finance/cover/' + quote.address,
                        },
                        {
                            capacity: quote.cover.static.soldOut ? 0 : "9999999999999999999999999999999999999999999999999999999",
                        }
                    );
                }
                })

    }

    static fetchCovers (){
      return this.fetchCoverables()
          .then(async (data: any) => {

            let covers = data.BasketMarket ? data.BasketMarket.data : [];
            // let coverArr = Object.values(cover);
            let addressArr:string[] = Object.keys(covers);
            let addArray:string[] = [];

            for (var i = 0; i < addressArr.length; i++) {
              addArray.push(addressArr[i]);
            }

            console.log("addressArr , " ,typeof addressArr, typeof addArray);

            const unslashedInstanceGetCovers = await _getUnslashedCoversContract(data.BulkDataGetter.address);

            // ["0xfa6Ace98caAD9Ff12A4b764091c3B5E41705D230", "0x71879eD2897033EB9E4F3B94bE21ED810f759456"]

            unslashedInstanceGetCovers.methods.getUserData( addArray , global.user.account ).call().then(( data:any ) => {

              console.log("unslashedInstance res - " , data );

            }, (err:any) => {
              console.log("ERROROR - " , err );
            })

          })
    }
}
