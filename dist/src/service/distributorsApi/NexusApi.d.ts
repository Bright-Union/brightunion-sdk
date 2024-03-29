export default class NexusApi {
    static fetchCoverables(): Promise<unknown>;
    static setNXMBasedquotePrice(priceInNXM: any, quoteCurrency: string): Promise<any[]>;
    static fetchQuote(amount: number, currency: string, period: number, protocol: any): Promise<any>;
    static emptyErrorQuote(quote: any, errorMsg: any): any;
    static fetchCapacity(_productId: any): Promise<any>;
}
