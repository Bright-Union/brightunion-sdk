import { ethers } from 'ethers'
import { Token , TradeType, CurrencyAmount, Percent } from '@uniswap/sdk-core'
const AlphaRouter = require('@uniswap/smart-order-router')

import NetConfig from '../../service/config/NetConfig'

const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/' +  NetConfig.getInfuraId() );
import {toWei} from "web3-utils";

class UniswapV3Api {

    public  static poolContract:any = null;
    public  static poolContractInited:any = false;
    public  static router:any = false;

    public  static async initUniswapV3() {
      this.router = await new AlphaRouter.AlphaRouter({ chainId: 1, provider: provider }) //web3Provider
      return true;
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
          protocols: ["V3"],
          maxSwapsPerPath: 2,
        }
      )

      let finalPrice = null;
      if(route && route.route[0]){
        finalPrice  = route.route[0].rawQuote.toString();
      }

      return [finalPrice, route];
    }

  }

  export default UniswapV3Api
