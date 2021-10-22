import NexusDistributorABI from '../assets/abi/nexus/Distributor.json';
import NexusMasterABI from '../assets/abi/nexus/INXMaster.json';
import NexusStakingABI from '../assets/abi/nexus/IPooledStaking.json';
import NexusQuotationABI from '../assets/abi/nexus/IQuotationData.json';
import NexusGatewayABI from '../assets/abi/nexus/IGateway.json';
import NexusClaimsDataABI from '../assets/abi/nexus/IClaimsData.json';
import NexusPoolABI from '../assets/abi/nexus/IPool.json';
import IERC20ABI from '../assets/abi/IERC20Metadata.json';
import ERC20PermitABI from '../assets/abi/ERC20Permit.json';
import UniPairABI from '../assets/abi/IUniswapV2Pair.json';
import ContractsRegistryABI from '../assets/abi/ContractsRegistry.json';
import BrightStakingABI from '../assets/abi/BrightStaking';
import LiquidityMiningStakingABI from '../assets/abi/LiquidityMiningStaking';
import BridgeRegistryABI from '../assets/abi/bridge/IContractsRegistry.json';
import BridgePolicyBookRegistryABI from '../assets/abi/bridge/IPolicyBookRegistry.json';
import BridgePolicyQuoteABI from '../assets/abi/bridge/IPolicyQuote.json';
import BridgePolicyBookABI from '../assets/abi/bridge/IPolicyBook.json';
import BridgePolicyRegistryABI from '../assets/abi/bridge/IPolicyRegistry.json';
import BridgeBMICoverStakingABI from '../assets/abi/bridge/IBMICoverStaking.json';
import SetProtocolABI from '../assets/abi/setProtocol/setToken.json';
import BasicIssuanceModuleABI from '../assets/abi/setProtocol/basicIssuanceModule.json';
import InsuraceCoverABI from '../assets/abi/insurace/ICover.json';
import InsuraceCoverDataABI from '../assets/abi/insurace/ICoverData.json';
import InsuraceProductABI from '../assets/abi/insurace/IProduct.json';

const getContract = (abi, address, web3) =>
    new Promise((resolve, reject) => {
        const contractInstance = new web3.eth.Contract(abi.abi, address);
        if (contractInstance) {
            resolve(contractInstance);
        } else {
            reject('Can\'t get contact');
        }
    });

export const getNexusDistributorContract = (address, web3) => getContract(NexusDistributorABI, address, web3);
export const getNexusMasterContract = (address, web3) => getContract(NexusMasterABI, address, web3);
export const getNexusStakingContract = (address, web3) => getContract(NexusStakingABI, address, web3);
export const getNexusQuotationContract = (address, web3) => getContract(NexusQuotationABI, address, web3);
export const getNexusGatewayContract = (address, web3) => getContract(NexusGatewayABI, address, web3);
export const getNexusClaimsDataContract = (address, web3) => getContract(NexusClaimsDataABI, address, web3);
export const getNexusPool = (address, web3) => getContract(NexusPoolABI, address, web3);
export const getIERC20Contract = (address, web3) => getContract(IERC20ABI, address, web3);
export const getERC20PermitContract = (address, web3) => getContract(ERC20PermitABI, address, web3);
export const getUniPairContract = (address, web3) => getContract(UniPairABI, address, web3);
export const getContractsRegistryContract = (address, web3) => getContract(ContractsRegistryABI, address, web3);
export const getBrightStakingContract = (address, web3) => getContract(BrightStakingABI, address, web3);
export const getLiquidityMiningStakingContract = (address, web3) => getContract(LiquidityMiningStakingABI, address, web3);
export const getBridgeRegistryContract = (address, web3) => getContract(BridgeRegistryABI, address, web3);
export const getBridgePolicyBookRegistryContract = (address, web3) => getContract(BridgePolicyBookRegistryABI, address, web3);
export const getBridgePolicyQuoteContract = (address, web3) => getContract(BridgePolicyQuoteABI, address, web3);
export const getBridgePolicyBookContract = (address, web3) => getContract(BridgePolicyBookABI, address, web3);
export const getBridgePolicyRegistryContract = (address, web3) => getContract(BridgePolicyRegistryABI, address, web3);
export const getBridgeBMICoverStakingContract = (address, web3) => getContract(BridgeBMICoverStakingABI, address, web3);
export const getSetProtocolSetToken = (address, web3) => getContract(SetProtocolABI, address, web3);
export const getBasicIssuanceModule = (address, web3) => getContract(BasicIssuanceModuleABI, address, web3);
export const getInsurAceCoverContract = (address, web3) => getContract(InsuraceCoverABI, address, web3);
export const getInsurAceCoverDataContract = (address, web3) => getContract(InsuraceCoverDataABI, address, web3);
export const getInsurAceProductContract = (address, web3) => getContract(InsuraceProductABI, address, web3);
