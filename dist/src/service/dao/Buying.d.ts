export declare function buyCoverBridge(_ownerAddress: string, _distributorName: string, _contractAddress: string, _coverAsset: string, _sumAssured: number, _coverPeriod: number, _coverType: any, _maxPriceWithFee: number, _data: any, buyingWithNetworkCurrency: boolean, _quoteProtocol: any): Promise<any>;
export declare function buyCoverEase(_ownerAddress: string, _contractAddress: string, _coverAsset: string, _sumAssured: number, _coverPeriod: number, _coverType: any, _maxPriceWithFee: number, _data: any, _quoteProtocol: any): Promise<any>;
export declare function buyCoverNexus(_ownerAddress: string, _distributorName: string, _contractAddress: string, _coverAsset: string, _sumAssured: number, _amountOut: number, _priceWithSlippage: number, _coverPeriod: number, _coverType: any, _maxPriceWithFee: number, buyingWithNetworkCurrency: boolean, _quoteProtocol: any): Promise<unknown>;
export declare function buyCoverInsurace(buyingObj: any, buyingWithNetworkCurrency: boolean, _quotes: any): Promise<unknown>;
declare const _default: {
    buyCoverBridge: typeof buyCoverBridge;
    buyCoverInsurace: typeof buyCoverInsurace;
    buyCoverNexus: typeof buyCoverNexus;
    buyCoverEase: typeof buyCoverEase;
};
export default _default;
