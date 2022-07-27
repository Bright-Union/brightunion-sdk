export default class SolaceSDK {
    static getCoverables(): Promise<any>;
    static fetchQuote(amount: number, currency: string, period: number, protocol: any): Promise<any[] | {
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
    }>;
}
