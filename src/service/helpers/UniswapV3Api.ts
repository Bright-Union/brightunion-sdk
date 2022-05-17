import { ethers } from 'ethers'
import { Pool } from '@uniswap/v3-sdk'
import { Token , TradeType, CurrencyAmount } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { abi as QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
const AlphaRouter = require('@uniswap/smart-order-router')

import State from  '../../service/domain/UniswapV3_State'
import Immutables from  '../../service/domain/UniswapV3_Immutables'
import NetConfig from '../../service/config/NetConfig'

const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/' +  NetConfig.getInfuraId() );
// const provider =
const poolAddress = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8' //wrapped Eather vs USD coin
const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider);
const quoterContract = new ethers.Contract(poolAddress, QuoterABI, provider);
// const quoterContract = new ethers.Contract(quoterAddress, QuoterABI, provider);

class UniswapV3Api {

    public  static poolContract:any = null;
    public  static poolContractInited:any = false;
    public  static router:any = false;

    public  static async initUniswapV3() {

      console.log("-> router - initUniswapV3 666" , global.user, provider );

      this.router = await new AlphaRouter.AlphaRouter({ chainId: 1, provider: provider }) //web3Provider

      this.getRoute();

      // const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider)
      // this.poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider );
    }

    public  static async getRoute() {

      console.log("SDK getRoute- " , TradeType, this.router );

      const WETH = new Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether')

      const USDC = new Token( 1 , '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')

      const router = await new AlphaRouter.AlphaRouter({ chainId: 1, provider: provider }) //web3Provider

      const wethAmount = await CurrencyAmount.fromRawAmount( WETH , 3 );

      console.log("SDK 2wethAmount - " , wethAmount);

      const route = await this.router.route(
        wethAmount ,
        USDC,
        TradeType.EXACT_INPUT ,
        undefined,
        undefined
      )

      console.log("SDK getRoute3 - " , route);

    }

    public  static async getPoolImmutables() {

      console.log("poolContract" , poolContract);

      const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
        poolContract.factory(),
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.tickSpacing(),
        poolContract.maxLiquidityPerTick(),
      ])

      const immutables: any = {
        factory,
        token0,
        token1,
        fee,
        tickSpacing,
        maxLiquidityPerTick,
      }
      return immutables
    }

    public  static async getPoolState() {

      console.log("PoolState 1aa" );

      const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()])

      console.log("PoolState 1" , liquidity, slot );

      const PoolState: State = {
        liquidity,
        sqrtPriceX96: slot[0],
        tick: slot[1],
        observationIndex: slot[2],
        observationCardinality: slot[3],
        observationCardinalityNext: slot[4],
        feeProtocol: slot[5],
        unlocked: slot[6],
      }

      console.log("PoolState " , PoolState);

      return PoolState;
    }

    public  static async priceTokenAtoTokenB() {

      const [immutables, state] = await Promise.all([this.getPoolImmutables(), this.getPoolState()])

      const TokenA = new Token(3, immutables.token0, 6, 'USDC', 'USD Coin')

      const TokenB = new Token(3, immutables.token1, 18, 'WETH', 'Wrapped Ether')

      const poolExample = new Pool(
        TokenA,
        TokenB,
        immutables.fee,
        state.sqrtPriceX96.toString(),
        state.liquidity.toString(),
        state.tick
      )

      console.log("poolExample xxx111" , poolExample);

    }

    // public  static async testSpotPrice() {
    //   const amountIn = 1500;
    //   console.log( "V3 priceTokenAtoTokenB 111" );
    //
    //   const immutables:any = await this.getPoolImmutables();
    //
    //   console.log( "xxxxx V3 priceTokenAtoTokenB 111 immutables" , immutables, quoterContract );
    //
    //   const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    //     immutables.token0,
    //     immutables.token1,
    //     immutables.fee,
    //     amountIn.toString(),
    //     0
    //   )
    //
    //   console.log("V3 quotedAmountOut" , quotedAmountOut );
    // }

    // public  static  async  testSpotPrice() {
    //
    //   console.log("V3 priceTokenAtoTokenB")
    //
    //   const [immutables, state] = await Promise.all([this.getPoolImmutables(), this.getPoolState()])
    //
    //   console.log("V3 priceTokenAtoTokenB STATE" , state);
    //   console.log("V3 priceTokenAtoTokenB immutables" , immutables);
    //
    //   const TokenA = new Token(3, immutables.token0, 6, 'USDC', 'USD Coin')
    //   const TokenB = new Token(3, immutables.token1, 18, 'WETH', 'Wrapped Ether')
    //
    //   const poolExample = new Pool(
    //     TokenA,
    //     TokenB,
    //     immutables.fee,
    //     state.sqrtPriceX96.toString(),
    //     state.liquidity.toString(),
    //     state.tick
    //   )
    //
    //   console.log("V3 poolExample" , poolExample);
    //
    //   const DAI_USDC_POOL = new Pool(
    //     TokenA,
    //     TokenB,
    //     immutables.fee,
    //     state.sqrtPriceX96.toString(),
    //     state.liquidity.toString(),
    //     state.tick
    //   )
    //
    //   const token0Price = DAI_USDC_POOL.token0Price
    //   const token1Price = DAI_USDC_POOL.token1Price
    //
    //   console.log("V3 poolExample 22 DAI_USDC_POOL" , DAI_USDC_POOL, token0Price, token1Price );
    // }

  }

  export default UniswapV3Api
