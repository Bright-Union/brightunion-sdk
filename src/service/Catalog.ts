/**

    THIS IS A BUSINESS LOGIC CLASS, SINCE ITS NOT AN OUTPUT OF THE PROTOCOL
    BUT A MIX OF ONCHAIN AND HTTP DATA.

    IF WE KEEP THE CONTRACT ACCESS OBJECT CALLS IN SEPARATE DIR AND USE THEM
    ONLY TO FORM THE CUSTOM LOGIC, TYPESCRIPT CAN GIVE US THE OOO APPROACH
    WE NEED, AS OPPOSED TO THE APP UI...

*/


// import NetConfig from '@/service/config/NetConfig';
// import NexusApi  from '@/service/distributorsApi/NexusApi';

import NexusApi from '@/service/distributorsApi/NexusApi';
import InsuraceApi from '@/service/distributorsApi/InsuraceApi';
import CatalogHelper from '@/service/helpers/catalogHelper';

export async  function getCatalog(_web3:any): Promise<any[]> {

  const nexusCoverables =  await getNexusCoverables();
  const insuraceCoverables =  await getInsuraceCoverables(_web3);

  Promise.all([nexusCoverables, insuraceCoverables]).then(() =>{
    const mergedCoverables = nexusCoverables.concat(insuraceCoverables);

  })
  return [1,2];

}


export async function getNexusCoverables(): Promise<any[]> {

    return await NexusApi.fetchCoverables().then( (data:any) => {

      const coverablesArray: any  = [];
      for (const [key, value] of Object.entries(data)) {
        // if (value.deprecated) {
        //   //skip deprecated
        //   continue;
        // }
        coverablesArray.push(CatalogHelper.createCoverable({
          protocolAddress: key,
          nexusCoverable: key,
          // logo: `https://app.nexusmutual.io/logos/${value.logo}`,
          // name: value.name,
          // type: CatalogHelper.commonCategory(value.type, 'nexus'),
          source: 'nexus'
        }))

        return coverablesArray;
      }

    })

  }

  export async function getInsuraceCoverables(_web3:any) : Promise<any[]> {
    const trustWalletAssets = CatalogHelper.getTrustWalletAssets();

    return await InsuraceApi.fetchCoverables(_web3).then((data:any[]) => {
          const coverablesArray = [];
          for (const coverable of data) {
            if (coverable.status !== 'Enabled') {
              continue;
            }

            let asset = trustWalletAssets[Object.keys(trustWalletAssets).find(
              key => trustWalletAssets[key].symbol
              && coverable.coingecko
              && trustWalletAssets[key].symbol.toUpperCase() == coverable.coingecko.token_id.toUpperCase())];

            let logo = asset ? asset.logoURI : `https://app.insurace.io/asset/product/${coverable.name.replace(/\s+/g, '')}.png`
            coverablesArray.push(CatalogHelper.createCoverable({
              name: coverable.name.trim(),
              logo: logo,
              type: CatalogHelper.commonCategory(coverable.risk_type, 'insurace'),
              coingecko: coverable.coingecko,
              source: 'insurace',
              productId: coverable.product_id,
              stats: { "capacityRemaining": coverable.capacity_remaining, "unitCost":coverable.unit_cost_yearly }
            }))
          }
          return coverablesArray;
        })
  }

export default {
  getCatalog
}
