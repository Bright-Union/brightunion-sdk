import BridgeHelper from './distributorsApi/BridgeHelper';
import NexusApi from './distributorsApi/NexusApi';
import InsuraceApi from './distributorsApi/InsuraceApi';
import CatalogHelper from './helpers/catalogHelper';
import {
    _getBridgeV2RegistryContract,
    _getBridgeV2PolicyBookRegistryContract, _getNexusV2CoverContract,
    _getNexusV2CoverProducts

} from './helpers/getContract';
import NetConfig from './config/NetConfig';
import GoogleEvents from './config/GoogleEvents';
import EaseApi from "@/service/distributorsApi/EaseApi";
import UnslashedAPI from "@/service/distributorsApi/UnslashedAPI";
import UnoReAPI from "@/service/distributorsApi/UnoReAPI";
import TidalApi from "@/service/distributorsApi/TidalApi";
import SolaceSDK from "@/service/distributorsApi/SolaceSDK";
import NexusHelper from "@/service/distributorsApi/NexusHelper";
import {errors} from "ethers";

export async function getCatalog(): Promise<any> {

    GoogleEvents.catalog();

    const catalogPromiseArray: any[] = [];

    if (CatalogHelper.availableOnNetwork(global.user.ethNet.networkId, 'NEXUS_MUTUAL')) {
        catalogPromiseArray.push(getNexusV2Coverables())
    }
    if (CatalogHelper.availableOnNetwork(global.user.networkId, 'INSURACE')) {
        catalogPromiseArray.push(getInsuraceCoverables(global.user.networkId))
    }
    if (CatalogHelper.availableOnNetwork(global.user.ethNet.networkId, 'BRIDGE_MUTUAL')) {
        catalogPromiseArray.push(getBridgeV2Coverables())
    }

    // push EASE
    catalogPromiseArray.push(getEaseCoverables())

    // push UNSLASHED
    catalogPromiseArray.push(getUnslashedCoverables())

    // push UNORE
    catalogPromiseArray.push(getUnoReCoverables())

    // push TIDAL
    catalogPromiseArray.push(getTidalCoverables())

    // push SOLACE
    //catalogPromiseArray.push(getSolaceCoverables())

    for (let net of global.user.web3Passive) {
        catalogPromiseArray.push(getInsuraceCoverables(net.networkId))
    }

    return Promise.all(catalogPromiseArray)
        .then((_data: any) => {
            let allCoverables: any[] = [];

            for (let array of _data) {
                if (array) {
                    allCoverables = allCoverables.concat(array);
                }
            }

            const mergedCoverables: any[] = CatalogHelper.mergeCoverables(allCoverables)
            return {sorted: mergedCoverables, unSorted: allCoverables};
        })

}

export async function getBridgeV2Coverables(): Promise<any[]> {

    if (!global.user.ethNet || !global.user.ethNet.networkId) {
        return;
    }

    return [];

    /*const bridgeRegistryAdd = NetConfig.netById(global.user.ethNet.networkId).bridgeV2Registry;
    const BridgeContract = await _getBridgeV2RegistryContract(bridgeRegistryAdd, global.user.ethNet.web3Instance);

    return BridgeContract.methods.getPolicyBookRegistryContract().call().then(async (policyBookRegistryAddr: any) => {

        let BridgePolicyBookRegistryContract = await _getBridgeV2PolicyBookRegistryContract(policyBookRegistryAddr, global.user.ethNet.web3Instance);

        return BridgePolicyBookRegistryContract.methods.count().call().then((policyBookCounter: any) => {

            return BridgePolicyBookRegistryContract.methods.listWithStats(0, policyBookCounter).call()
                .then(async ({_policyBooksArr, _stats}: any) => {
                    const coverablesArray = await BridgeHelper.catalogDataFormat(_stats, _policyBooksArr);
                    global.events.emit("catalog", {
                        items: coverablesArray,
                        distributorName: "bridge",
                        networkId: 1,
                        itemsCount: coverablesArray.length
                    });
                    return coverablesArray;
                })

        })
    })*/

}

