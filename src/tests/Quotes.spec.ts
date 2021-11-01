require('dotenv').config();
import Web3 from 'web3';
import { expect, assert } from 'chai';
import 'mocha';

import BrightClient from '../BrightClient'
import NetConfig from '../service/config/NetConfig';

/**
 *
 *  Switch NETWORK_ID to test the
 *  Protocol on different test-net
 *
 *  MAINNET 1 \Rinkeby 4 | Kovan 42 | Mumbai 80001 | BSCT 97
 *
 * */

 const NETWORK_ID : number = 4;
 const netConfig = NetConfig.netById(NETWORK_ID);
 let brightClient : BrightClient = null;
 let web3 : any;
 let owner: any; 

/**  Init contract test instance  */
before(async () => {
  web3 = new Web3(netConfig.provider);
  web3.networkId = NETWORK_ID;
  web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
  console.log(' web3.eth.accounts: ', web3.eth.accounts[0]);
  owner = (await web3.eth.getAccounts())[0]

  brightClient = new BrightClient({
                                web3: web3,
                                networkId: NETWORK_ID,
                                brightProtoAddress: netConfig.brightProtocol,
                                account: owner,
                            });
  brightClient.initialize();
});

/**
 * getQuoteFrom(_distributorName:string,
             _amount:number,
             _currency:string,
             _period:number,
             _protocol:string): any {
 }
 */
describe('Get Bridge Quote', () => {
  it('Should print quote',async () => {
    const result = await brightClient.getQuoteFrom(
                                      "bridge",
                                      web3.utils.toBN('1000000000000000000000'),
                                      "0x85A976045F1dCaEf1279A031934d1DB40d7b0a8f",
                                      26,
                                      'bridge does not use this param');
    console.log('Bridge Quote: ',result)

  });
});

describe('Get Nexus Quote', () => {
  it('Should print quote', async () => {

    const result = await brightClient.getQuoteFrom(
                                      "nexus",
                                      web3.utils.toBN('1000000000000000000000'),
                                      netConfig.DAI,
                                      180,
                                      '0x11111254369792b2Ca5d084aB5eEA397cA8fa48B');

    console.log('Nexus quote:',result);

  });
});

describe('Get Insurace Quote', () => {
  it('Should have.property(totalPrice)', async () => {
    const result = await brightClient.getQuoteFrom(
                                      "insurace",
                                      web3.utils.toBN('1000'),
                                      netConfig.ETH,
                                      180,
                                      { productId:43 });
    console.log('Insurace quote:',result);
    return result;
  });
});


// NEXUS params

// let amount:number = 1000;
// let currency:string = 'DAI';
// let period:number = 180
// let protocol:object = { nexusCoverable:"0x11111254369792b2Ca5d084aB5eEA397cA8fa48B" };

// INSURANCE

// let amount:number = 1000;
// let currency:string = 'DAI';
// let period:number = 180
// let protocol:object = { productId:43 };