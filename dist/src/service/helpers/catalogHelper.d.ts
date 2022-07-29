declare class CatalogHelper {
    static getLogoUrl(_name: string, _address: string, _distributorName: any): Promise<any>;
    static getSpecialLogoName(_name: string): any;
    static chainLogos(name: string): {
        name: string;
        imgSrc: string;
    };
    static coverFromData(_distributorName: string, _rawData: any): {};
    static quoteFromCoverable(_distributorName: string, _coverable: any, obj: any, stats: object): {
        priceInNXM: any;
        distributorName: string;
        risk_protocol: string;
        name: any;
        logoSrc: any;
        amount: any;
        currency: any;
        period: any;
        chain: any;
        chainId: any;
        chainList: any;
        actualPeriod: any;
        protocol: any;
        price: any;
        priceOrigin: any;
        priceNoMargin: any;
        pricePercentOrigin: any;
        pricePercent: any;
        errorMsg: any;
        cashBackPercent: any;
        cashBack: any;
        rawData: any;
        stats: object;
        type: any;
        typeDescription: any;
        minimumAmount: any;
        uniSwapRouteData: any;
        capacity: any;
        nonPartnerLink: any;
    };
    static createCoverable(obj: any): {
        [x: string]: any;
        bridgeCoverable: any;
        bridgeProductAddress: any;
        bridgeAPY: any;
        nexusCoverable: any;
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
        rawDataNexus: any;
        rawDataBridge: any;
        rawDataInsurace: any;
        rawDataEase: any;
        rawDataUnore: any;
        rawDataUnslashed: any;
        rawDataTidal: any;
        rawDataSolace: any;
    };
    static commonCategory(category: string, provider: string): any;
    static chainList(_distributorName: string, coverable: any): any;
    static descriptionByCategory(category: string): string;
    static trustWalletAssets: any;
    static getTrustWalletAssets(): Promise<object[]>;
    static mergeCoverables(_catalog: any[]): any[];
    static unifyCoverName(_coverName: any, _riskProtocol: any): any;
    static coverableDuplicate(cov1: any, cov2: any): any;
    static availableOnNetwork(networkId: number, module: string): string | false;
}
export default CatalogHelper;