export async function getNexusV2Coverables(): Promise<any[]> {
    if (!global.user.ethNet || !global.user.ethNet.networkId) {
        return;
    }
    const nexusV2CoverProductsAddr = NetConfig.netById(global.user.ethNet.networkId).nexusV2CoverProducts;
    const NexusV2CoverProductsContract = await _getNexusV2CoverProducts(nexusV2CoverProductsAddr, global.user.ethNet.web3Instance);
    return NexusV2CoverProductsContract.methods.getProducts().call().then(async (products: any) => {
        const productNames:any = [];
        for (let i = 0; i < products.length; i++) {
            await NexusV2CoverProductsContract.methods.getProductName(i).call()
                .then((prodName: any) => {
                    productNames.push(prodName);
                })
        }
        return NexusHelper.catalogDataFormat(products, productNames).then(productsArray => {
            global.events.emit("catalog", {items: productsArray, distributorName: "nexus", networkId: 1, itemsCount: products.length});
            return productsArray;
        });
    })
}

export async function getInsuraceCoverables(netId: string | number): Promise<object[]> {
    let netSymbol = NetConfig.netById(netId) ? NetConfig.netById(netId).symbol : false;
    if (!netSymbol) return [];

    return [];

    /*return await InsuraceApi.fetchCoverables(netId).then(async (data: object) => {

        const coverablesArray = [];
        for (const [key, value] of Object.entries(data)) {
            if (value.status !== 'Enabled') {
                continue;
            }

            let logo: any = await CatalogHelper.getLogoUrl(value.image_urls[0], null, 'insurace');

            let type = CatalogHelper.commonCategory(value.risk_type, 'insurace')
            let typeDescr = type ? type : 'protocol';
            coverablesArray.push(CatalogHelper.createCoverable({
                name: CatalogHelper.unifyCoverName(value.name.trim(), 'insurace'),
                logo: logo,
                type: type,
                typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
                coingecko: value.coingecko,
                source: 'insurace',
                productId: value.product_id,
                ['stats_' + netSymbol]: {"capacityRemaining": value.capacity_remaining, "unitCost": value.unit_cost_yearly},
                netSymbol: netSymbol,
                rawDataInsurace: value,
                chainListInsurace: value.chain_type_list
            }))
        }

        global.events.emit("catalog", {items: coverablesArray, distributorName: "insurace", networkId: netId, itemsCount: coverablesArray.length});

        return coverablesArray;
    })
        .catch(error => {
            console.error('Couldn\'t load InsurAce Covers');
            return [];
        });*/
}

export async function getEaseCoverables() {
    return await EaseApi.fetchCoverables()
        .then(async (data: any) => {
            const coverablesArray: any = [];
            data.forEach((item: any) => {
                const protocolName = item.top_protocol;
                const type = CatalogHelper.commonCategory(item.protocol_type, 'ease')
                const typeDescr = type ? type : 'protocol';
                try {
                    coverablesArray.push(CatalogHelper.createCoverable({
                        protocolAddress: item.address,
                        name: CatalogHelper.unifyCoverName(protocolName, 'ease'),
                        source: 'ease',
                        logo: item.icon,
                        rawDataEase: item,
                        type: type,
                        typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
                        stats: {
                            "capacityRemaining": item.remaining_capacity,
                            "unitCost": item.token.apy,
                            "priceETH": item.token.priceETH,
                            "priceUSD": item.token.priceUSD
                        }
                    }))
                } catch(error) {
                    console.warn('Couldn\'t create a coverable from Ease object');
                };
            })
            global.events.emit("catalog", {items: coverablesArray, distributorName: "ease", networkId: 1, itemsCount: coverablesArray.length});
            return coverablesArray;
        })
        .catch(error => {
            console.warn('Couldn\'t load Ease Covers');
            return [];
        });
}

export async function getUnslashedCoverables() {
    return Promise.resolve([]);
    /*return await UnslashedAPI.fetchCoverables()
        .then((data: any) => {
            const coverablesArray: any = [];

            let cover = data.BasketMarket ? data.BasketMarket.data : [];
            let coverArr = Object.values(cover);

            coverArr.forEach(async (item: any) => {
                const protocolName = item.static.name;
                let type = CatalogHelper.commonCategory(item.static.type, 'unslashed');
                const typeDescr = type ? type : 'protocol';
                let logo: any = await CatalogHelper.getLogoUrl(protocolName, null, 'unslashed');
                if (!item.static.hide) {
                    coverablesArray.push(CatalogHelper.createCoverable({
                        protocolAddress: item.static.address,
                        name: CatalogHelper.unifyCoverName(protocolName, 'unslashed'),
                        source: 'unslashed',
                        logo: logo,
                        rawDataUnslashed: item,
                        type: type,
                        typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
                        stats: {}
                    }))
                }
            })
            global.events.emit("catalog", {
                items: coverablesArray,
                distributorName: "unslashed",
                networkId: 1,
                itemsCount: coverablesArray.length
            });
            return coverablesArray;
        })
        .catch(error => {
            console.error('Couldn\'t load Unslashed Covers');
            return [];
        });*/
}

