declare class BridgeHelper {
    static catalogDataFormat(_stats: any, _policyBooksArr: any): Promise<{
        [x: string]: any;
        bridgeCoverable: any;
        bridgeProductAddress: any;
        nexusProductId: any;
        coingecko: any;
        productId: any;
        stats: any;
        source: any;
        protocolAddress: any;
        logo: any;
        name: any;
        type: any;
        typeDescription: any;
        availableCounter: number;
        typeList: any;
        chainListInsurace: any;
        chainListNexus: any;
        chainListUnore: any;
        chainListSolace: any;
        chainListTidal: any;
        rawDataBridge: any;
        rawDataInsurace: any;
        rawDataEase: any;
        rawDataUnore: any;
        rawDataUnslashed: any;
        rawDataTidal: any;
        rawDataSolace: any;
    }[]>;
    static preQuoteDataFormat(_amount: any, _currency: any, _period: any): {
        amountInWei: any;
        currency: any;
        bridgeEpochs: number;
        initialBridgeCurrency: any;
    };
}
export default BridgeHelper;
