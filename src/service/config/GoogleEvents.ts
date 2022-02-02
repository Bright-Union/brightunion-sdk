import Analytics from 'analytics'
// declare module '*';
// @ts-ignore
import googleAnalytics from '@analytics/google-analytics'
import NetConfig from './NetConfig'
const { gtag, install } = require("ga-gtag");
// const appId = 'G-KCNQQRKDP7';
// const appId = '277065560';
const appId = 'UA-189970983-1';

install(appId);

class GoogleEvents {

  static analytics = Analytics({
    app: 'BrightClient_SDK',
    plugins: [
      googleAnalytics({
        trackingId: appId,
      })
    ]
  })

  static onBUInit = () => {
    // if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){

      console.log("INIT EVENT 1");

      let pData = {
        label: global.user.clientKey,
        transaction_id: "T_12345",
        affiliation: global.user.clientKey,
        value: 333,
        items: [
          {
            item_id: "SKU_12345",
            item_name: "Test SDK item",
            affiliation: global.user.clientKey,
          }],
        }

        this.analytics.track('purchase', pData )
        this.analytics.track('event', pData )

        gtag.purchase({
          "transaction_id": "testTX",
          "affiliation": "test_provider",
          "value": 333,
          "currency": "USD",
          "items": [{
            "name": "TEst Item Product",
            "quantity": 180,
          }],
        })

        gtag('event', 'SDK-TEST1', pData );

        gtag("event", "purchase", {
          label: global.user.clientKey,
          transaction_id: "T_12345",
          affiliation: "Google Merchandise Store",
          value: 36.32,
          tax: 4.90,
          shipping: 5.99,
          currency: "USD",
          coupon: "SUMMER_SALE",
          items: [
            {
              item_id: "SKU_12345",
              item_name: "Stan and Friends Tee",
              affiliation: "Google Merchandise Store",
              coupon: "SUMMER_FUN",
              currency: "USD",
              discount: 2.22,
              index: 0,
              item_brand: "Google",
              item_category: "Apparel",
              item_category2: "Adult",
              item_category3: "Shirts",
              item_category4: "Crew",
              item_category5: "Short sleeve",
              item_list_id: "related_products",
              item_list_name: "Related Products",
              item_variant: "green",
              location_id: "L_12345",
              price: 9.99,
              quantity: 1
            }]
          });

          gtag("event", "add_to_cart", {
            currency: "USD",
            value: 7.77,
            items: [
              {
                item_id: "SKU_12345",
                item_name: "Stan and Friends Tee",
                affiliation: "Google Merchandise Store",
                coupon: "SUMMER_FUN",
                currency: "USD",
                discount: 2.22,
                index: 0,
                item_brand: "Google",
                item_category: "Apparel",
                item_category2: "Adult",
                item_category3: "Shirts",
                item_category4: "Crew",
                item_category5: "Short sleeve",
                item_list_id: "related_products",
                item_list_name: "Related Products",
                item_variant: "green",
                location_id: "L_12345",
                price: 9.99,
                quantity: 1
              }
            ]
          });

          console.log("INIT EVENT 2");
        }

  static catalog = () => {
    if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){
      // this.analytics.track('SDK_getCatalog', {
      //   clientKey: global.user.clientKey,
      //   label: global.user.clientKey,
      // })
    }
  }

  static quote = (_quote:any, _type: any) => {
    if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){
      // this.analytics.track('SDK_getQuote', {
      //   clientKey: global.user.clientKey,
      //   label: global.user.clientKey,
      //   type: _type,
      //   amount : _quote._amount,
      //   period: _quote._period,
      //   currency: _quote._currency,
      //   protocol: _quote._protocol ? _quote._protocol.name : null,
      //   distributorName: _quote._distributorName,
      // })
    }
  }

  static multiBuy = () => {
    if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){
      // this.analytics.track('SDK_Buy_multiple_called', {
      //   clientKey: global.user.clientKey,
      //   label: global.user.clientKey,
      //   distributorName: "Insurace",
      // })
    }
  };

  static buy = (_quote:any) => {

    if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){
      // this.analytics.track('SDK_Buy_called', {
      //   clientKey: global.user.clientKey,
      //   label: global.user.clientKey,
      //   price: _quote.price,
      //   amount: _quote.amount,
      //   period: _quote.period,
      //   currency: _quote.currency,
      //   name: _quote.name,
      //   provider: _quote.distributorName,
      // })
    }
  };

  static onTxHash = (tx:any) => {
    if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){
      // this.analytics.track('SDK_Buy_confirmation', {
      //   clientKey: global.user.clientKey,
      //   label: global.user.clientKey,
      //   hash: tx.hash,
      //   premium: tx.premium,
      //   amount: tx.amount,
      //   period: tx.period,
      //   currency: tx.currency,
      //   name: this.quote.name,
      //   provider: tx.distributor,
      // })
    }
  };

  static onTxConfirmation = (tx:any) => {
    // if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){
    //   this.analytics.track('SDK_Buy_successfull', {
    //     label: global.user.clientKey,
    //     hash: tx,
    //   })
    // }
  };

  static onTxRejected = (tx:any) => {
    // if(NetConfig.isMainNetwork(global.user.networkId) && global.user.googleEventsEnabled ){
    //   this.analytics.track('SDK_Buy_rejected', {
    //     label: global.user.clientKey,
    //     hash: tx,
    //   })
    // }
  };

}

export default GoogleEvents;
