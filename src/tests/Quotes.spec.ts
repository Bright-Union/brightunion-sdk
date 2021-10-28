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

describe('Get Cover Quote', () => {
  it('Should get the quote of specified cover by distributor',async () => {
    const result = await instance.getQuote(
                          "bridge",
                          26,
                          web3.utils.toBN('1000000000000000000000').toNumber(),
                          "0x85A976045F1dCaEf1279A031934d1DB40d7b0a8f",
                          "0x0000000000000000000000000000000000000000",
                          "0x0000000000000000000000000000000000000000",
                          web3.utils.hexToBytes(web3.utils.numberToHex(500))
    );
    assert.typeOf(result, 'Array');
  });
});


describe('Get Cover Quotes from all Distributors', () => {
  it('Should get the quotes of all supported distributor',async () => {
    const result = await instance.getQuotes();
    assert.lengthOf(result, 2);
    // assert.typeOf(result, 'Array');
  });
});
