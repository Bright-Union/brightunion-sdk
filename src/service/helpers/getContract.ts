import  DistributorsABI  from '../abi/Distributors.json';

function getContract(abi:any, address:string, web3:any) : any {

    return new web3.eth.Contract(abi.abi, address);
}
function getDistributorContract(address :string , web3:any) : any {
    return getContract(DistributorsABI, address, web3);
}

export default getDistributorContract ;
