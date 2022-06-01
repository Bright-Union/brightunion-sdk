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
import EaseContractABI from '../abi/ease/EaseContract.json';
import PermitContractABI from '../abi/ease/PermitContract.json';

// BridgeV2
import BridgeV2RegistryContractABI from '../abi/bridgeV2/ContractRegistry.json'
import BridgeV2PolicyBookRegistryABI from '../abi/bridgeV2/PolicyBookRegistry.json'
import BridgeV2PolicyRegistryABI from '../abi/bridgeV2/PolicyRegistry.json'
import BridgeV2PolicyQuoteABI from '../abi/bridgeV2/PolicyQuote.json'
import BridgeV2PolicyBookFacadeABI from '../abi/bridgeV2/PolicyBookFacade.json'
import BridgeV2PolicyBookABI from '../abi/bridgeV2/PolicyBook.json'
import BridgeV2DistributorABI from '../abi/bridgeV2/BridgeDistributorV2.json'


// possible JSON loader solution to reduce SDK code base size
// let NexusDistributorABI2:any = null;
// async function _loadAllABIs(){
//   NexusDistributorABI2 = await (await fetch("https://kmettom.com/projects/bu/Distributors.json")).json();
// }

/**
 *    "Distributors"
 *    Get Contracts from Bright Union Protocol
 *  */
function _getDistributorsContract(_web3:any) : any {
  const address: string = global.user.brightProtoAddress;
  const distAbi:any = DistributorsABI.abi;
  return new _web3.eth.Contract(distAbi, address );
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

function _getEaseContract(address:string) : any {
  const web3:any = global.user.ethNet.web3Instance;
  const distAbi:any = EaseContractABI.abi;
  return new web3.eth.Contract(distAbi, address );
}

function _getPermitContract(address:string) : any {
  const web3:any = global.user.ethNet.web3Instance;
  const distAbi:any = PermitContractABI.abi;
  return new web3.eth.Contract(distAbi, address );
}

// BridgeV2
const _getBridgeV2RegistryContract          =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgeV2RegistryContractABI, address , web3);
const _getBridgeV2PolicyBookRegistryContract  =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgeV2PolicyBookRegistryABI, address , web3);
const _getBridgeV2PolicyQuoteContract         =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgeV2PolicyQuoteABI, address , web3);
const _getBridgeV2PolicyBookContract         =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgeV2PolicyBookABI, address , web3);
const _getBridgeV2PolicyBookFacade        =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgeV2PolicyBookFacadeABI, address , web3);
const _getBridgeV2PolicyRegistry        =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgeV2PolicyRegistryABI, address , web3);
const _getBridgeV2Distributor       =  (address:string,web3:any)  : any => new web3.eth.Contract(BridgeV2DistributorABI.abi, address , web3);


function _getIERC20Contract(address:any) {
    const web3:any = global.user.web3;
    const distAbi:any = IERC20ABI.abi;

    return new web3.eth.Contract(distAbi,address);
}

export  {
  _getDistributorsContract,
    _getIERC20Contract,

    _getBridgeV2RegistryContract,
    _getBridgeV2PolicyBookRegistryContract,
    _getBridgeV2PolicyRegistry,
    _getBridgeV2PolicyQuoteContract,
    _getBridgeV2PolicyBookContract,
    _getBridgeV2PolicyBookFacade,
    _getBridgeV2Distributor,

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
    _getEaseContract,
    _getPermitContract

    // _loadAllABIs

} ;
