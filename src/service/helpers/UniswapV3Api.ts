import { ethers } from 'ethers'
import { Pool } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { abi as QuoterABI } from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'

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

    public  static async initPoolContract() {
      // const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider)
      this.poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider );
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
      const [liquidity, slot] = await Promise.all([this.poolContract.liquidity(), this.poolContract.slot0()])

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

      return PoolState;
    }

    public  static async priceTokenAtoTokenB() {
      const amountIn = 1500;
      console.log( "V3 priceTokenAtoTokenB 111" );

      const immutables:any = await this.getPoolImmutables();

      console.log( "xxxxx V3 priceTokenAtoTokenB 111 immutables" , immutables );

      const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
        immutables.token0,
        immutables.token1,
        immutables.fee,
        amountIn.toString(),
        0
      )

      console.log("V3 quotedAmountOut" , quotedAmountOut );
    }

    // public  static  async  priceTokenAtoTokenB() {
    //   console.log("V3 priceTokenAtoTokenB");
    //   const [immutables, state] = await Promise.all([this.getPoolImmutables(), this.getPoolState()])
    //   const TokenA = new Token(3, immutables.token0, 6, 'USDC', 'USD Coin')
    //   const TokenB = new Token(3, immutables.token1, 18, 'WETH', 'Wrapped Ether')
    //   const poolExample = new Pool(
    //     TokenA,
    //     TokenB,
    //     immutables.fee,
    //     state.sqrtPriceX96.toString(),
    //     state.liquidity.toString(),
    //     state.tick
    //   )
    //   console.log("V3 poolExample" , poolExample)
    // }

  }

  export default UniswapV3Api
