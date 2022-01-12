import Analytics from 'analytics'
// declare module '*';
// @ts-ignore
import googleAnalytics from '@analytics/google-analytics'
import NetConfig from './NetConfig'

// const googleAnalytics = require('@analytics/google-analytics');

class GoogleEvents {

  static app_id = 'UA-189970983-1';

  static analytics = Analytics({
    app: 'BrightClient_SDK',
    plugins: [
      googleAnalytics({
        trackingId: this.app_id,
      })
    ]
  })

  static onBUInit = () => {
    if(NetConfig.isMainNetwork(global.user.networkId)){
      this.analytics.track('SDK_init' , {
        clientKey: global.user.clientKey,
        label: global.user.clientKey,
      })
    }
  }

  static catalog = () => {
    if(NetConfig.isMainNetwork(global.user.networkId)){
      this.analytics.track('SDK_getCatalog', {
        clientKey: global.user.clientKey,
        label: global.user.clientKey,
      })
    }
  }

  static quote = (_quote:any, _type: any) => {
    if(NetConfig.isMainNetwork(global.user.networkId)){
      this.analytics.track('SDK_getQuote', {
        clientKey: global.user.clientKey,
        label: global.user.clientKey,
        type: _type,
        amount : _quote._amount,
        period: _quote._period,
        currency: _quote._currency,
        protocol: _quote._protocol ? _quote._protocol.name : null,
        distributorName: _quote._distributorName,
      })
    }
  }

  static multiBuy = () => {
    if(NetConfig.isMainNetwork(global.user.networkId)){
      this.analytics.track('SDK_Buy_multiple_called', {
        clientKey: global.user.clientKey,
        label: global.user.clientKey,
        distributorName: "Insurace",
      })
    }
  };

  static buy = (_quote:any) => {

    if(NetConfig.isMainNetwork(global.user.networkId)){
      this.analytics.track('SDK_Buy_called', {
        clientKey: global.user.clientKey,
        label: global.user.clientKey,
        price: _quote.price,
        amount: _quote.amount,
        period: _quote.period,
        currency: _quote.currency,
        name: _quote.name,
        provider: _quote.distributorName,
      })
    }
  };

  static onTxHash = (tx:any) => {
    if(NetConfig.isMainNetwork(global.user.networkId)){
      this.analytics.track('SDK_Buy_confirmation', {
        clientKey: global.user.clientKey,
        label: global.user.clientKey,
        hash: tx.hash,
        premium: tx.premium,
        amount: tx.amount,
        period: tx.period,
        currency: tx.currency,
        name: this.quote.name,
        provider: tx.distributor,
      })
    }
  };

  static onTxConfirmation = (tx:any) => {
    if(NetConfig.isMainNetwork(global.user.networkId)){
      this.analytics.track('SDK_Buy_successfull', {
        label: global.user.clientKey,
        hash: tx,
      })
    }
  };

  static onTxRejected = (tx:any) => {
    if(NetConfig.isMainNetwork(global.user.networkId)){
      this.analytics.track('SDK_Buy_rejected', {
        label: global.user.clientKey,
        hash: tx,
      })
    }
  };

  // static onTxHash = (tx:any) => {
  //   // axios.post(
  //   //   `https://analytics.google.com/g/collect?
  //   //   v=2&t=transaction&
  //   //   tid=${app_id}&
  //   //   cid=${tx.hash}&
  //   //   ds=${data_source}&
  //   //   ip=${tx.premium}&
  //   //   ic=${tx.productId}&
  //   //   iq=${tx.amount}&
  //   //   in=${tx.period}&
  //   //   iv=${tx.currency}`
  //   // ).then((response:any) => {
  //   //   return response;
  //   // }).catch(error =>{
  //   //   return error;
  //   // });
  // };
  //
  // static onTxConfirmation = (tx:any) => {
  //   // axios.post(
  //   //   `https://analytics.google.com/g/collect?
  //   //   v=2&t=transaction&
  //   //   tid=${app_id}&
  //   //   cid=${tx}&
  //   //   ds=${data_source}&
  //   //   iv='TX_CONFIRMED'`
  //   // ).then((response:any) => {
  //   //   return response;
  //   // }).catch(error =>{
  //   //   return error;
  //   // });
  // };



}

export default GoogleEvents;
