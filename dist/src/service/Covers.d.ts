import Cover from "./domain/Cover";
import BuyReceipt from "./domain/BuyReceipt";
export declare function getCoversCount(_web3: any, _distributorName: string, _owner: string, _isActive: boolean): Promise<number>;
export declare function _getDistributorAddress(_distributorName: string): Promise<string>;
export declare function getCovers(_distributorName: string, _ownerAddress: string, _activeCover: boolean, _limit: number, _web3: any): Promise<Cover[]>;
export declare function _buyCover(_distributorName: string, _contractAddress: string, _coverAsset: string, _sumAssured: number, _coverPeriod: number, _coverType: number, _maxPriceWithFee: number, _data: any): Promise<BuyReceipt>;
declare const _default: {
    getCovers: typeof getCovers;
    getCoversCount: typeof getCoversCount;
};
export default _default;
