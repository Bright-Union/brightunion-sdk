// import NetConfig from '@/service/config/NetConfig';
// import NexusApi  from '@/service/distributorsApi/NexusApi';

import NexusApi from './distributorsApi/NexusApi';
import InsuraceApi from './distributorsApi/InsuraceApi';
import CatalogHelper from './helpers/catalogHelper';

export async function getCatalog(): Promise<any[]> {

  const nexusCoverables =  await getNexusCoverables();
  const insuraceCoverables =  await getInsuraceCoverables();
  const bridgeCoverables =  await getBridgeCoverables();

  return Promise.all([ nexusCoverables, insuraceCoverables, bridgeCoverables])
                .then(() => {
                    let mergedCoverables = nexusCoverables
                    .concat(insuraceCoverables)
                    .concat(bridgeCoverables);
                    return mergedCoverables;
                })
}

export async function getBridgeCoverables(): Promise<any[]> {
  // _web3.chainId = await global.user.web3.eth.getChainId();
 return await CatalogHelper.getBridgeCatalogTemp();
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

        return coverablesArray;
      }

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
