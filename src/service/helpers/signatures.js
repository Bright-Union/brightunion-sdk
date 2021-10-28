const {fromRpcSig} = require('ethereumjs-util');

const {MAX_UINT256} = require('./constants');

const sign2612 = async (domain, message, nonce, web3Instance) => {
  const {name, version= '1', chainId= web3Instance.networkId, verifyingContract} = domain;
  const {owner, spender, value, deadline=MAX_UINT256.toString(10)} = message;

  const EIP712Domain = [
    {name: 'name', type: 'string'},
    {name: 'version', type: 'string'},
    {name: 'chainId', type: 'uint256'},
    {name: 'verifyingContract', type: 'address'},
  ];

  const Permit = [
    {name: 'owner', type: 'address'},
    {name: 'spender', type: 'address'},
    {name: 'value', type: 'uint256'},
    {name: 'nonce', type: 'uint256'},
    {name: 'deadline', type: 'uint256'},
  ];

  const data = {
    primaryType: 'Permit',
    types: {EIP712Domain, Permit},
    domain: {name, version, chainId, verifyingContract},
    message: {owner, spender, value: value.toString(10), nonce, deadline},
  };

  const signature = await web3Instance.provider.request({
    method: "eth_signTypedData_v4",
    params:[
      owner,
      JSON.stringify(data)
    ]
  });

  return fromRpcSig(signature);
};

const getSignature = async (stakingAmount, stakingAddress, tokenAddress, contractName, nonce, store)  => {
  const [ownerCurrentAccount] = await store.state.web3.web3Active.web3Instance.eth.getAccounts();
  const contractData = {name: contractName, verifyingContract: tokenAddress};
  const transactionData = {
    owner: ownerCurrentAccount,
    spender: stakingAddress,
    value: stakingAmount,
  };
  return  await sign2612(contractData, transactionData, nonce, store.state.web3.web3Active);
};

module.exports = {
  getSignature
};
