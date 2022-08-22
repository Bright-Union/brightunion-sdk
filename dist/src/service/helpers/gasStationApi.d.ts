export default class GasStationApi {
    static fetchEthereumGasPrice(): Promise<any>;
    static fetchMaticGasPrice(): Promise<unknown>;
    static fetchBSCGasPrice(): Promise<unknown>;
    static fetchAvalancheGasPrice(): Promise<any>;
    static fetchGasPrice(symbol: any): Promise<{
        rapid: any;
        fast: any;
        standard: any;
        slow: any;
    }>;
}
