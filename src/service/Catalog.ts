import BridgeHelper from './distributorsApi/BridgeHelper';
import NexusApi from './distributorsApi/NexusApi';
import InsuraceApi from './distributorsApi/InsuraceApi';
import CatalogHelper from './helpers/catalogHelper';
import {
  _getBridgeV2RegistryContract,
  _getBridgeV2PolicyBookRegistryContract,

} from './helpers/getContract';
import NetConfig from './config/NetConfig';
import GoogleEvents from './config/GoogleEvents';

export async function getCatalog(): Promise<any> {

  GoogleEvents.catalog();

  const catalogPromiseArray:any[] = [];

  if (CatalogHelper.availableOnNetwork(global.user.ethNet.networkId, 'NEXUS_MUTUAL')) {
    catalogPromiseArray.push(getNexusCoverables())
  }
  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'INSURACE')) {
    catalogPromiseArray.push(getInsuraceCoverables(global.user.networkId))
  }
  if (CatalogHelper.availableOnNetwork(global.user.ethNet.networkId, 'BRIDGE_MUTUAL')) {
    catalogPromiseArray.push(getBridgeV2Coverables())
  }

  for (let net of global.user.web3Passive) {
    catalogPromiseArray.push(getInsuraceCoverables(net.networkId))
  }

  return Promise.all(catalogPromiseArray)
  .then((_data: any) => {
    let allCoverables: any[] = [];

    for(let array of _data){
      if(array) {
        allCoverables = allCoverables.concat(array);
      }
    }

    const mergedCoverables:any[] =  CatalogHelper.mergeCoverables(allCoverables)
    return { sorted: mergedCoverables, unSorted: allCoverables };
  })

}

export async function getBridgeV2Coverables(): Promise<any[]> {

  if(!global.user.ethNet || !global.user.ethNet.networkId){
    return;
  }

  const bridgeRegistryAdd = NetConfig.netById(global.user.ethNet.networkId).bridgeV2Registry;
  const BridgeContract = await _getBridgeV2RegistryContract(bridgeRegistryAdd, global.user.ethNet.web3Instance );

  return BridgeContract.methods.getPolicyBookRegistryContract().call().then(async (policyBookRegistryAddr:any) => {

    let BridgePolicyBookRegistryContract = await _getBridgeV2PolicyBookRegistryContract(policyBookRegistryAddr, global.user.ethNet.web3Instance );

    return BridgePolicyBookRegistryContract.methods.count().call().then((policyBookCounter:any) => {

      return BridgePolicyBookRegistryContract.methods.listWithStats(0, policyBookCounter).call()
      .then( async ({_policyBooksArr, _stats}:any) => {
        const coverablesArray =  await BridgeHelper.catalogDataFormat(_stats, _policyBooksArr);
        global.events.emit("catalog" , { items: coverablesArray , distributorName:"bridge" , networkId: 1, itemsCount: coverablesArray.length } );
        return coverablesArray;
      })

    })
  })

}

export async function getNexusCoverables(): Promise<any[]> {

    return await NexusApi.fetchCoverables().then( async(data:object) => {

      const coverablesArray: any  = [];
      for ( const [ key, value ] of Object.entries(data) ) {
        if ( value.deprecated ) {
          //skip deprecated
          continue;
        }
        let type = CatalogHelper.commonCategory(value.type, 'nexus')
        let typeDescr = type ? type : 'protocol';

        let logo:any = await CatalogHelper.getLogoUrl(value.logo, key , 'nexus');

        coverablesArray.push(CatalogHelper.createCoverable({
          protocolAddress: key,
          nexusCoverable: key,
          logo: logo,
          name: value.name,
          type: type,
          typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
          source: 'nexus',
          rawDataNexus: value,
          chainListNexus: value.supportedChains
        }))

      }

      global.events.emit("catalog" , { items: coverablesArray , distributorName:"nexus" , networkId: 1, itemsCount: coverablesArray.length } );

      return coverablesArray;

    })

  }

  export async function getInsuraceCoverables(netId : string|number) : Promise<object[]> { // Daniel

    let netSymbol = NetConfig.netById(netId) ? NetConfig.netById(netId).symbol : false;
    if(!netSymbol) return [];

    return await InsuraceApi.fetchCoverables(netId).then( async (data:object) => {

      const coverablesArray = [];
      for (const [key, value] of Object.entries(data)) {
        if (value.status !== 'Enabled') {
          continue;
        }

        let logo:any = await CatalogHelper.getLogoUrl( value.name , null, 'insurace');

        let type = CatalogHelper.commonCategory(value.risk_type, 'insurace')
        let typeDescr = type ? type : 'protocol';

        coverablesArray.push(CatalogHelper.createCoverable({
            name: value.name.trim(),
            logo: logo,
            type: type,
            typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
            coingecko: value.coingecko,
            source: 'insurace',
            productId: value.product_id,
            ['stats_'+netSymbol]: { "capacityRemaining": value.capacity_remaining, "unitCost":value.unit_cost_yearly },
            netSymbol:netSymbol,
            rawDataInsurace: value,
            chainListInsurace: value.chain_type_list
          }))

        }

        global.events.emit("catalog" , { items: coverablesArray , distributorName:"insurace" , networkId: netId, itemsCount: coverablesArray.length } );

        return coverablesArray;
      })
    }



export default {
  getCatalog,
}
