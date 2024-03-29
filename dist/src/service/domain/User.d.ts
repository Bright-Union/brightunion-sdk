import Web3 from 'web3';
declare type User = {
    web3: Web3;
    clientKey: any;
    googleEventsEnabled: boolean;
    web3Passive: any[];
    networkId: number;
    symbol: string;
    brightProtoAddress: any;
    account: any;
    ethNet: any;
};
export default User;
