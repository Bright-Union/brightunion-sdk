require('dotenv').config();
import Web3 from 'web3';
import { expect } from 'chai';
import 'mocha';
import geDistributorContract  from '../service/helpers/getContract';
import { getCoversCount } from '../service/covers';

// From the protocol we only deal w/the "Distributors" contract.
let contract : any;

before(async () => {
    process.env.DISTRIBUTOR_RINKEBY_ADDRESS;
    const web3 = new Web3(process.env.INFURA_RINKEBY);
    web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
    contract = await geDistributorContract(process.env.DISTRIBUTOR_RINKEBY_ADDRESS,web3);
});

describe('Get Owners Cover count', () => {
  it('should return number cover total owned by address',async () => {
    const result = await contract.methods.getCoversCount(
        'insurace',
        '0x8B13f183e27AaD866b0d71F0CD17ca83A9a54ae2',
        true
    ).call();
    expect(result).to.equal('4');
  });
});

// Still need to pass this logic inside BU class & test
