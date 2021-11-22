import  DistributorsABI  from '../abi/Distributors.json';
import IERC20ABI from '../abi/IERC20.json';

import InsuraceDistributorABI from '../abi/insurace/InsuraceDistributor.json';
import ICoverABI from '../abi/insurace/ICover.json';
import InsuraceCoverDataABI from '../abi/insurace/ICoverData.json';
import InsuraceProductABI from '../abi/insurace/IProduct.json';

import NexusDistributorABI from '../abi/nexus/NexusDistributor.json';
import DistributorNexusABI from '../abi/nexus/Distributor.json';

import BridgeRegistryContractABI from '../abi/bridge/IContractsRegistry.json';
import BridgePolicyBookRegistryABI from '../abi/bridge/IPolicyBookRegistry.json';
import BridgePolicyQuoteABI from '../abi/bridge/IPolicyQuote.json';
import BridgePolicyBookABI from '../abi/bridge/IPolicyBook.json';
import BridgePolicyRegistryABI from '../abi/bridge/IPolicyRegistry.json';

import { StringChain } from 'lodash';


/**
 *    "Distributors"
 *    Get Contracts from Bright Union Protocol
 *  */
function _getDistributorsContract() : any {
  const web3:any = global.user.web3;
  const address: string = global.user.brightProtoAddress;
  const distAbi:any = DistributorsABI.abi;
  return new web3.eth.Contract(distAbi, address );
}

function _getNexusDistributorsContract(address:any) : any {
  const web3:any = global.user.web3;
  const distAbi:any = NexusDistributorABI.abi;
  return new web3.eth.Contract(distAbi, address );
}

function _getInsuraceDistributorsContract(address:string) : any {
  const web3:any = global.user.web3;
  const distAbi:any = InsuraceDistributorABI.abi;

  return new web3.eth.Contract(distAbi, address );
}

function _getInsurAceProductContract(address:string) : any {
  const web3:any = global.user.web3;
  const distAbi:any = InsuraceProductABI.abi;

  return new web3.eth.Contract(distAbi, address );
}

/**
 *
 *  Direct Call to Distributors Contracts
 *  "without BU protocol Layer"
 */
function _getNexusDistributor(address:string) : any {
  const web3:any = global.user.web3;
  const distAbi:any = DistributorNexusABI .abi;
  return new web3.eth.Contract(distAbi, address );
}

function _getInsuraceDistributor(address:string) : any {
  const web3:any = global.user.web3;
  const distAbi:any = ICoverABI.abi;
  return new web3.eth.Contract(distAbi, address );
}

function _getInsurAceCoverDataContract(address:string) : any {
  const web3:any = global.user.web3;
  const distAbi:any = InsuraceCoverDataABI.abi;
  return new web3.eth.Contract(distAbi, address );
}

const _getBridgeRegistryContract           =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgeRegistryContractABI.abi, address , web3);
const _getBridgePolicyBookRegistryContract =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgePolicyBookRegistryABI.abi, address , web3);
const _getBridgePolicyQuoteContract        =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgePolicyQuoteABI.abi, address , web3);
const _getBridgePolicyBookContract         =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgePolicyBookABI.abi, address , web3);
const _getBridgePolicyRegistryContract     =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgePolicyRegistryABI.abi, address , web3);


function _getIERC20Contract(address:any) {
    const web3:any = global.user.web3;
    const distAbi:any = IERC20ABI.abi;

    return new web3.eth.Contract(distAbi,address);
}

export  {
  _getDistributorsContract,
    _getIERC20Contract,
    _getBridgeRegistryContract,
    _getBridgePolicyBookRegistryContract,
    _getBridgePolicyQuoteContract,
    _getBridgePolicyBookContract,
    _getBridgePolicyRegistryContract,
    _getInsuraceDistributorsContract,
    _getInsuraceDistributor,
    _getInsurAceCoverDataContract,
    _getInsurAceProductContract,
    _getNexusDistributorsContract,
    _getNexusDistributor
} ;
