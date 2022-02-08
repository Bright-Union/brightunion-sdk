import NetConfig from './NetConfig'
import { fromWei} from 'web3-utils'

const { gtag, install } = require("ga-gtag");

const appId = 'G-E5EN28CF28';
// const appId = 'G-KCNQQRKDP7'; //app - ui ID
// const appId = 'UA-189970983-1';// GA3 property ID
install(appId);

const CURRENCIES: any={
  'ETH': 'EUR',
  'DAI': 'UYI',
  'USDC': 'USN',
  'USDT': 'USD',
  'BNB': 'BND',
  'BUSD': 'BSD',
  'BUSD-T': 'BDT',
  'MATIC': 'MAD',
}

class GoogleEvents {

  static onBUInit = () => {
    if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){

        gtag('set', 'client_id', global.user.clientKey + '_2' );

        gtag('event', 'login', {
          method: global.user.clientKey
        });

      }
    }

    static setFormatCurrency = (_currency:any) => {
      return CURRENCIES[_currency];
    }

  static catalog = () => {
    if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){

      gtag("event", "view_item_list", {
        item_list_name: "Get Catalog",
        items:[
          {
            item_id: "Catalog",
            item_name: "Catalog"
          }
        ],
      });

    }
  }

  static quote = (_quote:any, _type: any) => {
    if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){

      // console.log("GA _quote" , _quote);
      let coverName = _quote.name ? _quote.name : _quote._protocol ? _quote._protocol.name : 'null';

      gtag("event", "select_item", {
        item_list_id: coverName,
        item_list_name: coverName,
        items: [
          {
            item_id: coverName,
            item_name: coverName,
            affiliation: global.user.clientKey,
            currency: this.setFormatCurrency(_quote._currency),
            item_brand: _quote.distributorName,
            item_variant: _quote.amount,
            price: _quote.price,
            quantity: _quote.period,
          }
        ]
      });

    }
  }

  static multiBuy = (_items:any) => {
    // console.log("multiBuy - " , _items);
    if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){
      let formatedItems = [];
      for (var i = 0; i < _items.params[0].length; i++) {
        formatedItems.push(
          {
            item_id: _items.params[0][i],
            item_name: 'InsuraceId_'+_items.params[0][i],
            affiliation: global.user.clientKey,
            currency: this.setFormatCurrency(_items.currency.name),
            item_brand: 'insurace',
            item_variant: fromWei(_items.params[2][i]),
            quantity: _items.params[1][i],
            item_category: "Multibuy"
          })
      }
      gtag("event", "add_to_cart", {
        currency: this.setFormatCurrency(_items.currency.name),
        value:fromWei(_items.premiumAmount),
        items: formatedItems
      });
    }
  };

  static buy = (_quote:any) => {
    // console.log("GA buy" , _quote);
    if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){

      let coverName = _quote.name ? _quote.name : _quote._protocol ? _quote._protocol.name : 'null';

      gtag("event", "add_to_cart", {
        currency: this.setFormatCurrency(_quote._currency),
        value:_quote.price,
        items: [
          {
            item_id: coverName,
            item_name: coverName,
            affiliation: global.user.clientKey,
            currency: this.setFormatCurrency(_quote._currency),
            item_brand: _quote.distributorName,
            item_variant: _quote.amount,
            price: _quote.price,
            quantity: _quote.period,
          }
        ]
      });

    }
  };

  static buyRejected = (_message:any, _quote:any) => {

    // console.log("GA buy Reject" , _message , _quote);

    if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){
      gtag("event", "remove_from_cart", {
        currency: this.setFormatCurrency(_quote._currency),
        value:_quote.price,
        items: [
          {
            item_id: _quote.name,
            item_name:  _quote.name ,
            affiliation: global.user.clientKey,
            currency: this.setFormatCurrency(_quote._currency),
            item_brand: _quote.distributorName,
            item_variant: fromWei(_quote.amount),
            price: _quote.price ? fromWei(_quote.price) : fromWei(_quote.premium),
            quantity: _quote.period,
            item_category: _message,
            item_category2: _quote.amounts ? "Multibuy" : "SingleBuy",
          }
        ]
      });

    }
  };

  static onTxHash = (tx:any) => {

    // console.log("GA - onTxHash - " , tx ) ;

    if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){

      gtag("event", "purchase", {
        transaction_id: tx.hash,
        affiliation: global.user.clientKey,
        value: fromWei(tx.premium),
        tax: 0,
        shipping: 0,
        currency: this.setFormatCurrency( tx.currency ),
        items: [
          {
            item_id: tx.productId,
            item_name: tx.productId,
            affiliation: global.user.clientKey,
            currency: this.setFormatCurrency( tx.currency),
            item_brand: tx.distributor,
            item_variant: fromWei(tx.amount),
            price: fromWei(tx.premium),
            quantity: tx.period
          }]
        });
    }
  };

  static onTxConfirmation = (tx:any) => {
    // console.log("onTxConfirmation" , tx)
    // if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){
    //   this.analytics.track('SDK_Buy_successfull', {
    //     label: global.user.clientKey,
    //     hash: tx,
    //   })
    // }
  };

  static onTxRejected = (tx:any) => {
    // console.log("onTxRejected" , tx)

    if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){

      gtag("event", "remove_from_cart", {
        currency: this.setFormatCurrency(tx.currency),
        value: tx.premium,
        items: [
          {
            item_id: tx.productId,
            item_name:  tx.productId,
            affiliation: global.user.clientKey,
            currency: this.setFormatCurrency(tx.currency),
            item_brand: tx.distributor,
            item_list_id: tx.hash,
            item_variant: tx.amount,
            price: tx.premium,
            quantity: tx.period,
            item_category: "REJECTED",
          }
        ]
      });

    }
  };

}

export default GoogleEvents;
