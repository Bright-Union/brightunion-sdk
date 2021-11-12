require('dotenv').config();
import 'mocha';
import Web3 from 'web3';
import { expect, assert } from 'chai';
import BrightClient from '../../BrightClient';
import NetConfig from '../../service/config/NetConfig';
/**
 *
 *  Switch NETWORK_ID to test the
 *  Protocol on different test-net
 *
 *  Rinkeby 4 | Kovan 42 | Mumbai 80001 | BSCT 97 | Polygon 137 | BSC 56
 *
 * */


const NETWORK_ID : number = 4;
const netConfig = NetConfig.netById(NETWORK_ID);
let brightClient : BrightClient = null;
let web3 : any;
let owner:any;


// testing Insurace buy directly with Impl contract
// netConfig.brightProtocol = '0x486135ec25eA3445E141C95dfDc7a70aaB663dd6';

/**  Init contract test instance  */
before(async () => {
    web3 = new Web3(netConfig.provider);
    web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
    owner = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address; // web3.active.coinbase
    web3.eth.personal.unlockAccount(owner,process.env.PRIVATE_KEY, 50000)
    web3.eth.handleRevert = true;

    brightClient = new BrightClient({
        web3: web3,
        networkId: NETWORK_ID,
        brightProtoAddress: netConfig.brightProtocol,
        account: owner,
    });
    web3.networkId = NETWORK_ID;
    await brightClient.initialize();
});


let quote : any;
before(async () => {
    quote = await brightClient.getQuoteFrom(    'insurace',
                                                1000000000000000000,
                                                '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
                                                180,
                                                20)

    console.log(quote);
    return quote.params;
});

describe('Buy Cover on Insurace with ETH', () => {
    it('I should get me a new coverage: ',  () => {
     
      brightClient.buyQuote(quote);
   
    });
  });
