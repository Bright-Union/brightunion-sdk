declare class UniswapV3Api {
    static poolContract: any;
    static poolContractInited: any;
    static router: any;
    static initUniswapV3(): Promise<boolean>;
    static chooseRouteAndSetPrice(_routeData: any): any[];
    static getNXMPriceFor(_currency: any, _amountOfNXM: number): Promise<any[] | {
        error: string;
    }>;
}
export default UniswapV3Api;
