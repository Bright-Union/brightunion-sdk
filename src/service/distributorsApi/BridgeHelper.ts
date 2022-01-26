
import CatalogHelper from '../helpers/catalogHelper'
import CurrencyHelper from '../helpers/currencyHelper';
import RiskCarriers from '../config/RiskCarriers';
import { toWei, hexToBytes, numberToHex } from "web3-utils"


class BridgeHelper {

  static catalogDataFormat(_stats :any, _policyBooksArr:any, trustWalletAssets:any ) {

    let policyBooksArray = [];
    for (let i = 0; i < _stats.length; i++) {
      if (!_stats[i].whitelisted) {
        continue;
      }
      let asset: any = undefined;
      Object.keys(trustWalletAssets).find((key) => {
        if (key === _stats[i].insuredContract) {
          asset = trustWalletAssets[key];
        }
      });
      let logo: string = null;
      const name = asset ? asset.name : _stats[i][0]
      logo = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${_stats[i].insuredContract}/logo.png`;
      const missedLogos: any = [
        { name: '0.exchange'},
        { name: 'Keeper DAO'},
        { name: 'Universe.XYZ'},
        { name: 'Alchemix'},
        { name: 'Anchor Protocol'}
      ];
      let missedLogoName = missedLogos.find((i:any) => i.name == name)
      if(missedLogoName) {
        let specialLogo:any = CatalogHelper.getSpecialLogoName(missedLogoName.name);
        logo = specialLogo
      }

        policyBooksArray.push(CatalogHelper.createCoverable({
          bridgeProductAddress: _policyBooksArr[i],
          bridgeCoverable: _stats[i].insuredContract,
          protocolAddress: _stats[i].insuredContract,
          bridgeAPY: Number(_stats[i].APY) / (10 ** 5),
          logo: logo,
          name: name,
          type: CatalogHelper.commonCategory(_stats[i].contractType, 'bridge'),
          source: 'bridge',
          rawDataBridge: _stats[i],
          // stats: _stats,
        }))
      }

      return policyBooksArray;
  }

  static preQuoteDataFormat(_amount : any, _currency : any, _period: any ) {

    let amountInWei:any = toWei(_amount.toString(), 'ether');
    let initialBridgeCurrency: any = "USD"
    let currency = _currency;

    if (currency === 'ETH') {
      amountInWei = CurrencyHelper.eth2usd(amountInWei);
      initialBridgeCurrency = 'ETH';
    }
    currency = RiskCarriers.BRIDGE.fallbackQuotation;

    const bridgeEpochs = Math.min(52, Math.ceil(Number(_period) / 7));

    return {amountInWei, currency, bridgeEpochs, initialBridgeCurrency};

    // let quote:any = {}

  }


}

export default BridgeHelper;
