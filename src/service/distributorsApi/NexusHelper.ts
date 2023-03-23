
import CatalogHelper from '../helpers/catalogHelper'


class NexusHelper {

  static async catalogDataFormat(_productsArr:any, _productNames:any) {

    let trustWalletAssets: { [key: string]: any } = {};
    trustWalletAssets = await CatalogHelper.getTrustWalletAssets();

    let policyBooksArray = [];
    for (let i = 0; i < _productsArr.length; i++) {
      if (_productsArr[i].isDeprecated) {
        continue;
      }
      const name = _productNames[i];
      let asset: any = undefined;
      Object.keys(trustWalletAssets).find((k: string) => {
        if (trustWalletAssets[k].name && trustWalletAssets[k].name.toUpperCase() == name.toUpperCase()) {
          asset = trustWalletAssets[k];
        }
      });

      let logo =  await CatalogHelper.getLogoUrl(name, name, 'nexus');

      let type = CatalogHelper.commonCategory(_productsArr[i].productType, 'nexus')
      let typeDescr = type ? type : 'protocol';

        policyBooksArray.push(CatalogHelper.createCoverable({
          nexusProductId: i,
          logo: logo,
          name: CatalogHelper.unifyCoverName(name, 'nexus' ),
          type: type,
          typeDescription: CatalogHelper.descriptionByCategory(typeDescr),
          chainListNexus: '', //TODO
          source: 'nexus',
        }))
      }

      return policyBooksArray;
  }


}

export default NexusHelper;
