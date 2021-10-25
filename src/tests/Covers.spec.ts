require('dotenv').config();
import Web3 from 'web3';
import { expect, assert } from 'chai';
import 'mocha';
import Distributors from '../index'
let instance : Distributors = null;

before(async () => {
    process.env.DISTRIBUTOR_RINKEBY_ADDRESS;
    const web3 = new Web3(process.env.INFURA_RINKEBY);
    web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
    instance = new Distributors(web3);
});

describe('Get Owners Cover count', () => {
  it('should return number of covers owned by address',async () => {
    const result = await instance.getCoversCount(
        'insurace',
        '0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2',
        true
    );
    expect(result).to.equal('4');
  });
});

describe('Get Owners Covers', () => {
  let distributorName = 'insurace';
  let owner = '0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2';
    it('should return owners\'s covers by distributor',async () => {
    const result = await instance.getCovers(
        distributorName,
        owner,
        true,
        20
    );
    assert.lengthOf(result, 4);
  });
});