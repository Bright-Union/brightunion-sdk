import Web3 from 'web3'

type User = {
  web3: Web3,
  networkId: number|string,
  brightProtoAddress: string,
  account: string,
};

export default User
