import { ethers } from 'ethers'
import { Token , TradeType, CurrencyAmount, Percent } from '@uniswap/sdk-core'
const AlphaRouter = require('@uniswap/smart-order-router')

import NetConfig from '../../service/config/NetConfig'

import {toWei} from "web3-utils";

class UniswapV3Api {

    public  static poolContract:any = null;
    public  static poolContractInited:any = false;
    public  static router:any = false;

    public  static async initUniswapV3() {
      const provider = new ethers.providers.JsonRpcProvider( NetConfig.getQuickNodeProvider() );
      this.router = await new AlphaRouter.AlphaRouter({ chainId: 1, provider: provider }) //web3Provider
      return true;
    }

    public static chooseRouteAndSetPrice(_routeData: any) {
      // "0x0000000000000000000000000000000000000000",
      let routeDataFormated:any = {
        swapVia: [],
        poolFees: [],
        protocol: null,
      }

      let amountIn = null;

      if(_routeData && _routeData.route && _routeData.route[0] ){

        let routeChosen = _routeData.route[0];

        routeDataFormated.protocol = routeChosen.protocol;

        for (var i = 1; i < routeChosen.tokenPath.length - 1; i++) {
          routeDataFormated.swapVia.push( routeChosen.tokenPath[i].address );
        }

        if(  routeChosen.protocol == "V3" ){
          const pools = routeChosen.route.pools;
          for (var i = 0; i < pools.length; i++) {
            routeDataFormated.poolFees.push(pools[i].fee);
          }
        }

        amountIn  = routeChosen.rawQuote.toString();
      }

      if(routeDataFormated.swapVia.length == 0) routeDataFormated.swapVia.push("0x0000000000000000000000000000000000000000");
      if(routeDataFormated.poolFees.length == 0) routeDataFormated.poolFees.push(0);

      return [amountIn, routeDataFormated];
    }


    public  static async getNXMPriceFor(_currency:any, _amountOfNXM: number) {

      const WETH = new Token( 1 , NetConfig.netById(1).WETH, 18, 'WETH', 'Wrapped Ether')
      const DAI = new Token( 1 , NetConfig.netById(1).DAI, 18, 'DAI', 'DAI')
      const WNXM = new Token( 1 , NetConfig.netById(1).WNXM , 18, 'WNXM', 'Wrapped NXM');

      let currencyIn:any = null;
      if(_currency == "ETH"){
        currencyIn = WETH;
      }
      else if(_currency == "DAI") {
        currencyIn = DAI;
      }else{
        global.sentry.captureException({error: "wrong quote currency"});
        return {error: "wrong quote currency"};
      }

      const nxmAmoutInWei = toWei( _amountOfNXM.toString() ).split('.')[0];
      const amountWNXMOut = CurrencyAmount.fromRawAmount( WNXM , nxmAmoutInWei );

      const route = await this.router.route(
        amountWNXMOut,
        currencyIn,
        TradeType.EXACT_OUTPUT,
        {
          slippageTolerance: new Percent(5, 1000), // 0.5%
        },
        {
          maxSwapsPerPath: 5,
          distributionPercent: 100,
          // protocols:['V2']
        }
      ).then(
        (res:any) => { return res;} ,
        (error:any) => { return error }
      );

      if(!route){
        return [null, null];
      }else{
        const [ amountIn, routeDataFormated ] = this.chooseRouteAndSetPrice(route);
        return [amountIn, routeDataFormated];
      }

    }

  }

  export default UniswapV3Api
