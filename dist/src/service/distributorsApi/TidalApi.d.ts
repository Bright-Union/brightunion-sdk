export default class TidalApi {
    static fetchCoverables(): Promise<unknown>;
    static fetchQuote(amount: number, currency: string, period: number, protocol: any): Promise<any>;
}
