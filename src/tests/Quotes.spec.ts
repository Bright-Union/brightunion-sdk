require('dotenv').config();
import Web3 from 'web3';
import { expect, assert } from 'chai';
import 'mocha';

import Distributors from '../index'
import NetConfig from '../service/config/NetConfig';

/**
 *
 *  Switch NETWORK_ID to test the
 *  Protocol on different test-net
 *
 *  Rinkeby 4 | Kovan 42 | Mumbai 80001 | BSCT 97
 *
 * */

const NETWORK_ID : number = 4;
const netConfig = NetConfig.NETWORK_CONFIG.filter(net => net.id === NETWORK_ID)[0];
let instance : Distributors = null;
let web3 : any;

/**  Init contract test instance  */
before(async () => {
    web3 = new Web3(netConfig.provider);
    web3.networkId = NETWORK_ID;
    web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
    instance = new Distributors(netConfig.brightProtocol, web3);
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
