require('dotenv').config();
import Web3 from 'web3';
import { expect, assert } from 'chai';
import 'mocha';
import Distributors from '../index';
import InsuraceApi from '../service/distributorsApi/InsuraceApi';

let instance : Distributors = null;
let web3 : any;

let confirmCoverResult : any;
let confirmCoverPremium : any;
let securityParams : any;

before(async () => {
    process.env.DISTRIBUTOR_RINKEBY_ADDRESS;
    web3 = new Web3(process.env.INFURA_RINKEBY);
    web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
    instance = new Distributors(web3);
});

before(async () => {
    web3.networkId = 4;
    // confirmCoverResult = await InsuraceApi.getCoverPremium(
    //                                 web3,
    //                                 "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    //                                 [1],
    //                                 [30],
    //                                 ["1000000000000000000"],
    //                                 "0x0123456789abcdef0123456789abcdef01234567");

    //  console.log('confirmCoverResult: ',confirmCoverResult);
    });

let state = { web3 : { web3Active:{networkId : 4, symbol:'ETH'} } };
let params = [ [20],[180],[ "1000000000000000000"],
    "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    "0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2",
    "793994470242227903341175322776247553077614562018",
    "12400000000000000",
    [
      "1000000000000000000",
      "180000000000000000000",
      "500",
      "500"
    ],
    "10000",
    [
      "0",
      "0"
    ]
  ];


// before(async () => {
//     confirmCoverPremium = await InsuraceApi.confirmCoverPremium(state,params);
//     console.log('confirmCoverPremium: ',confirmCoverPremium);
// });

// describe('Buy Cover on Insurace', () => {
//   it('Should the quote of specified cover by distributor',async () => {
//     const result = await instance.buyCoverDecode(
//                                     web3,
//                                     '0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2',
//                                     'insurace',
//                                     confirmCoverPremium[0], // prodId[]
//                                     confirmCoverPremium[1], //_durationInDays
//                                     confirmCoverPremium[2], // amounts
//                                     confirmCoverPremium[3], //currency
//                                     confirmCoverPremium[5], //premiumAmount
//                                     confirmCoverPremium[5],
//                                     confirmCoverPremium[6],
//                                     confirmCoverPremium[7],
//                                     confirmCoverPremium[8],
//                                     confirmCoverPremium[9],
//                                 );
//     assert.typeOf(result, 'Array');
//   });
// });
