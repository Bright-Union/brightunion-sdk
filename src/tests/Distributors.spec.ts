require('dotenv').config();
import 'mocha';
import Web3 from 'web3';
import { expect, assert } from 'chai';
import 'mocha';
import Distributors from '../BrightClient'
import NetConfig from '../service/config/NetConfig';

/**
 * 
 *  Switch NETWORK_ID to test the
 *  Protocol on different test-net
 * 
 *  Rinkeby 4 | Kovan 42 | Mumbai 80001 | BSCT 97
 * 
 * */

const NETWORK_ID : number = 42;
const netConfig = NetConfig.netById(NETWORK_ID);
let instance : Distributors = null;
let web3 : any;

/**  Init contract test instance  */

before(async () => {
  web3 = new Web3(netConfig.provider);
  web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
  instance = new Distributors({
                                web3: web3,
                                networkId: NETWORK_ID,
                                brightProtoAddress: netConfig.brightProtocol,
                                account: await (web3.eth.accounts[0]),
                            });
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
