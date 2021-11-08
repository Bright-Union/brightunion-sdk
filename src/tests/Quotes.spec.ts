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
  owner = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address; // web3.active.coinbase
  console.log(owner)
  brightClient = new BrightClient({
                                web3: web3,
                                networkId: NETWORK_ID,
                                brightProtoAddress: netConfig.brightProtocol,
                                account: owner,
                            });
  brightClient.initialize();
});


describe('BRIDGE QUOTE', () => {
  it('Should print quote',async () => {
    let protocol = { bridgeCoverable:'0x85A976045F1dCaEf1279A031934d1DB40d7b0a8f'};
    const result = await brightClient.getQuoteFrom(
                                                    "bridge",
                                                    web3.utils.toBN('1000000000000000000000'),
                                                    'ETH',
                                                    26,
                                                    protocol)

    console.log(result)
  });
});

describe('NEXUS QUOTE', () => {
  it('Should print quote', async () => {
    let protocol = { nexusCoverable:'0x11111254369792b2Ca5d084aB5eEA397cA8fa48B'};
    const result = await brightClient.getQuoteFrom(
                                      "nexus",
                                      web3.utils.toBN('1000000000000000000000'),
                                      'DAI',
                                      180,
                                      protocol);

    console.log(result);

  });
});

describe('INSURACE QUOTE', () => {
  it('Should have.property(totalPrice)', async () => {
    let protocol = { productId:2};

    const result = await brightClient.getQuoteFrom(
                                      "insurace",
                                      web3.utils.toBN("2000000000000000000").toString(),
                                      netConfig.ETH,
                                      180,
                                      2); //prod id
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
