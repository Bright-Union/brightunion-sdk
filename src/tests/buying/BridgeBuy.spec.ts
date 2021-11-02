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

// Test temp DAO
let bridgeQuote : any;
let bridgeProductAddress : string = '0x85A976045F1dCaEf1279A031934d1DB40d7b0a8f';

before( async () => {
    erc20Instance = _getIERC20Contract(netConfig.USDT);
    ercBalance = await erc20Instance.methods.balanceOf(owner).call();
});

describe('Get Bridge Quote', () => {
    it('Should have.property(totalPrice)', async () => {
      const protocol = { bridgeProductAddress:'0x85A976045F1dCaEf1279A031934d1DB40d7b0a8f'};
      bridgeQuote = await brightClient.getQuoteFrom("bridge",
                                                     web3.utils.toBN('1000000000000000000000'),
                                                     'ETH',
                                                     26,
                                                     protocol);
      console.log('Bridge quote: ', bridgeQuote);
      expect(bridgeQuote).to.have.property('totalPrice')
    });
  });



describe('Buy Cover on Bridge', () => {
  it('Should buy Bridge quote',  (done) => {
      let price = bridgeQuote.totalPrice;
      console.log('Bridge cover price: ', price);

            console.log(owner)

            console.log('ercBalance: ', ercBalance)

            if (Number(ERC20Helper.USDTtoERCDecimals(ercBalance)) >= (Number)(price)) {
                    console.log('enter helper...');
                    let state = { web3:{ web3Active:{ coinbase: owner }}};
                    ERC20Helper.approveUSDTAndCall(
                        state, // state
                        erc20Instance, // pay with asset
                        bridgeProductAddress, // spender
                        web3.utils.toBN('10000000000000000000'), // price, amount to allow spender spend in wei
                        () => { // onAllowanceReset
                        console.log('SHOW_CONFIRMATION_WAITING', {msg: `(1/3) Resetting USDT allowance to 0`});
                        },async () => {

                            // Sign tx manually
                            web3.eth.accounts.signTransaction({
                                to: bridgeProductAddress,
                                // value: '1000000000',
                                gas: 2000000
                            }, process.env.PRIVATE_KEY)
                            .then(console.log);


                            console.log('calling  brightClient.buyCover...')
                            await brightClient.buyCover(
                                owner,
                                'bridge',
                                bridgeProductAddress,
                                netConfig.USDT,  // payment asset
                                0, // sum assured, compliant
                                26, // bridge epochs
                                1, //coverType
                                web3.utils.toBN("100000000000000000000"), // token amount to cover
                                web3.utils.hexToBytes(web3.utils.numberToHex(500)) // random data
                            )


                        }, () => { console.log(Error);  }  //onError
                    );
              }

     })
});

// bridge buy params
// bookContract.methods.buyPolicy(
//     epochs,
//     this.quote.amount.toString()
// )



// let periodInWeeks: number = 26;
// let amountWei:string = global.user.web3.utils.toWei( '10000', 'ether');
// let amount: any = global.user.web3.utils.toBN(amountWei);
// let contractAddress: string = bridgeProductAddress;
// let interfaceCompliant1: string = "0x0000000000000000000000000000000000000000"
// let interfaceCompliant2: string = "0x0000000000000000000000000000000000000000"
// let data:number[] = global.user.web3.utils.hexToBytes(global.user.web3.utils.numberToHex(500));
