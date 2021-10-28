import  DistributorsABI  from '../abi/Distributors.json';
import IERC20ABI from '../abi/IERC20Metadata.json';
import InsuraceDistributor from '../abi/InsuraceDistributor.json';


function _getDistributorContract(address:string,web3:any) : any {
    return new web3.eth.Contract(DistributorsABI.abi, address , web3);
}

function _getIERC20Contract(address:string, web3:any) : any {
    return new web3.eth.Contract(IERC20ABI.abi, address , web3);
}

export  {
    _getDistributorContract,
    _getIERC20Contract
} ;
