import User from './service/domain/User';
declare global {
    var user: User;
    var events: any;
    var sentry: any;
}
declare class BrightClient {
    catalog: object[];
    catalogUnsorted: object[];
    initialized: boolean;
    events: any;
    version: any;
    constructor(_config: any);
    initialize(_account: string): Promise<object>;
    initErrorResponse(): {
        error: string;
    };
    notSupportedNetMessage(): {
        message: string;
        user: User;
        error: string;
    };
    getVersion(): any;
    getCatalog(): Promise<{
        error: string;
    } | {
        items: any;
        version: string;
    }>;
    getDistributorAddress(_distributorName: string): Promise<string>;
    getCoversFrom(_distributorName: string): Promise<any>;
    getAllCovers(): Promise<any>;
    getQuotes(_amount: number, _currency: string, _period: number, _protocol: any): Promise<any[] | {
        error: string;
    }>;
    getQuoteFrom(_distributorName: string, _amount: number, _currency: string, _period: number, _protocol: any, _owner: string): Promise<any>;
    getMultipleQuotes(_arrayOfQuotes: any): Promise<object>;
    buyQuote(_quote: any): Promise<any>;
    buyQuotes(_quotes: any[]): Promise<any>;
}
export default BrightClient;
