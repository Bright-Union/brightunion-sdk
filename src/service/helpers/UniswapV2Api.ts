import {Fetcher, Route, Token, WETH} from '@uniswap/sdk'

class UniswapV2Api {

  public  static priceTokenAtoETH (chainId:any, tokenA:any) {
        const TokenA = new Token(Number(chainId), tokenA, 18);
        const weth:any = WETH;

        return Fetcher.fetchPairData(TokenA, weth[chainId] ).then((pair:any) => {
            const route = new Route( [pair] , weth[chainId] )
            return route.midPrice.toSignificant(6);
        })
    }
  public  static priceETHtoTokenB (chainId:any, tokenB:any) {
        const TokenB = new Token(Number(chainId), tokenB, 18);
        const weth:any = WETH;

        return Fetcher.fetchPairData( TokenB , weth[chainId] ).then((pair:any) => {
            const route = new Route( [pair] , weth[chainId] )
            return route.midPrice.toSignificant(6);
        })
    }

  public  static priceTokenAtoTokenB (chainId:any, tokenA:any, tokenB:any) {
        const TokenA = new Token(Number(chainId), tokenA, 18);
        const TokenB = new Token(Number(chainId), tokenB, 18);

        return Fetcher.fetchPairData(TokenA, TokenB).then((pair:any) => {
          const route = new Route([pair], TokenB)
          return route.midPrice.toSignificant(6);
        })
    }
}

export default UniswapV2Api
