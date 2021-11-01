require('dotenv').config();

import 'mocha';
import Web3 from 'web3';
import { expect, assert } from 'chai';
import BrightClient from '../../BrightClient';
import InsuraceApi from '../../service/distributorsApi/InsuraceApi';
import {BigNumber} from "bignumber.js";
import NetConfig from '../../service/config/NetConfig';
import InsuraceDistributor from '../../service/abi/InsuraceDistributor.json';
import {_getIERC20Contract} from '../../service/helpers/getContract';
import CatalogHelper from '../../service/helpers/catalogHelper';
import ERC20Helper from '../../service/helpers/ERC20Helper';

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
let brightClient : BrightClient = null; // mounting protocol
let web3 : any;
let instanceConf:object;
let owner :any;
let ercBalance :any;
let erc20Instance : any;

// testing Insurace buy directly with Impl contract
// netConfig.brightProtocol = '0x486135ec25eA3445E141C95dfDc7a70aaB663dd6';

/**  Init BrightClient test instance  */
before(async () => {
    web3 = new Web3(netConfig.provider);
    owner = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address; // web3.active.coinbase

    brightClient = new BrightClient({
        web3: web3,
        networkId: NETWORK_ID,
        brightProtoAddress: netConfig.brightProtocol,
        account: owner,
    });
    await brightClient.initialize();
});


let nexusQuote:any;
describe('Get Nexus Quote', () => {
    it('Should print quote', async () => {
  
      nexusQuote = await brightClient.getQuoteFrom(
                                        "nexus",
                                        web3.utils.toBN('1000000000000000000000'),
                                        netConfig.DAI,
                                        180,
                                        '0x11111254369792b2Ca5d084aB5eEA397cA8fa48B');
  
      console.log('Nexus quote:',nexusQuote);
  
    });
  });


  /**
   * Signing tx manually until impl with UI
   */

  describe('Buy Cover on Nexus', () => {
    it('Should buy Nexus quote',  (done) => {
        let price = nexusQuote.totalPrice;
        console.log('Bridge cover price: ', price);
  
              console.log(owner)
  
              console.log('ercBalance: ', ercBalance)
  
              if (Number(ERC20Helper.USDTtoERCDecimals(ercBalance)) >= (Number)(price)) {
                      console.log('enter helper...');
                      let state = { web3:{ web3Active:{ coinbase: owner }}};
                      ERC20Helper.approveUSDTAndCall(
                          state, // state
                          erc20Instance, // pay with asset
                          'exus address', // spender
                          web3.utils.toBN('10000000000000000000'), // price, amount to allow spender spend in wei
                          () => { // onAllowanceReset
                          console.log('SHOW_CONFIRMATION_WAITING', {msg: `(1/3) Resetting USDT allowance to 0`});
                          },async () => { 
  
                              // Sign tx manually
                              web3.eth.accounts.signTransaction({
                                  to: nexusQuote.address,
                                  // value: '1000000000',
                                  gas: 2000000
                              }, process.env.PRIVATE_KEY)
                              .then(console.log);
  
  
                              console.log('calling  brightClient.buyCover...')                            
                              await brightClient.buyCover(
                                  owner,
                                  'bridge',
                                  nexusQuote.address,
                                  netConfig.USDT,  // payment asset
                                  0, // sum assured, compliant
                                  26, // period
                                  1, //coverType
                                  web3.utils.toBN("100000000000000000000"), // token amount to cover
                                  web3.utils.hexToBytes(web3.utils.numberToHex(500)) // random data
                              )
  
  
                          }, () => { console.log(Error);  }  //onError
                      );
                } 
  
       })
  });