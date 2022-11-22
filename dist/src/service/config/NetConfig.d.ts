declare class NetConfig {
    static getInfuraId(): string;
    static getQuickNodeProvider(): string;
    static createWeb3Provider(provider: any): any;
    static createWeb3Passives(): Promise<{
        account: any;
        networkId: any;
        symbol: string;
        web3Instance: any;
        readOnly: boolean;
    }[]>;
    static NETWORK_CONFIG: ({
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        bridgeRegistry: string;
        bridgeV2Registry: string;
        bridgeV2Distributor: string;
        brightTreasury: string;
        nexusDistributorV1: string;
        nexusDistributor: string;
        nexusAPI: string;
        brightProtocol: string;
        insuraceDistributor: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        easeDistributor: string;
        ETH: string;
        DAI: string;
        USDT: string;
        USDC: string;
        INSUR: string;
        NXM: string;
        WNXM: string;
        WETH: string;
        brightContractRegistry?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
        MATIC?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        nexusAPI: string;
        brightProtocol: string;
        brightContractRegistry: string;
        bridgeV2Distributor: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        modules: string[];
        ETH: string;
        DAI: string;
        USDT: string;
        USDC: string;
        INSUR: string;
        bridgeRegistry?: undefined;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        nexusDistributor?: undefined;
        insuraceDistributor?: undefined;
        easeDistributor?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
        MATIC?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        nexusAPI: string;
        brightProtocol: string;
        brightContractRegistry: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        modules: string[];
        bridgeRegistry: string;
        bridgeV2Registry: string;
        bridgeV2Distributor: string;
        ETH: string;
        DAI: string;
        USDT: string;
        USDC: string;
        INSUR: string;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        nexusDistributor?: undefined;
        insuraceDistributor?: undefined;
        easeDistributor?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
        MATIC?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        nexusDistributor: string;
        nexusAPI: string;
        brightProtocol: string;
        brightContractRegistry: string;
        bridgeV2Distributor: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        ETH: string;
        DAI: string;
        USDT: string;
        USDC: string;
        INSUR: string;
        bridgeRegistry?: undefined;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        insuraceDistributor?: undefined;
        easeDistributor?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
        MATIC?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        bridgeRegistry: string;
        nexusDistributor: string;
        nexusAPI: string;
        brightProtocol: string;
        bridgeV2Distributor: string;
        brightContractRegistry: string;
        insuraceDistributor: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        ETH: string;
        BNB: string;
        BUSD: string;
        USDC: string;
        'BUSD-T': string;
        INSUR: string;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        easeDistributor?: undefined;
        DAI?: undefined;
        USDT?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        MATIC?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        nexusDistributor: string;
        nexusAPI: string;
        brightProtocol: string;
        brightContractRegistry: string;
        bridgeV2Distributor: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        ETH: string;
        BNB: string;
        BUSD: string;
        USDC: string;
        'BUSD-T': string;
        INSUR: string;
        bridgeRegistry?: undefined;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        insuraceDistributor?: undefined;
        easeDistributor?: undefined;
        DAI?: undefined;
        USDT?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        MATIC?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        bridgeRegistry: string;
        nexusDistributor: string;
        nexusAPI: string;
        brightProtocol: string;
        bridgeV2Distributor: string;
        brightContractRegistry: string;
        insuraceDistributor: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        ETH: string;
        MATIC: string;
        DAI: string;
        USDT: string;
        USDC: string;
        INSUR: string;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        easeDistributor?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        nexusDistributor: string;
        nexusAPI: string;
        bridgeV2Distributor: string;
        brightProtocol: string;
        brightContractRegistry: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        ETH: string;
        MATIC: string;
        DAI: string;
        USDT: string;
        USDC: string;
        INSUR: string;
        bridgeRegistry?: undefined;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        insuraceDistributor?: undefined;
        easeDistributor?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        nexusDistributor: string;
        nexusAPI: string;
        brightProtocol: string;
        brightContractRegistry: string;
        bridgeV2Distributor: string;
        insuraceDistributor: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        ETH: string;
        MATIC: string;
        DAIe: string;
        USDTe: string;
        USDCe: string;
        INSUR: string;
        AVAX: string;
        bridgeRegistry?: undefined;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        easeDistributor?: undefined;
        DAI?: undefined;
        USDT?: undefined;
        USDC?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        nexusDistributor: string;
        nexusAPI: string;
        brightProtocol: string;
        bridgeV2Distributor: string;
        brightContractRegistry: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        ETH: string;
        MATIC: string;
        DAIe: string;
        USDTe: string;
        USDCe: string;
        INSUR: string;
        AVAX: string;
        bridgeRegistry?: undefined;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        insuraceDistributor?: undefined;
        easeDistributor?: undefined;
        DAI?: undefined;
        USDT?: undefined;
        USDC?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
    })[];
    static netById(id: any): {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        bridgeRegistry: string;
        bridgeV2Registry: string;
        bridgeV2Distributor: string;
        brightTreasury: string;
        nexusDistributorV1: string;
        nexusDistributor: string;
        nexusAPI: string;
        brightProtocol: string;
        insuraceDistributor: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        easeDistributor: string;
        ETH: string;
        DAI: string;
        USDT: string;
        USDC: string;
        INSUR: string;
        NXM: string;
        WNXM: string;
        WETH: string;
        brightContractRegistry?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
        MATIC?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        nexusAPI: string;
        brightProtocol: string;
        brightContractRegistry: string;
        bridgeV2Distributor: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        modules: string[];
        ETH: string;
        DAI: string;
        USDT: string;
        USDC: string;
        INSUR: string;
        bridgeRegistry?: undefined;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        nexusDistributor?: undefined;
        insuraceDistributor?: undefined;
        easeDistributor?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
        MATIC?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        nexusAPI: string;
        brightProtocol: string;
        brightContractRegistry: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        modules: string[];
        bridgeRegistry: string;
        bridgeV2Registry: string;
        bridgeV2Distributor: string;
        ETH: string;
        DAI: string;
        USDT: string;
        USDC: string;
        INSUR: string;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        nexusDistributor?: undefined;
        insuraceDistributor?: undefined;
        easeDistributor?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
        MATIC?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        nexusDistributor: string;
        nexusAPI: string;
        brightProtocol: string;
        brightContractRegistry: string;
        bridgeV2Distributor: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        ETH: string;
        DAI: string;
        USDT: string;
        USDC: string;
        INSUR: string;
        bridgeRegistry?: undefined;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        insuraceDistributor?: undefined;
        easeDistributor?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
        MATIC?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        bridgeRegistry: string;
        nexusDistributor: string;
        nexusAPI: string;
        brightProtocol: string;
        bridgeV2Distributor: string;
        brightContractRegistry: string;
        insuraceDistributor: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        ETH: string;
        BNB: string;
        BUSD: string;
        USDC: string;
        'BUSD-T': string;
        INSUR: string;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        easeDistributor?: undefined;
        DAI?: undefined;
        USDT?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        MATIC?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        nexusDistributor: string;
        nexusAPI: string;
        brightProtocol: string;
        brightContractRegistry: string;
        bridgeV2Distributor: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        ETH: string;
        BNB: string;
        BUSD: string;
        USDC: string;
        'BUSD-T': string;
        INSUR: string;
        bridgeRegistry?: undefined;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        insuraceDistributor?: undefined;
        easeDistributor?: undefined;
        DAI?: undefined;
        USDT?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        MATIC?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        bridgeRegistry: string;
        nexusDistributor: string;
        nexusAPI: string;
        brightProtocol: string;
        bridgeV2Distributor: string;
        brightContractRegistry: string;
        insuraceDistributor: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        ETH: string;
        MATIC: string;
        DAI: string;
        USDT: string;
        USDC: string;
        INSUR: string;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        easeDistributor?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        nexusDistributor: string;
        nexusAPI: string;
        bridgeV2Distributor: string;
        brightProtocol: string;
        brightContractRegistry: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        ETH: string;
        MATIC: string;
        DAI: string;
        USDT: string;
        USDC: string;
        INSUR: string;
        bridgeRegistry?: undefined;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        insuraceDistributor?: undefined;
        easeDistributor?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
        DAIe?: undefined;
        USDTe?: undefined;
        USDCe?: undefined;
        AVAX?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        nexusDistributor: string;
        nexusAPI: string;
        brightProtocol: string;
        brightContractRegistry: string;
        bridgeV2Distributor: string;
        insuraceDistributor: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        ETH: string;
        MATIC: string;
        DAIe: string;
        USDTe: string;
        USDCe: string;
        INSUR: string;
        AVAX: string;
        bridgeRegistry?: undefined;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        easeDistributor?: undefined;
        DAI?: undefined;
        USDT?: undefined;
        USDC?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
    } | {
        name: string;
        id: number;
        symbol: string;
        defaultCurrency: string;
        explorer: string;
        provider: string;
        modules: string[];
        nexusDistributor: string;
        nexusAPI: string;
        brightProtocol: string;
        bridgeV2Distributor: string;
        brightContractRegistry: string;
        insuraceCover: string;
        insuraceAPI: string;
        insuraceAPIKey: string;
        insuraceReferral: string;
        ETH: string;
        MATIC: string;
        DAIe: string;
        USDTe: string;
        USDCe: string;
        INSUR: string;
        AVAX: string;
        bridgeRegistry?: undefined;
        bridgeV2Registry?: undefined;
        brightTreasury?: undefined;
        nexusDistributorV1?: undefined;
        insuraceDistributor?: undefined;
        easeDistributor?: undefined;
        DAI?: undefined;
        USDT?: undefined;
        USDC?: undefined;
        NXM?: undefined;
        WNXM?: undefined;
        WETH?: undefined;
        BNB?: undefined;
        BUSD?: undefined;
        'BUSD-T'?: undefined;
    };
    static isMainNetwork(net: number): boolean;
    static mainNets(): number[];
    static testNets(): number[];
    static networkCurrency(id: any): any;
    isNetworkCurrencyByAddress(address: any): boolean;
    static requiresAllowanceReset(networkId: any, symbol: any): boolean;
    static sixDecimalsCurrency(networkId: any, symbol: any): any;
    static isNetworkCurrencyBySymbol(asset: any): boolean;
    static getETHNetwork(): any;
    static isSupportedNetwork(_netId: any): boolean;
}
export default NetConfig;
