declare class UniswapV2Api {
    static priceTokenAtoETH(chainId: any, tokenA: any): Promise<string>;
    static priceETHtoTokenB(chainId: any, tokenB: any): Promise<string>;
    static priceTokenAtoTokenB(chainId: any, tokenA: any, tokenB: any): Promise<string>;
}
export default UniswapV2Api;
