export declare function getCoversCount(_distributorName: string, _owner: string, _isActive: boolean): void;
export declare function _getDistributorAddress(): Promise<object>;
export declare function getCoversFrom(web3: object, distributorName: string): Promise<object>;
export declare function _getQuote(): Promise<object>;
export declare function _buyCover(): Promise<object>;
export declare function _buyCoverDecode(): Promise<object>;
declare const _default: {
    getCoversFrom: typeof getCoversFrom;
    getCoversCount: typeof getCoversCount;
};
export default _default;
