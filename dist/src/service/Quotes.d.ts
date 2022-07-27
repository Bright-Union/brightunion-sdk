export declare function getQuotes(_amount: number, _currency: string, _period: number, _protocol: any): Promise<any[]>;
export declare function getQuoteFrom(_distributorName: string, _amount: number, _currency: string, _period: number, _protocol: any, _net: any): Promise<object>;
export declare function getNexusQuote(_amount: any, _currency: any, _period: any, _protocol: any): Promise<object>;
export declare function getInsuraceQuote(_web3: any, _amount: any, _currency: any, _period: any, _protocol: any): Promise<object>;
export declare function getInsuraceQuotes(_arrayOfQuotes: any): Promise<object>;
export declare function getEaseQuote(_amount: any, _currency: any, _period: any, _protocol: any): Promise<object>;
export declare function getUnslashedQuote(_amount: any, _currency: any, _period: any, _protocol: any): Promise<object>;
export declare function getUnoReQuote(_amount: any, _currency: any, _period: any, _protocol: any): Promise<object>;
export declare function getTidalQuote(_amount: any, _currency: any, _period: any, _protocol: any): Promise<object>;
export declare function getSolaceQuote(_amount: any, _currency: any, _period: any, _protocol: any): Promise<object>;
declare const _default: {
    getQuoteFrom: typeof getQuoteFrom;
    getInsuraceQuotes: typeof getInsuraceQuotes;
};
export default _default;
