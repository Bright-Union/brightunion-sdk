declare class InsuraceApi {
    static fetchCoverables(netId: any): Promise<object>;
    static getCurrencyList(_networkId: any): Promise<any>;
    static getCoverPremium(web3: any, amount: any, currency: any, period: any, protocolId: any, owner: any, protocolType: any, coveredID: any): Promise<any>;
    static getMultipleCoverPremiums(web3: any, amounts: any[], currency: any, periods: any[], protocolIds: any[]): Promise<any>;
    static confirmCoverPremium(chainSymbol: any, params: any): Promise<any>;
    static formatQuoteDataforInsurace(amount: any, currencyName: any, web3: any, protocol: any): Promise<{
        error: string;
        amountInWei?: undefined;
        currency?: undefined;
        selectedCurrency?: undefined;
    } | {
        amountInWei: any;
        currency: any;
        selectedCurrency: any;
        error?: undefined;
    }>;
    static insuraceDePegCurrency(protocol: any, currency: any, web3Symbol: any): any;
    static formatCapacity(_currency: any, _quoteCapacity: any, _chain: any): any;
    static fetchInsuraceQuote(web3: any, amount: string | number, currency: string, period: number, protocol: any, owner: any): Promise<object>;
}
export default InsuraceApi;
