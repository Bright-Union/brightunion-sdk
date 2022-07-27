declare class CurrencyHelper {
    static eth_dai: string;
    static insur_usdc: any;
    static eth_nxm: any;
    static dai_nxm: any;
    static getInsureUSDCPrice(_networkId: any): Promise<unknown>;
    static getETHDAIPrice(_networkId: any): Promise<unknown>;
    static eth2usd(eth: any): string;
    static usd2eth(dai: any): string;
    static insurPrice(): number;
}
export default CurrencyHelper;
