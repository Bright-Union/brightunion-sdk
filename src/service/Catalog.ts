// import NetConfig from '@/service/config/NetConfig';
// import NexusApi  from '@/service/distributorsApi/NexusApi';

import NexusApi from './distributorsApi/NexusApi';
import InsuraceApi from './distributorsApi/InsuraceApi';
import CatalogHelper from './helpers/catalogHelper';
import {
  _getBridgeRegistryContract,
  _getBridgePolicyBookRegistryContract,
  _getBridgePolicyQuoteContract,
  _getBridgePolicyBookContract,
  _getBridgePolicyRegistryContract,
} from './helpers/getContract';
import NetConfig from './config/NetConfig';


export async function getCatalog(): Promise<any> {

  const catalogPromiseArray:any[] = [];

  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'NEXUS_MUTUAL')) {
    catalogPromiseArray.push(getNexusCoverables())
  }
  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'INSURACE')) {
    catalogPromiseArray.push(getInsuraceCoverables())
  }

  if (CatalogHelper.availableOnNetwork(global.user.networkId, 'BRIDGE_MUTUAL')) {
    catalogPromiseArray.push(getBridgeCoverables())
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
    return { sorted: mergedCoverables, unSrted: allCoverables };
  })

}

export async function getBridgeCoverables(): Promise<any[]> {

  const chainId = await global.user.web3.eth.getChainId();
  const bridgeRegistryAdd = NetConfig.netById( chainId ).bridgeRegistry;

  const BridgeContract = await _getBridgeRegistryContract(bridgeRegistryAdd,global.user.web3);

  return BridgeContract.methods.getPolicyBookRegistryContract().call().then(async (policyBookRegistryAddr:any) => {

    let BridgePolicyBookRegistryContract = await _getBridgePolicyBookRegistryContract(policyBookRegistryAddr,global.user.web3);

    return BridgePolicyBookRegistryContract.methods.count().call().then((policyBookCounter:any) => {

      return BridgePolicyBookRegistryContract.methods.listWithStats(0, policyBookCounter).call()
      .then(({_policyBooksArr, _stats}:any) => {

        const policyBooksArray = [];
        for (let i = 0; i < _stats.length; i++) {
          if (!_stats[i].whitelisted) {
            continue;
          }

          // let asset = state.trustWalletAssets[Object.keys(state.trustWalletAssets)
            // .find(key => key.toLowerCase() === _stats[i].insuredContract.toLowerCase())];
            // let logo = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${_stats[i].insuredContract}/logo.png`;

            let name = _stats[i][0]
            policyBooksArray.push(CatalogHelper.createCoverable({
              bridgeProductAddress: _policyBooksArr[i],
              bridgeCoverable: _stats[i].insuredContract,
              protocolAddress: _stats[i].insuredContract,
              bridgeAPY: Number(_stats[i].APY) / (10 ** 5),
              // logo: logo,
              name: name,
              type: CatalogHelper.commonCategory(_stats[i].contractType, 'bridge'),
              source: 'bridge',
            }))
          }

          return policyBooksArray;

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
          source: 'nexus'
        }))

      }
      return coverablesArray;

    })

  }

  export async function getInsuraceCoverables() : Promise<object[]> {
    // const trustWalletAssets:object[] = await CatalogHelper.getTrustWalletAssets();
    // const NetID = await global.user.web3.eth.getChainId();
    return await InsuraceApi.fetchCoverables().then((data:object) => {

      const coverablesArray = [];
      for (const [key, value] of Object.entries(data)) {
        if (value.status !== 'Enabled') {
          continue;
        }

        // let assetIndex:object = Object.keys(trustWalletAssets).find((k:object) => {
          //     console.log(typeof k , k)
          //     return  trustWalletAssets[k].symbol && value.coingecko  && trustWalletAssets[k].symbol.toUpperCase() == value.coingecko.token_id.toUpperCase()
          //   });

          // let asset:object = trustWalletAssets[0];
          // let logo:string = asset ? asset.logoURI : `https://app.insurace.io/asset/product/${value.name.replace(/\s+/g, '')}.png`

          coverablesArray.push(CatalogHelper.createCoverable({
            name: value.name.trim(),
            logo: null,
            type: CatalogHelper.commonCategory(value.risk_type, 'insurace'),
            coingecko: value.coingecko,
            source: 'insurace',
            productId: value.product_id,
            stats: { "capacityRemaining": value.capacity_remaining, "unitCost":value.unit_cost_yearly }
          }))

        }
        return coverablesArray;
      })
    }



export default {
  getCatalog,
}
