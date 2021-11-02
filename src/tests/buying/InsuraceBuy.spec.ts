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
    brightClient = new BrightClient({
        web3: web3,
        networkId: NETWORK_ID,
        brightProtoAddress: netConfig.brightProtocol,
        account: owner,
    });
    await brightClient.initialize();
});

let premium : any;
before( async () => {
    premium = await InsuraceApi.getCoverPremium(
                                                "2000000000000000000",
                                                netConfig.ETH,
                                                180,
                                                2,
                                                owner)

    console.log(premium)
    return premium;
});


let confirmCoverResult : any ;
before(async () => {
    confirmCoverResult = await InsuraceApi.confirmCoverPremium('ETH', premium.params)
    console.log(confirmCoverResult)
    return confirmCoverResult;
});

describe('Buy Cover on Insurace', () => {
  it('Should buy insurace quote', (done) => {
    // let toWei = Web3.utils.toWei(confirmCoverResult[6]+100, 'ether').toString();
    // let fromWei = Web3.utils.fromWei(confirmCoverResult[6], 'ether').toString();
                 brightClient.buyCoverInsurace(
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