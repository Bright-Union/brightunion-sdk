import { ethers } from 'ethers'
import { Token , TradeType, CurrencyAmount, Percent } from '@uniswap/sdk-core'
const AlphaRouter = require('@uniswap/smart-order-router')
import JSBI from 'jsbi';

import NetConfig from '../../service/config/NetConfig'

// const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/' +  NetConfig.getInfuraId() );
// const provider = new ethers.providers.JsonRpcProvider( NetConfig.getQuickNodeProvider() );
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

    public  static async getNXMPriceFor(_currency:any, _amountOfNXM: number) {

      // const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/' +  NetConfig.getInfuraId() );
      // const provider = new ethers.providers.JsonRpcProvider( NetConfig.getQuickNodeProvider() );
      // const router = await new AlphaRouter.AlphaRouter({ chainId: 1, provider: provider }) //web3Provider

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

      console.log("currencyIn SDK _amountOfNXM - " , currencyIn, _currency, _amountOfNXM.toString());

      const nxmAmoutInWei = toWei( _amountOfNXM.toString() ).split('.')[0];
      const amountNXMOut = CurrencyAmount.fromRawAmount( WNXM , nxmAmoutInWei );

      const route = await this.router.route(
        amountNXMOut,
        currencyIn,
        TradeType.EXACT_OUTPUT,
        undefined,
        // {
        //   slippageTolerance: new Percent(5, 1000), // 0.5%
        // },
        // undefined,
        {
          // protocols: ["V3"],
          // maxSwapsPerPath: 4,
        }
      )
      // .then(
      //   (res:any) => {console.log("res SDK - " , res ); return res;} ,
      //   (error:any) => { console.log("error SDK" , typeof error , error ) } );

        // console.log('route - ' , route );

        


      if(route){
        console.log( "rawQuote SDK" , route.route[0]  );
        if(route.route[1]){
          console.log( "rawQuote2 SDK" ,  route.route[1] );
        }
      }

      let finalPrice = null;
      if(route && route.route[0]){
        finalPrice  = route.route[0].rawQuote.toString();
      }

      return [finalPrice, route];
    }

  }

  export default UniswapV3Api
