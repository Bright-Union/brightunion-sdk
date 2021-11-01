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

