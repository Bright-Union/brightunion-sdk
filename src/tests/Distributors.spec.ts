require('dotenv').config();
import Web3 from 'web3';
import { expect, assert } from 'chai';
import 'mocha';
import Distributors from '../index'
let instance : Distributors = null;
let web3 : Web3;


before(async () => {
    process.env.DISTRIBUTOR_RINKEBY_ADDRESS;
    web3 = new Web3(process.env.INFURA_RINKEBY);
    web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
    instance = new Distributors(web3);
});

describe('Get distributor address', () => {
  it('Should return a valid Contract implementation address from distributor',async () => {
    const result = await instance.getDistributorAddress(
        'bridge',
    );
    let isValidContractAddress = web3.utils.isAddress(result);
    expect(isValidContractAddress).to.be.true;
  });
});
