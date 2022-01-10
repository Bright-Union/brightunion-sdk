import Web3 from 'web3'

type User = {
  web3: Web3,
  clientKey: any,
  web3Passive: any[],
  networkId: number,
  symbol: string,
  brightProtoAddress: any,
  account: any,
  ethNet: any,
};

export default User
