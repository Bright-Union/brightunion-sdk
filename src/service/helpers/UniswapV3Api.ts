import { ethers } from 'ethers'
import { Token , TradeType, CurrencyAmount, Percent } from '@uniswap/sdk-core'
const AlphaRouter = require('@uniswap/smart-order-router')
import JSBI from 'jsbi';

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

      let routeDataFormated = {
        swapVia: "0x0000000000000000000000000000000000000000",
        swapVia2: "0x0000000000000000000000000000000000000000",
        poolFeeA: 0,
        poolFeeB: 0,
        poolFeeC: 0,
        protocol: 'V3',
      }

      let amountIn = null;

      console.log("pure Uni Output Rout Data 0 " , _routeData);

      if(_routeData && _routeData.route && _routeData.route[0] ){

        let routeChosen =  _routeData.route[0];

        for (var i = 0; i < _routeData.route.length; i++) {
          if(  _routeData.route[i].protocol == "V3" ){
            routeChosen =  _routeData.route[i];
          }
        }

        routeDataFormated.swapVia = routeChosen.tokenPath.length > 2 ? routeChosen.tokenPath[1].address : "0x0000000000000000000000000000000000000000";
        routeDataFormated.swapVia2 = routeChosen.tokenPath.length > 3 ? routeChosen.tokenPath[2].address : "0x0000000000000000000000000000000000000000";
        routeDataFormated.protocol = routeChosen.protocol;
        if(routeChosen && routeChosen.protocol == "V3"){
          const pools = routeChosen.route.pools;
          routeDataFormated.poolFeeA = pools[0].fee;
          routeDataFormated.poolFeeB = pools[1] ? pools[1].fee : 0;
          routeDataFormated.poolFeeC = pools[2] ? pools[2].fee : 0;
        }

        amountIn  = routeChosen.rawQuote.toString();
      }

      return [amountIn, routeDataFormated];
    }


    public  static async getNXMPriceFor(_currency:any, _amountOfNXM: number) {

      const WETH = new Token( 1 , NetConfig.netById(1).WETH, 18, 'WETH', 'Wrapped Ether')
      const DAI = new Token( 1 , NetConfig.netById(1).DAI, 6, 'DAI', 'DAI')
      const WNXM = new Token( 1 , NetConfig.netById(1).WNXM , 6, 'WNXM', 'Wrapped NXM');

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
      const amountNXMOut = CurrencyAmount.fromRawAmount( WNXM , nxmAmoutInWei );

      const route = await this.router.route(
        amountNXMOut,
        currencyIn,
        TradeType.EXACT_OUTPUT,
        {
          slippageTolerance: new Percent(5, 1000), // 0.5%
        },
        {
          maxSwapsPerPath: 4,
        }
      ).then(
        (res:any) => { return res;} ,
        (error:any) => { return error }
      );

      const [ amountIn, routeDataFormated ] = this.chooseRouteAndSetPrice(route);

      return [amountIn, routeDataFormated];
    }

  }

  export default UniswapV3Api
