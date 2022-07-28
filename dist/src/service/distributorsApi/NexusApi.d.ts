export default class NexusApi {
    static fetchCoverables(): Promise<unknown>;
    static setNXMBasedquotePrice(priceInNXM: any, quoteCurrency: string, fee: any): Promise<any[]>;
    static fetchQuote(amount: number, currency: string, period: number, protocol: any): Promise<any>;
    static fetchCapacity(_protocol: any): Promise<unknown>;
    static checkNexusCapacity(currency: any, amount: any, capacityETH: any, capacityDAI: any): {
        message: string;
        capacity: string;
        currency: string;
        errorType: string;
    };
}
