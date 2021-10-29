import  DistributorsABI  from '../abi/Distributors.json';
import IERC20ABI from '../abi/IERC20Metadata.json';
import InsuraceDistributor from '../abi/InsuraceDistributor.json';

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

    console.log('_getDistributorContract' , web3, address);

    return new web3.eth.Contract(DistributorsABI.abi, address , web3);
}

function _getIERC20Contract() : any {
  const web3:any = global.user.web3;
  const address: string = global.user.brightProtoAddress;
    return new web3.eth.Contract(IERC20ABI.abi, address , web3);
}

export  {
    _getDistributorContract,
    _getIERC20Contract,
    _getBridgeRegistryContract,
    _getBridgePolicyBookRegistryContract,
    _getBridgePolicyQuoteContract,
    _getBridgePolicyBookContract,
    _getBridgePolicyRegistryContract,
} ;
