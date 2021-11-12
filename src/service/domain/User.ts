import Web3 from 'web3'

type User = {
  web3: Web3,
  web3Passive: any[],
  networkId: number,
  brightProtoAddress: any,
  account: any,
};

export default User
