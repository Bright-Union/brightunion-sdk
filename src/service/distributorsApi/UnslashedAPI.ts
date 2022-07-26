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

    static async fetchQuote(amount: number, currency: string, period: number, protocol: any) {

      let coveredAmount:any = currency === 'USD' ? Number(CurrencyHelper.usd2eth(amount)) : amount;

      let quote = protocol.rawDataUnslashed.static

      const unslashedInstance = await _getUnslashedContract(quote.address);

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
      if(quote.soldOut || price == 0){
        errorMsg = {message: `Sold out`, errorType: "capacity"}
      }

      price = currency === 'USD' ? Number(CurrencyHelper.eth2usd(price)) : price;

      if(quote) {
        global.events.emit("quote", {
          status: "INITIAL_DATA",
          distributorName: "unslashed",
          amount: amount,
          currency: currency,
          price: price,
          pricePercent: Number(apy) * 100,
          period: period,
          protocol: protocol,
          chain: 'ETH',
          name: quote.name,
          source: 'ease',
          actualPeriod: rolloverDate,
          rawDataUnslashed: quote,
          type: quote.type,
          typeDescription: quote.description,
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
            response: quote.static,
            source: 'unslashed',
            minimumAmount: 1,
            name: quote.name,
            errorMsg: errorMsg,
            type: quote.type,
            typeDescription: quote.description,
            capacity: quote.soldOut ? 0 : "9999999999999999999999999999999999999999999999999999999",
            nonPartnerLink: 'https://app.unslashed.finance/cover/' + quote.address,
          },
          {
            capacity: quote.soldOut ? 0 : "9999999999999999999999999999999999999999999999999999999",
          }
        );
      }

    }

    static fetchCovers (){
      return this.fetchCoverables().then(
        async (data: any) => {

          const unslashedInstanceGetCovers = await _getUnslashedCoversContract(data.BulkDataGetter.address);

          let addressArr:string[] = [];
          let covers = data.BasketMarket ? data.BasketMarket.data : [];
          covers = Object.values(covers).filter((item:any) => {
            if(!item.static.soldOut && item.static.status != 'inactive'){
              addressArr.push(item.static.address);
              return item;
            }
          });

          const coverages = await unslashedInstanceGetCovers.methods.getUserData( addressArr , global.user.account ).call();
          for (let i = 0; i < covers.length; i ++) {
            covers[i].coverage = coverages[i];
          }
          covers = covers.filter( ( _cover:any ) => {
            if( Number(_cover.coverage.userCoverBalance) > 0 ){
              return _cover;
            }
          })
          for (let i = 0; i < covers.length; i ++) {
            const unslashedInstance = await _getUnslashedContract(covers[i].static.address);
            covers[i].static.rolloverDate = await unslashedInstance.methods.getRolloverDate().call().then(
              (timestamp:any) => {
                return timestamp;
              }, () => {
                return 0;
              }
            )
          }

          return covers;

        }
      )
    }

}
