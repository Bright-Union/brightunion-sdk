import BridgeHelper from './distributorsApi/BridgeHelper';
import NexusApi from './distributorsApi/NexusApi';
import InsuraceApi from './distributorsApi/InsuraceApi';
import CatalogHelper from './helpers/catalogHelper';
import {
  _getBridgeRegistryContract,
  _getBridgePolicyBookRegistryContract,
  _getBridgePolicyQuoteContract,
  _getBridgePolicyRegistryContract,

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
    let netSymbol = NetConfig.netById(global.user.networkId).symbol;
    catalogPromiseArray.push(getInsuraceCoverables(netSymbol))
  }
  if (CatalogHelper.availableOnNetwork(global.user.ethNet.networkId, 'BRIDGE_MUTUAL')) {
    catalogPromiseArray.push(getBridgeCoverables())
    catalogPromiseArray.push(getBridgeV2Coverables())
  }

  for (let net of global.user.web3Passive) {
     catalogPromiseArray.push(getInsuraceCoverables(net.symbol))
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
  let trustWalletAssets: { [key: string]: any } = {};
  trustWalletAssets = await CatalogHelper.getTrustWalletAssets();

  const bridgeRegistryAdd = NetConfig.netById( global.user.ethNet.networkId ).bridgeV2Registry;
  const BridgeContract = await _getBridgeV2RegistryContract(bridgeRegistryAdd, global.user.ethNet.web3Instance );

  return BridgeContract.methods.getPolicyBookRegistryContract().call().then(async (policyBookRegistryAddr:any) => {

    let BridgePolicyBookRegistryContract = await _getBridgeV2PolicyBookRegistryContract(policyBookRegistryAddr, global.user.ethNet.web3Instance );

    return BridgePolicyBookRegistryContract.methods.count().call().then((policyBookCounter:any) => {

      return BridgePolicyBookRegistryContract.methods.listWithStats(0, policyBookCounter).call()
      .then(({_policyBooksArr, _stats}:any) => {

        return BridgeHelper.catalogDataFormat(_stats, _policyBooksArr, trustWalletAssets);

      })

    })
  })

}

export async function getBridgeCoverables(): Promise<any[]> {
  let trustWalletAssets: { [key: string]: any } = {};
  trustWalletAssets = await CatalogHelper.getTrustWalletAssets();

  const bridgeRegistryAdd = NetConfig.netById( global.user.ethNet.networkId ).bridgeRegistry;

  const BridgeContract = await _getBridgeRegistryContract(bridgeRegistryAdd, global.user.ethNet.web3Instance );

  return BridgeContract.methods.getPolicyBookRegistryContract().call().then(async (policyBookRegistryAddr:any) => {

    let BridgePolicyBookRegistryContract = await _getBridgePolicyBookRegistryContract(policyBookRegistryAddr, global.user.ethNet.web3Instance );

    return BridgePolicyBookRegistryContract.methods.count().call().then((policyBookCounter:any) => {

      return BridgePolicyBookRegistryContract.methods.listWithStats(0, policyBookCounter).call()
      .then(({_policyBooksArr, _stats}:any) => {

        return BridgeHelper.catalogDataFormat(_stats, _policyBooksArr, trustWalletAssets);

        });
      });
    });

    // return await CatalogHelper.getBridgeCatalogTemp();
  }

export async function getNexusCoverables(): Promise<any[]> {

    return await NexusApi.fetchCoverables().then( (data:object) => {

      const coverablesArray: any  = [];
      for ( const [ key, value ] of Object.entries(data) ) {
        if ( value.deprecated ) {
          //skip deprecated
          continue;
        }

        coverablesArray.push(CatalogHelper.createCoverable({
          protocolAddress: key,
          nexusCoverable: key,
          logo: `https://app.nexusmutual.io/logos/${value.logo}`,
          name: value.name,
          type: CatalogHelper.commonCategory(value.type, 'nexus'),
          source: 'nexus',
          rawDataNexus: value,
        }))

      }
      return coverablesArray;

    })

  }

  export async function getInsuraceCoverables(netSymbol : string) : Promise<object[]> { // Daniel
  let trustWalletAssets: { [key: string]: any } = {};
    trustWalletAssets = await CatalogHelper.getTrustWalletAssets();
    return await InsuraceApi.fetchCoverables(netSymbol).then((data:object) => {

      const coverablesArray = [];
      for (const [key, value] of Object.entries(data)) {
        if (value.status !== 'Enabled') {
          continue;
        }
        let assetIndex: any = undefined;
        Object.keys(trustWalletAssets).find((k: string) => {
          if (trustWalletAssets[k].name && value.coingecko && trustWalletAssets[k].name.toUpperCase() == value.coingecko.token_id.toUpperCase()) {
            assetIndex = trustWalletAssets[k].logoURI;
          }
        });

        let logo: string = null;

        if(assetIndex && value.name !== 'Pendle'){
          logo = assetIndex;
        }else{
          let specialLogo:any = CatalogHelper.getSpecialLogoName(value.name);
            if(specialLogo){
              logo = specialLogo;
            }else{
              let name = value.name + ' '; // needed for V1 regex to match
              name = name.replace( '.' , "");
              name = name.replace( "(", "");
              name = name.replace( ")", "");
              name = name.replace(/V.[^0-9]/g, "");
              name = name.replace(/\s+/g, '')

              logo = `https://app.insurace.io/asset/product/${name}.png`
            }
        }

        coverablesArray.push(CatalogHelper.createCoverable({
            name: value.name.trim(),
            logo: logo,
            type: CatalogHelper.commonCategory(value.risk_type, 'insurace'),
            coingecko: value.coingecko,
            source: 'insurace',
            productId: value.product_id,
            ['stats_'+netSymbol]: { "capacityRemaining": value.capacity_remaining, "unitCost":value.unit_cost_yearly },
            netSymbol:netSymbol,
            rawDataInsurace: value,
          }))

        }
        return coverablesArray;
      })
    }



export default {
  getCatalog,
}
