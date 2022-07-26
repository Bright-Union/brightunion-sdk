export declare function getCoversFrom(_distributorName: string): Promise<any>;
export declare function getAllCovers(): Promise<any>;
export declare function getBridgeCovers(): Promise<any[]>;
export declare function getNexusCovers(): Promise<any[]>;
export declare function getEaseCovers(): Promise<any[]>;
export declare function getUnslashedCovers(): Promise<any[]>;
export declare function getUnoReCovers(): Promise<any[]>;
export declare function getInsuraceCovers(_web3: any): Promise<any[]>;
export declare function getAllCoversCount(): Promise<any>;
declare const _default: {
    getAllCovers: typeof getAllCovers;
    getAllCoversCount: typeof getAllCoversCount;
    getCoversFrom: typeof getCoversFrom;
};
export default _default;
