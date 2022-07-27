declare class ExchangeRateHelper {
    static fetchExchangeRate(currency: string): Promise<number>;
}
export default ExchangeRateHelper;
