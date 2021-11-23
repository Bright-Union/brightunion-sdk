require('dotenv').config();
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

 const NETWORK_ID : number = 4;
 const netConfig = NetConfig.netById(NETWORK_ID);
 let instance : Distributors = null;
 let web3 : any;
 // let owner: any;

/**  Init contract test instance  */
before(async () => {
  web3 = new Web3(netConfig.provider);
  web3.networkId = NETWORK_ID;
  web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
  instance = new Distributors({ web3: web3 });
});

describe('Get Owners Cover count', () => {
  it('should return number of covers owned by address',async () => {
    const result = await instance.getCoversCountFrom(
        'insurace',
        // '0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2',
        true
    );
    console.log('COUNT - ' , result)
    expect(result).to.equal('4');
  });
});

describe('Get Owners Covers', () => {
  let distributorName = 'bridge';
    it('should return owners\'s covers by distributor', async () => {
    const result = await instance.getCoversFrom(
        distributorName,
        // '0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2',
        // false,
        // 20
    );
    console.log('COVERS - ' , result)
    expect(result).to.be.a('array');
  });
});
