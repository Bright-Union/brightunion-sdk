import { ethers } from 'ethers'
// import { Pool } from '@uniswap/v3-sdk'
import { Token , TradeType, CurrencyAmount } from '@uniswap/sdk-core'
// import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
// import { abi as QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
const AlphaRouter = require('@uniswap/smart-order-router')

// import State from  '../../service/domain/UniswapV3_State'
// import Immutables from  '../../service/domain/UniswapV3_Immutables'
import NetConfig from '../../service/config/NetConfig'

const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/' +  NetConfig.getInfuraId() );
// const provider =
const poolAddress = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8' //wrapped Eather vs USD coin
// const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider);
// const quoterContract = new ethers.Contract(poolAddress, QuoterABI, provider);
import {toWei, fromWei} from "web3-utils";

// const quoterContract = new ethers.Contract(quoterAddress, QuoterABI, provider);

class UniswapV3Api {

    public  static poolContract:any = null;
    public  static poolContractInited:any = false;
    public  static router:any = false;

    public  static async initUniswapV3() {
      this.router = await new AlphaRouter.AlphaRouter({ chainId: 1, provider: provider }) //web3Provider
      return true;
    }

    public  static async getNXMPriceFor(_currency:any, _amountOfNXM: number) {

      console.log("getNXMPriceFor" , _currency , _amountOfNXM ,  typeof _amountOfNXM );

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

      console.log("currencyIn 1111 20.123" , currencyIn, typeof _amountOfNXM);

      const amountNXMOut = CurrencyAmount.fromRawAmount( WNXM , toWei(_amountOfNXM.toString()) );

      console.log("wethAmountOut" , amountNXMOut);

      const route = await this.router.route(
        amountNXMOut,
        currencyIn,
        TradeType.EXACT_OUTPUT,
        undefined,
        { protocols: ["V3"] }
      )

      console.log("SDK getRoute3 - " , route);

      let finalPrice = null;
      if(route && route.route[0]){
        finalPrice  = fromWei(route.route[0].rawQuote.toString());
      }

      console.log("SDK getRoute3 - " , finalPrice);

      return finalPrice;

    }

  }

  export default UniswapV3Api
