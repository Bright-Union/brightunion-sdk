export default class UnoReAPI {
    static fetchCoverables(): Promise<unknown>;
    static fetchUSDCPrice(): Promise<unknown>;
    static fetchCoverPrice(cover: any, amount: number, period: number, usdcPrice: number): Promise<unknown>;
    static fetchQuote(amount: number, currency: string, period: number, protocol: any): Promise<{
        status: any;
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
    static fetchCovers(): any;
}
