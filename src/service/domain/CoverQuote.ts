export interface CoverQuote {
    _sumAssured      ? : number;
    _coverPeriod     ? : number;
    _contractAddress ? : number;
    _coverAsset      ? : number;
    _amountInWei     ? : number;
    _epochs          ? : number;
    _prodAddress     ? : number;
}
export interface CoverQuoteArray {
    [index:number] : CoverQuote;
}