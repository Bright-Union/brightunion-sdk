export declare function getCoversCount(_distributorName: string, _ownerAddress: string, _isActive: boolean): Promise<number>;
export declare function getCovers(_web3: any, _distributorName: string, _ownerAddress: string, _activeCover: boolean, _limit: number): Promise<any[]>;
export declare function getCoversNexus(): Promise<any>;
export declare function getCoversInsurace(_web3: any): Promise<any>;
export declare function getCoversBridgeV2(): Promise<any>;
export declare function getCoversCountBridge(): Promise<any>;
export declare function getCoversEase(): Promise<any>;
export declare function getCoversUnslashed(): Promise<any>;
export declare function getCoversUnoRe(): Promise<any>;
declare const _default: {
    getCovers: typeof getCovers;
    getCoversCount: typeof getCoversCount;
};
export default _default;
