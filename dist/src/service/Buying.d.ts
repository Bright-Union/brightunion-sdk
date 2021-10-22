import BuyReceipt from "./domain/BuyReceipt";
export declare function _buyCoverDecode(_distributorName: string, _products: Array<number>, _durationInDays: Array<number>, _amounts: Array<number>, _currency: string, _premiumAmount: number, _helperParameters: Array<number>, _securityParameters: Array<number>, _v: Array<number>, _r: Array<number>, _s: Array<number>): Promise<BuyReceipt>;
declare const _default: {
    _buyCoverDecode: typeof _buyCoverDecode;
};
export default _default;
