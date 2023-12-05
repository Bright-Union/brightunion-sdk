import NetConfig from "../config/NetConfig";
import CatalogHelper from "../helpers/catalogHelper"
import {
    _getDistributorsContract,
    _getInsuraceDistributor,
    _getInsurAceCoverDataContract,
    _getInsurAceProductContract,

    _getBridgeV2RegistryContract,
    _getBridgeV2PolicyBookContract,
    _getBridgeV2PolicyRegistry,

    _getNexusDistributor,
    _getNexusV2CoverNFT,
    _getNexusV2ProductsV1,
    _getIERC20Contract,
    _getEaseContract, _getNexusV2CoverViewer,

} from "../helpers/getContract";
import {hexToUtf8, asciiToHex, fromWei} from 'web3-utils';
import EaseApi from "@/service/distributorsApi/EaseApi";
import UnslashedAPI from "@/service/distributorsApi/UnslashedAPI";
import UnoReAPI from "@/service/distributorsApi/UnoReAPI";
import RiskCarriers from "@/service/config/RiskCarriers";
import axios from "axios";


/**
 * Returns the total cover count owned by an address
 *
 * @remarks
 * Function to get total number of owned covers from an address
 *
 * @param _distributorName - Name of distributor in lower case
 * @param _owner
 * @param _isActive
 * @returns Number of total covers
 */

export async function getCoversCount(
    _distributorName: string,
    _ownerAddress: string,
    _isActive: boolean
): Promise<number> {

    if (global.user.ethNet.networkId == 1) {
        //ToDO - finish the logic of fetching Count from Distributors

    } else {

        return await _getDistributorsContract(global.user.web3)
            .methods
            .getCoversCount(
                _distributorName,
                _ownerAddress,
                _isActive)
            .call().then((_data: any) => {
                return _data;
            });
    }

}

/**
 * Return Covers  from owner's address of specified distributor.
 *
 * @remarks
 * Get active/inactive cover from user address
 *
 * @param web3
 * @param distributorName
 * @returns Cover Object
 */
export async function getCovers(
    _web3: any,
    _distributorName: string,
): Promise<any[]> {

    if (_distributorName == "insurace") {
        return getCoversInsurace(_web3);
    } else if (_distributorName == 'bridge') {
        return getCoversBridgeV2();
    } else if (_distributorName == 'nexus') {
        return getCoversNexus();
    } else if (_distributorName == 'ease') {
        return getCoversEase();
    } else if (_distributorName == 'unslashed') {
        return getCoversUnslashed();
    } else if (_distributorName == 'unore') {
        return getCoversUnoRe();
    }
}

export async function getCoversNexus(): Promise<any> {

    const distributor = await _getNexusDistributor(NetConfig.netById(global.user.ethNet.networkId).nexusDistributor);
    const coverNFT = await _getNexusV2CoverNFT(NetConfig.netById(global.user.ethNet.networkId).nexusV2CoverNFT);
    //const productsV1 = await _getNexusV2ProductsV1(NetConfig.netById(global.user.ethNet.networkId).nexusV2ProductsV1);

    //const countV1 = await distributor.methods.balanceOf(global.user.account).call();
    const countV2 = await coverNFT.methods.balanceOf(global.user.account).call();

    global.events.emit("covers", {itemsCount: Number(countV2)});
    let covers: any = [];

    //fetch covers bought from Nexus Distributor for V1
    //DEPRECATED

    /*for (let i = 0; i < Number(countV1); i++) {
        await distributor.methods.tokenOfOwnerByIndex(global.user.account, i).call().then ((tokenId:any) => {
            distributor.methods.getCover(global.user.account, tokenId, true, 5).call().then((cover:any) => {
                productsV1.methods.getNewProductId(cover.contractAddress).call().then((productId:any) => {
                    cover = {
                        ...cover,
                        'nexusProductId': productId,
                        'id': tokenId,
                        'source': 'distributor',
                        'risk_protocol': 'nexus',
                        'endTime': cover.validUntil,
                        'net': global.user.ethNet.networkId
                    }
                    global.events.emit("covers", {coverItem: cover});
                    covers.push(cover)
                })
            });
        });
    }*/

    // V2
    const coverViewer = await _getNexusV2CoverViewer(NetConfig.netById(global.user.ethNet.networkId).nexusV2CoverViewer);

    await axios.get(`https://eth-mainnet.g.alchemy.com/nft/v2/${NetConfig.netById(global.user.ethNet.networkId).alchemyApiKey}
  /getNFTs?contractAddresses[]=${coverNFT.options.address}&owner=${global.user.account}&withMetadata=true`)
        .then(async (response) => {
            const data:any = response.data;
            let tokenIds = data.ownedNfts.map((a:any) =>
                global.user.ethNet.web3Instance.utils.hexToNumber(a.id.tokenId));
            let coverObjs = await coverViewer.methods.getCovers(tokenIds).call();
            let i: number = 0;
            let nexusAssetsIds = RiskCarriers.NEXUS.assetsIds;
            for (let cover of coverObjs) {
                let lastSegment = cover.segments[cover.segments.length - 1];
                covers.push({
                    'id': tokenIds[i],
                    'nexusProductId': cover.productId,
                    'status': '0', //'active'
                    'coverAsset': Object.keys(nexusAssetsIds).find(key => nexusAssetsIds[key] === cover.coverAsset),
                    'coverAmount': lastSegment.amount,
                    'source': 'distributor',
                    'risk_protocol': 'nexus',
                    'coverPeriod': Number(lastSegment.period) / 3600 / 24,
                    'endTime': Number(lastSegment.start) + Number(lastSegment.period),
                    'net': global.user.ethNet.networkId
                })
                i++;
            }

        }).catch(error => {
            console.error(error)
        })

    return covers;

}

