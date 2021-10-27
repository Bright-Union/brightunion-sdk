/**

    THIS IS A BUSINESS LOGIC CLASS, SINCE ITS NOT AN OUTPUT OF THE PROTOCOL
    BUT A MIX OF ONCHAIN AND HTTP DATA.

    IF WE KEEP THE CONTRACT ACCESS OBJECT CALLS IN SEPARATE DIR AND USE THEM
    ONLY TO FORM THE CUSTOM LOGIC, TYPESCRIPT CAN GIVE US THE OOO APPROACH
    WE NEED, AS OPPOSED TO THE APP UI...

*/

// import NetConfig from '@/service/config/NetConfig';
// import NexusApi  from '@/service/distributorsApi/NexusApi';

import NexusApi from '../service/distributorsApi/NexusApi';
import InsuraceApi from '../service/distributorsApi/InsuraceApi';
import CatalogHelper from '../service/helpers/catalogHelper';

export async  function getCatalog(_web3:any): Promise<any[]> {

  const nexusCoverables =  await getNexusCoverables();
  const insuraceCoverables =  await getInsuraceCoverables(_web3);

  return Promise.all([nexusCoverables, insuraceCoverables]).then(() =>{
    const mergedCoverables = nexusCoverables.concat(insuraceCoverables);
    console.log(mergedCoverables , 'mergedCoverables');
    return mergedCoverables;
  })



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

  export async function getInsuraceCoverables(_web3:any) : Promise<object[]> {
    // const trustWalletAssets:object[] = await CatalogHelper.getTrustWalletAssets();

    return await InsuraceApi.fetchCoverables(_web3.networkId).then((data:object) => {

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
  getCatalog
}
