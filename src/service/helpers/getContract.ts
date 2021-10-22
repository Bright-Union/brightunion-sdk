import  DistributorsABI  from '../abi/Distributors.json';

const contract_rinkeby = '0x6E174A2C3E61B5E4f13Cc7035F4cB46E63f214db';


function _getDistributorContract(web3:any) : any {
    return new web3.eth.Contract(DistributorsABI.abi, contract_rinkeby,web3);
}

export default _getDistributorContract ;
