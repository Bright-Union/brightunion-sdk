require('dotenv').config();
import Web3 from 'web3';
import { expect, assert } from 'chai';
import 'mocha';
import NetConfig from '../service/config/NetConfig';


import Distributors from '../index'
let instance : Distributors = null;
let web3 : Web3;
const NETWORK_ID : number = 4;
const netConfig = NetConfig.NETWORK_CONFIG.filter(net => net.id === NETWORK_ID)[0];


before(async () => {
    process.env.DISTRIBUTOR_RINKEBY_ADDRESS;
    web3 = new Web3(process.env.INFURA_RINKEBY);
    web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
    instance = new Distributors( netConfig.brightProtocol, web3);
});

describe('Get Covers Catalog', () => {
  it('Should get the Catalog of all covers by all supported distributors',async () => {
    const result = await instance.getCatalog();
    assert.typeOf(result, 'Array');
  });
});
