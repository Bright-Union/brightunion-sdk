export declare function getCatalog(): Promise<any>;
export declare function getBridgeV2Coverables(): Promise<any[]>;
export declare function getNexusCoverables(): Promise<any[]>;
export declare function getInsuraceCoverables(netId: string | number): Promise<object[]>;
export declare function getEaseCoverables(): Promise<any>;
export declare function getUnslashedCoverables(): Promise<any>;
export declare function getUnoReCoverables(): Promise<any>;
export declare function getTidalCoverables(): Promise<any>;
export declare function getSolaceCoverables(): Promise<any>;
declare const _default: {
    getCatalog: typeof getCatalog;
};
export default _default;
