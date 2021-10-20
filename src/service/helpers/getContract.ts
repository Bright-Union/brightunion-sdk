

import  DistributorsABI  from '../abi/Distributors.json';

function getContract(abi:any, address:string, web3:any) : any {
    new Promise((resolve, reject) => {
        const contractInstance = new web3.eth.Contract(abi.abi, address);
        if (contractInstance) {
            resolve(contractInstance);
        } else {
            reject('Can\'t get contact');
        }
    });
}
function getNexusDistributorContract(address :string , web3:any) : any {
    return getContract(DistributorsABI, address, web3);
}

export { getContract, getNexusDistributorContract };
