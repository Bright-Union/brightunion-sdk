require('dotenv').config();
import 'mocha';
import Web3 from 'web3';
import { expect, assert } from 'chai';
import Distributors from '../index';
import InsuraceApi from '../service/distributorsApi/InsuraceApi';
import {BigNumber} from "bignumber.js";
import NetConfig from '../service/config/NetConfig';
import InsuraceDistributor from '../service/abi/InsuraceDistributor.json';

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

// testing Insurace buy directly with Impl contract
netConfig.brightProtocol = '0x486135ec25eA3445E141C95dfDc7a70aaB663dd6';

/**  Init contract test instance  */
before(async () => {
    web3 = new Web3(netConfig.provider);
    web3.networkId = NETWORK_ID;
    web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
    instance = new Distributors(netConfig.brightProtocol, web3);
});

let premium : any;
before( async () => {
    premium = await InsuraceApi.getCoverPremium(
                    web3,netConfig.ETH,1,30,"1000000000000000000",
                    "0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2")
    return premium;
});


let confirmCoverResult : any ;
before(async () => {
    let state = { web3 : { web3Active:{networkId : 4, symbol:'ETH'} } };
    confirmCoverResult = await InsuraceApi.confirmCoverPremium(state, premium.params)
    console.log(confirmCoverResult)
    return confirmCoverResult;
});

describe('Buy Cover on Insurace', () => {
  it('Should buy insurace quote', (done) => {
    // let toWei = Web3.utils.toWei(confirmCoverResult[6]+100, 'ether').toString();
    // let fromWei = Web3.utils.fromWei(confirmCoverResult[6], 'ether').toString();

    // console.log('fromWei: ',toWei)
    // console.log('fromWei: ',fromWei)

                 instance.buyCoverDecode(
                    "0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2",
                    'insurace',
                    confirmCoverResult[0],
                    confirmCoverResult[1],
                    confirmCoverResult[2],
                    confirmCoverResult[3],
                    confirmCoverResult[6],
                    confirmCoverResult[7],
                    confirmCoverResult[8],
                    confirmCoverResult[9],
                    confirmCoverResult[10],
                    confirmCoverResult[11],
                ).then((result:any) => {
                    assert.typeOf(result, 'Array');
                    done();
                 }).catch(done);
            })
});


// describe('Buy Cover on Bridge', () => {
//     it('Should buy bridge quote', (done) => {
//                    instance.buyCoverDecode( web3,
//                       "0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2",
//                       'insurace',
//                       confirmCoverResult[0],
//                       confirmCoverResult[1],
//                       confirmCoverResult[2],
//                       confirmCoverResult[3],
//                       confirmCoverResult[6],
//                       confirmCoverResult[7],
//                       confirmCoverResult[8],
//                       confirmCoverResult[9],
//                       confirmCoverResult[10],
//                       confirmCoverResult[11],
//                   ).then((result) => {
//                       assert.typeOf(result, 'Array');
//                       done();
//                    }).catch(done);
//               })
//   });


// describe('Buy Cover on Nexus', () => {
//     it('Should buy nexus quote', (done) => {
//       // let toWei = Web3.utils.toWei(confirmCoverResult[6]+100, 'ether').toString();
//       // let fromWei = Web3.utils.fromWei(confirmCoverResult[6], 'ether').toString();

//       // console.log('fromWei: ',toWei)
//       // console.log('fromWei: ',fromWei)

//                    instance.buyCoverDecode( web3,
//                       "0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2",
//                       'insurace',
//                       confirmCoverResult[0],
//                       confirmCoverResult[1],
//                       confirmCoverResult[2],
//                       confirmCoverResult[3],
//                       confirmCoverResult[6],
//                       confirmCoverResult[7],
//                       confirmCoverResult[8],
//                       confirmCoverResult[9],
//                       confirmCoverResult[10],
//                       confirmCoverResult[11],
//                   ).then((result) => {
//                       assert.typeOf(result, 'Array');
//                       done();
//                    }).catch(done);
//               })
//   });
