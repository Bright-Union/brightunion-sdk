export declare function getQuote(_distributorName: string, _period: any, _sumAssured: any, _contractAddress: string, _interfaceCompliant1: string, _interfaceCompliant2: string, _data: any): Promise<any>;
export declare function getQuoteFromBridgeV2(_protocol: any, _period: any, _bridgeEpochs: any, _amountInWei: any, _currency: string, _initialBridgeCurrency: any): Promise<any>;
declare const _default: {
    getQuote: typeof getQuote;
    getQuoteFromBridgeV2: typeof getQuoteFromBridgeV2;
};
export default _default;