export async function getCoversInsurace(_web3: any): Promise<any> {

    let allCovers: any = [];
    const insuraceCoverInstance = await _getInsuraceDistributor(NetConfig.netById(_web3.networkId).insuraceCover, _web3.web3Instance);
    const coverDataAddress = await insuraceCoverInstance.methods.data().call()
    const coverDataInstance = await _getInsurAceCoverDataContract(coverDataAddress, _web3.web3Instance);
    const count = await coverDataInstance.methods.getCoverCount(_web3.account).call();

    global.events.emit("covers", {itemsCount: count});

    for (let coverId = 1; coverId <= Number(count); coverId++) {

        const expirationP = coverDataInstance.methods.getCoverEndTimestamp(_web3.account, coverId.toString()).call();
        const startTimeP = coverDataInstance.methods.getCoverBeginTimestamp(_web3.account, coverId.toString()).call();
        const amountP = coverDataInstance.methods.getCoverAmount(_web3.account, coverId.toString()).call();
        const currencyP = coverDataInstance.methods.getCoverCurrency(_web3.account, coverId.toString()).call();
        const statusP = coverDataInstance.methods.getAdjustedCoverStatus(_web3.account, coverId.toString()).call();

        const productId = await coverDataInstance.methods.getCoverProductId(_web3.account, coverId.toString()).call();
        const productAddress = await insuraceCoverInstance.methods.product().call();
        const product = await _getInsurAceProductContract(productAddress, _web3.web3Instance);
        const prodDetailsP = product.methods.getProductDetails(productId).call();

        let coverDataPromises = [expirationP, amountP, currencyP, statusP, prodDetailsP, startTimeP];

        await Promise.all(coverDataPromises).then((_data: any) => {

            const [expiration, amount, currency, status, prodDetails, startTime] = _data;
            let coverNameUnified = CatalogHelper.unifyCoverName(hexToUtf8(prodDetails['0']), 'insurace');

            let cover = {
                risk_protocol: 'insurace',
                contractName: coverNameUnified,
                coverType: hexToUtf8(prodDetails['1']),
                coverAmount: amount,
                coverAsset: currency,
                startTime: startTime,
                validUntil: expiration,
                endTime: expiration,
                status: status,
                net: _web3.networkId,
                rawData: prodDetails,
            }

            global.events.emit("covers", {coverItem: cover});

            allCovers.push(cover);

        });

    }

    return allCovers;
}

