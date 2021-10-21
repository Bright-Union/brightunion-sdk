import  DistributorsABI  from '../abi/Distributors.json';

function getContract(abi:any, address:string, web3:any) : any {
  
    return new web3.eth.Contract(abi.abi, address);
}
function geDistributorContract(address :string , web3:any) : any {
    return getContract(DistributorsABI, address, web3);
}

export default geDistributorContract ;
