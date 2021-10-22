import {
    getBridgePolicyBookRegistryContract,
    getBridgeRegistryContract, getInsurAceCoverContract, getInsurAceCoverDataContract, getInsurAceProductContract,
    getNexusDistributorContract,
    getNexusMasterContract, getNexusQuotationContract,
} from '@/utils/getContract'
import {netById} from '@/store/network_config'

export const nexusDistributorContract = (web3) => {
    return getNexusDistributorContract(netById(web3.networkId).nexusDistributor, web3.web3Instance).then((distributor) => {
        return distributor;
    })
}

export const nexusQuotationContract = (web3) => {
    return getNexusDistributorContract(netById(web3.networkId).nexusDistributor, web3.web3Instance).then((distributor) => {
        return distributor.methods.master().call().then(masterAddress => {
            return getNexusMasterContract(masterAddress, web3.web3Instance).then((masterContract) => {
                return masterContract.methods.getLatestAddress(web3.web3Instance.utils.asciiToHex('QD')).call().then((quotationAddress) => {
                    return getNexusQuotationContract(quotationAddress, web3.web3Instance).then(async (quotationContract) => {
                        return quotationContract;
                    });
                })
            })
        })
    })
}

export const bridgePolicyBookRegistryContract = (web3) => {
    return getBridgeRegistryContract(netById(web3.networkId).bridgeRegistry, web3.web3Instance).then((registry) => {
        return registry.methods.getPolicyBookRegistryContract().call().then(policyBookRegistryAddr => {
            return getBridgePolicyBookRegistryContract(policyBookRegistryAddr, web3.web3Instance).then((policyBookRegistry) => {
                return policyBookRegistry;
            })
        })
    })
}

export const insuraceCoverDataContract = (web3) => {
    return getInsurAceCoverContract(netById(web3.networkId).insuraceCover, web3.web3Instance).then(insuraceCoverInstance => {
        return insuraceCoverInstance.methods.data().call().then(coverDataAddress => {
            return getInsurAceCoverDataContract(coverDataAddress, web3.web3Instance).then(coverDataInstance => {
                return coverDataInstance;
            })
        });
    })
}

export const insuraceProductContract = (web3) => {
    return getInsurAceCoverContract(netById(web3.networkId).insuraceCover, web3.web3Instance).then(insuraceCoverInstance => {
        return insuraceCoverInstance.methods.product().call().then(productAddress => {
            return getInsurAceProductContract(productAddress, web3.web3Instance).then(productInstance => {
                return productInstance;
            })
        })
    })
}