export async function getCoversBridgeV2(): Promise<any> {

    const policyRegistryAddr = await _getBridgeV2RegistryContract(NetConfig.netById(global.user.ethNet.networkId).bridgeV2Registry, global.user.ethNet.web3Instance).methods.getPolicyRegistryContract().call();
    const policyRegistry = await _getBridgeV2PolicyRegistry(policyRegistryAddr, global.user.ethNet.web3Instance)

    let trustWalletAssets: { [key: string]: any } = {};
    trustWalletAssets = await CatalogHelper.getTrustWalletAssets();

    const nPolicies = await policyRegistry.methods.getPoliciesLength(global.user.account).call();
    const activeInfos = await policyRegistry.methods.getPoliciesInfo(global.user.account, true, 0, nPolicies).call();
    const expiredInfos = await policyRegistry.methods.getPoliciesInfo(global.user.account, false, 0, nPolicies).call();
    // merge the arrays from both sets
    let mergedPolicyInfos = activeInfos._policiesArr.concat(expiredInfos._policies);
    let mergedPolicyBooks = activeInfos._policyBooksArr.concat(expiredInfos._policyBooksArr);
    let mergedPolicyStatuses = activeInfos._policyStatuses.concat(expiredInfos._policyStatuses);
    let policies = []

    let limit = parseInt(nPolicies);

    global.events.emit("covers", {itemsCount: limit});

    for (let i = 0; i < limit; i++) {
        if (mergedPolicyBooks[i] === '0x0000000000000000000000000000000000000000') {
            //Bridge BUG, means no actual policy info
            limit++;
            continue;
        }
        let policyBook = await _getBridgeV2PolicyBookContract(mergedPolicyBooks[i], global.user.ethNet.web3Instance);
        let policyBookinfo = await policyBook.methods.info().call();
        let claimStatus = mergedPolicyStatuses[i];

        let asset = trustWalletAssets[Object.keys(trustWalletAssets)
            .find(key => key.toLowerCase() === policyBookinfo._insuredContract.toLowerCase())];

        let coverNameUnified = CatalogHelper.unifyCoverName(asset ? asset.name : policyBookinfo._symbol, 'bridge');

        let cover = {
            risk_protocol: 'bridge',
            policyBookAddr: mergedPolicyBooks[i],
            status: claimStatus,
            coverAmount: mergedPolicyInfos[i].coverAmount,
            validUntil: mergedPolicyInfos[i].endTime,
            endTime: mergedPolicyInfos[i].endTime,
            premium: mergedPolicyInfos[i].premium,
            startTime: mergedPolicyInfos[i].startTime,
            name: coverNameUnified,
            net: global.user.ethNet.networkId
        }

        global.events.emit("covers", {coverItem: cover});

        policies.push(cover)
    }
    return policies;
}

export async function getCoversCountBridge(): Promise<any> {


    return [];
}

export async function getCoversEase(): Promise<any> {
    return await EaseApi.fetchCoverables()
        .then((data: any) => {
            let policies: any = []
            data.forEach(async (vault: any) => {
                let protocol = await _getIERC20Contract(vault.address);
                let instance = await _getEaseContract(vault.address);
                protocol.methods.balanceOf(global.user.account).call().then(async (balance: any) => {
                    if (balance > 0) {
                        let rcaValue = await instance.methods.rcaValue(balance, vault.liquidation_amount).call()
                        let convertedAmount = await instance.methods.uValue(rcaValue, vault.liquidation_amount, vault.percent_reserved).call()
                        vault.tokenBalance = fromWei(balance);
                        let cover = {
                            risk_protocol: 'ease',
                            status: 0,
                            coverAmount: convertedAmount,
                            vaultCurrency: vault.symbol,
                            coverAsset: vault.display_name,
                            validUntil: Date.now(),
                            endTime: Date.now(),
                            startTime: Date.now(),
                            name: CatalogHelper.unifyCoverName(vault.top_protocol, 'ease'),
                            net: global.user.ethNet.networkId,
                            instance: instance
                        }
                        global.events.emit("covers", {coverItem: cover});
                        policies.push(cover)
                    }
                })
            });
            return policies;
        })
}

export async function getCoversUnslashed(): Promise<any> {

    const activeCoversData = await UnslashedAPI.fetchCovers();
    let policies: any = [];

    for (var i = 0; i < activeCoversData.length; i++) {

        let cover = {
            risk_protocol: 'unslashed',
            status: 0,
            coverAmount: activeCoversData[i].coverage.userCoverBalance,
            coverAsset: "ETH",
            validUntil: activeCoversData[i].static.rolloverDate,
            endTime: activeCoversData[i].static.rolloverDate,
            startTime: false,
            name: CatalogHelper.unifyCoverName(activeCoversData[i].static.name, 'unlashed'),
            net: global.user.ethNet.networkId,
        }
        global.events.emit("covers", {coverItem: cover});
        policies.push(cover)
    }
    return policies;

}

export async function getCoversUnoRe(): Promise<any> {
    const activeCoversData = UnoReAPI.fetchCovers();
    return activeCoversData;
}

export default {
    getCovers,
    getCoversCount,
}
