export declare function buyQuote(_quoteProtocol: any): Promise<any>;
export declare function buyMultipleQuotes(_quotes: any): Promise<any>;
export declare function buyMutipleOnInsurace(_quotes: any): Promise<any>;
export declare function buyOnInsurace(_quoteProtocol: any): Promise<any>;
export declare function callInsurace(buyingObj: any, buyingWithNetworkCurrency: boolean, _quote: any): Promise<any>;
export declare function callNexus(_quoteProtocol: any, buyingWithNetworkCurrency: boolean): Promise<unknown>;
export declare function buyOnNexus(_quoteProtocol: any): Promise<any>;
export declare function callBridgeV2(_quoteProtocol: any): Promise<any>;
export declare function buyOnBridgeV2(_quoteProtocol: any): Promise<any>;
export declare function buyOnEase(_quoteProtocol: any): Promise<any>;
export declare function callEase(_quoteProtocol: any, buyingWithNetworkCurrency: boolean): Promise<any>;
export declare function callUnoRe(_quoteProtocol: any, buyingWithNetworkCurrency: boolean): Promise<void>;
export declare function buyOnUnoRe(_quoteProtocol: any): Promise<any>;
declare const _default: {
    buyQuote: typeof buyQuote;
    buyMultipleQuotes: typeof buyMultipleQuotes;
};
export default _default;