export async function getUnoReCoverables() {

    return Promise.resolve([]);

    /*return await UnoReAPI.fetchCoverables()
        .then((data: any) => {
            const coverablesArray: any = [];
            data.data.data.forEach(async (item: any) => {
                let type = CatalogHelper.commonCategory(item.category, 'unore')
                const typeDescr = type ? type : 'protocol';
                let logo: any = await CatalogHelper.getLogoUrl(item.name, null, 'unore');
                coverablesArray.push(CatalogHelper.createCoverable({
                    protocolAddress: item.address,
                    name: CatalogHelper.unifyCoverName(item.name, 'unore'),
                    source: 'unore',
                    logo: logo,
                    rawDataUnore: item,
                    type: type,
                    chainListUnore: item.chains,
                    typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
                    stats: {}
                }))
            })
            global.events.emit("catalog", {items: coverablesArray, distributorName: "unore", networkId: 1, itemsCount: coverablesArray.length});
            return coverablesArray;
        })
        .catch(error => {
            console.error('Couldn\'t load UnoRe Covers');
            return [];
        });
    ;*/
}

export async function getTidalCoverables() {

    return Promise.resolve([]);

    /*return await TidalApi.fetchCoverables()
        .then(async (data: any) => {
            const coverablesArray: any = [];
            data.forEach((item: any) => {
                let type = CatalogHelper.commonCategory(item.category, 'tidal')
                const typeDescr = type ? type : 'protocol';
                const logoData = {url: `https://app.tidal.finance/assets/images/a${item.index + 1}.png`}
                // if(item.price > 0 && item.token !== "0x0000000000000000000000000000000000000000") {
                coverablesArray.push(CatalogHelper.createCoverable({
                    protocolAddress: item.address,
                    name: CatalogHelper.unifyCoverName(item.name, 'tidal'),
                    source: 'tidal',
                    logo: logoData,
                    type: type,
                    typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
                    rawDataTidal: item,
                    chainListTidal: ['Polygon'],
                    stats: {
                        capacity: item.sellerBalance
                    }
                }))
                // }
            })
            global.events.emit("catalog", {items: coverablesArray, distributorName: "tidal", networkId: 1, itemsCount: coverablesArray.length});
            return coverablesArray;
        })
        .catch(error => {
            console.error('Couldn\'t load Tidal Covers');
            return [];
        });*/
}

export async function getSolaceCoverables() {
    return await SolaceSDK.getCoverables()
        .then((data: any) => {
            const coverablesArray: any = [];
            // if(data.protocols.length > 0) {
            if (data.length > 0) {
                // data.protocols.forEach((item:any) => {
                data.forEach(async (item: any) => {
                    const name = item.appId.charAt(0).toUpperCase() + item.appId.slice(1)
                    let specialLogo: any = await CatalogHelper.getLogoUrl(item.appId, null, 'solace');
                    coverablesArray.push(CatalogHelper.createCoverable({
                        protocolAddress: null,
                        name: CatalogHelper.unifyCoverName(name, 'solace'),
                        source: 'solace',
                        logo: specialLogo,
                        rawDataSolace: item,
                        chainListSolace: ['Ethereum', 'Polygon', 'Fantom', 'Aurora'],
                        stats: {
                            capacity: 0 // could be fetched from the contract
                        }
                    }))
                })
                global.events.emit("catalog", {items: coverablesArray, distributorName: "solace", networkId: 1, itemsCount: coverablesArray.length});
                return coverablesArray;
            } else return [];

        })
        .catch(error => {
            console.error('Couldn\'t load Solace Covers');
            return [];
        });
}


export default {
    getCatalog,
}
