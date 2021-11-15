import  DistributorsABI  from '../abi/Distributors.json';
import IERC20ABI from '../abi/IERC20.json';
import InsuraceDistributorABI from '../abi/InsuraceDistributor.json';
import BridgeRegistryContractABI from '../abi/bridge/IContractsRegistry.json';
import BridgePolicyBookRegistryABI from '../abi/bridge/IPolicyBookRegistry.json';
import BridgePolicyQuoteABI from '../abi/bridge/IPolicyQuote.json';
import BridgePolicyBookABI from '../abi/bridge/IPolicyBook.json';
import BridgePolicyRegistryABI from '../abi/bridge/IPolicyRegistry.json';

const _getBridgeRegistryContract           =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgeRegistryContractABI.abi, address , web3);
const _getBridgePolicyBookRegistryContract =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgePolicyBookRegistryABI.abi, address , web3);
const _getBridgePolicyQuoteContract        =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgePolicyQuoteABI.abi, address , web3);
const _getBridgePolicyBookContract         =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgePolicyBookABI.abi, address , web3);
const _getBridgePolicyRegistryContract     =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgePolicyRegistryABI.abi, address , web3);

function _getDistributorContract() : any {
  const web3:any = global.user.web3;
  const address: string = global.user.brightProtoAddress;
  const distAbi:any = DistributorsABI.abi;

  return new web3.eth.Contract(distAbi, address );
}

function _getInsuraceDistributor() : any {
  const web3:any = global.user.web3;
  const address: string = '0x1D2ba34121C4b8C92d3b78953143A283d65d7d47';
  const distAbi:any = InsuraceDistributorABI.abi;

  return new web3.eth.Contract(distAbi, address );
}

function _getIERC20Contract(address:any) {
    const web3:any = global.user.web3;
    const distAbi:any = IERC20ABI.abi;

    return new web3.eth.Contract(distAbi,address);
}

export  {
    _getDistributorContract,
    _getIERC20Contract,
    _getBridgeRegistryContract,
    _getBridgePolicyBookRegistryContract,
    _getBridgePolicyQuoteContract,
    _getBridgePolicyBookContract,
    _getBridgePolicyRegistryContract,
    _getInsuraceDistributor
} ;
