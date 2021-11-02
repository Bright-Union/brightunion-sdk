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

const NETWORK_ID : number = 42;
const netConfig = NetConfig.netById(NETWORK_ID);
let brightClient : BrightClient = null; // mounting protocol
let web3 : any;
let instanceConf:object;
let owner :any;
let erc20Instance : any;
let ercBalance:number;
// testing Insurace buy directly with Impl contract
// netConfig.brightProtocol = '0x486135ec25eA3445E141C95dfDc7a70aaB663dd6';

/**  Init BrightClient test instance  */
before(async () => {
    web3 = new Web3(netConfig.provider);
    owner = await web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address; // web3.active.coinbase

    brightClient = new BrightClient({
        web3: web3,
        networkId: NETWORK_ID,
        brightProtoAddress: netConfig.brightProtocol,
        account: owner,
    });
    await brightClient.initialize();
    erc20Instance = await _getIERC20Contract(netConfig.ETH);
});


let nexusResponse:any;
describe('Get Nexus Quote', () => {
    it('Should print quote', async () => {
     let protocol = { nexusCoverable:'0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9' };
     nexusResponse = await brightClient.getQuoteFrom(
                                        "nexus",
                                        web3.utils.toBN('100000000000000'),
                                        'ETH',
                                        30,
                                        protocol);

      console.log('Nexus quote:', owner);
      ercBalance = await erc20Instance.methods.balanceOf(owner).call();

    });
  });


// before( async () => {
//     console.log(erc20Instance)
//     ercBalance = await erc20Instance.methods.balanceOf(owner).call();
//     console.log(erc20Instance)
// });


describe('Buy Cover on Nexus', () => {
    it('Should buy Nexus quote',  (done) => {
        console.log('ercBalance: ',ercBalance)

        console.log('Nexus cover price: ', nexusResponse.price);
        
              console.log(owner)
              console.log('ercBalance: ', ercBalance)
  

                //    if (Number(ercBalance) >= (Number)(nexusResponse.price)) {
                    let state = { web3:{ web3Active:{ coinbase: owner }}};

                        ERC20Helper.approveAndCall(
                            state,
                            erc20Instance,
                            nexusResponse.contract,
                            nexusResponse.price,
                            () => {
                              console.log('signing tx')
                                      // Sign tx manually
                                    web3.eth.accounts.signTransaction({
                                        to: nexusResponse.contract,
                                        // value: '1000000000',
                                        gas: 2000000
                                    }, process.env.PRIVATE_KEY)
                                    .then(console.log);

                            
                          const data = web3.eth.abi.encodeParameters(
                              ['uint', 'uint', 'uint', 'uint', 'uint8', 'bytes32', 'bytes32'],
                              [nexusResponse.price, nexusResponse.priceInNXM, nexusResponse.expiresAt, 
                               nexusResponse.generatedAt, nexusResponse.v, nexusResponse.r, nexusResponse.s],
                          );

                            console.log('calling  brightClient.buyCover...')                            
                                brightClient.buyCover(
                                    owner,
                                    'nexus',
                                    nexusResponse.contract,
                                    netConfig.USDT,  // payment asset
                                    0, // sum assured, compliant
                                    26, // period
                                    1, //coverType
                                    web3.utils.toBN("100000000000000000000"), // token amount to cover
                                    data// random data
                                )

                            },(err : any) => {
                              console.log(err);
                         });
                    //   } 
                });
    });


// {
//     "currency": "ETH",
//     "period": "180",
//     "amount": "1",
//     "price": "12813141683778234",
//     "priceInNXM": "334880198350683026",
//     "expiresAt": 1640946938,
//     "generatedAt": 1635762937230,
//     "contract": "0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9",
//     "v": 27,
//     "r": "0x9059d04512ad7e74f236499789e1ee0d4bb6bf1d6b7b36e96b2eee22f666b132",
//     "s": "0x5ffe8a197be6df897679392318b7ef0156526d4df91c19e3c1ec41be8da304f0"
// }