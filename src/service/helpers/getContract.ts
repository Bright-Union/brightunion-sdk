import DistributorsABI  from '../abi/Distributors.json';
import IERC20ABI from '../abi/IERC20.json';

import InsuraceDistributorABI from '../abi/insurace/InsuraceDistributor.json';
import ICoverABI from '../abi/insurace/ICover.json';
import InsuraceCoverDataABI from '../abi/insurace/ICoverData.json';
import InsuraceProductABI from '../abi/insurace/IProduct.json';

import NexusDistributorABI from '../abi/nexus/NexusDistributor.json';
import DistributorNexusABI from '../abi/nexus/Distributor.json';
import NexusQuotationABI from '../abi/nexus/IQuotationData.json';
import NexusGatewayABI from '../abi/nexus/IGateway.json';
import NexusClaimsDataABI from '../abi/nexus/IClaimsData.json';
import NexusMasterABI from '../abi/nexus/INXMaster.json';

import BridgeRegistryContractABI from '../abi/bridge/IContractsRegistry.json';
import BridgePolicyBookRegistryABI from '../abi/bridge/IPolicyBookRegistry.json';
import BridgePolicyQuoteABI from '../abi/bridge/IPolicyQuote.json';
import BridgePolicyBookABI from '../abi/bridge/IPolicyBook.json';
import BridgePolicyRegistryABI from '../abi/bridge/IPolicyRegistry.json';

// BridgeV2
import BridgeV2RegistryContractABI from '../abi/bridgeV2/ContractRegistry.json'
import BridgeV2PolicyBookRegistryABI from '../abi/bridgeV2/PolicyBookRegistry.json'
import BridgeV2PolicyQuoteABI from '../abi/bridgeV2/PolicyQuote.json'


// possible JSON loader solution to reduce SDK code base size
// let NexusDistributorABI2:any = null;
// async function _loadAllABIs(){
//   NexusDistributorABI2 = await (await fetch("https://kmettom.com/projects/bu/Distributors.json")).json();
// }

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
  const web3:any = global.user.ethNet.web3Instance;
  const distAbi:any = NexusDistributorABI.abi;
  return new web3.eth.Contract(distAbi, address );
}

function _getInsuraceDistributorsContract(address:string) : any {
  const web3:any = global.user.web3;
  const distAbi:any = InsuraceDistributorABI.abi;

  return new web3.eth.Contract(distAbi, address );
}

function _getInsurAceProductContract(address:string, _web3:any) : any {
  // const web3:any = global.user.web3;
  const distAbi:any = InsuraceProductABI.abi;

  return new _web3.eth.Contract(distAbi, address );
}

/**
 *
 *  Direct Call to Distributors Contracts
 *  "without BU protocol Layer"
 */
function _getNexusMasterContract(address:string) : any {
  const web3:any = global.user.ethNet.web3Instance;
  const distAbi:any = NexusMasterABI .abi;
  return new web3.eth.Contract(distAbi, address );
}
function _getNexusClaimsDataContract(address:string) : any {
  const web3:any = global.user.ethNet.web3Instance;
  const distAbi:any = NexusClaimsDataABI .abi;
  return new web3.eth.Contract(distAbi, address );
}
function _getNexusGatewayContract(address:string) : any {
  const web3:any = global.user.ethNet.web3Instance;
  const distAbi:any = NexusGatewayABI .abi;
  return new web3.eth.Contract(distAbi, address );
}
function _getNexusQuotationContract(address:string) : any {
  const web3:any = global.user.ethNet.web3Instance;
  const distAbi:any = NexusQuotationABI .abi;
  return new web3.eth.Contract(distAbi, address );
}
function _getNexusDistributor(address:string) : any {
  const web3:any = global.user.ethNet.web3Instance;
  const distAbi:any = DistributorNexusABI .abi;
  return new web3.eth.Contract(distAbi, address );
}

function _getInsuraceDistributor(address:string, _web3:any) : any {
  const distAbi:any = ICoverABI.abi;
  return new _web3.eth.Contract(distAbi, address );
}

function _getInsurAceCoverDataContract(address:string, _web3:any) : any {
  // const web3:any = global.user.web3;
  const distAbi:any = InsuraceCoverDataABI.abi;
  return new _web3.eth.Contract(distAbi, address );
}

const _getBridgeRegistryContract           =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgeRegistryContractABI.abi, address , web3);
const _getBridgePolicyBookRegistryContract =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgePolicyBookRegistryABI.abi, address , web3);
const _getBridgePolicyQuoteContract        =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgePolicyQuoteABI.abi, address , web3);
const _getBridgePolicyBookContract         =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgePolicyBookABI.abi, address , web3);
const _getBridgePolicyRegistryContract     =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgePolicyRegistryABI.abi, address , web3);

// BridgeV2
const _getBridgeV2RegistryContract          =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgeV2RegistryContractABI, address , web3);
const _getBridgeV2PolicyBookRegistryContract  =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgeV2PolicyBookRegistryABI, address , web3);
const _getBridgeV2PolicyQuoteContract         =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgeV2PolicyQuoteABI, address , web3);
const _getBridgeV2PolicyBookContract         =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgeV2PolicyQuoteABI, address , web3);


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

    _getBridgeV2RegistryContract,
    _getBridgeV2PolicyBookRegistryContract,
    _getBridgeV2PolicyQuoteContract,
    _getBridgeV2PolicyBookContract,

    _getInsuraceDistributorsContract,
    _getInsuraceDistributor,
    _getInsurAceCoverDataContract,
    _getInsurAceProductContract,
    _getNexusDistributorsContract,
    _getNexusDistributor,
    _getNexusQuotationContract,
    _getNexusGatewayContract,
    _getNexusClaimsDataContract,
    _getNexusMasterContract,
    // _loadAllABIs

} ;
