import axios from 'axios';
import * as _ from  "lodash";

const bridge_nexus_insurace_categories : string[][] = [
    // BRIDGE CATEGORY, NEXUS CATEGORY, INSURACE, COMMON CATEGORY, DESCRIPTION
    ['0' /*CONTRACT*/, 'protocol', 'Smart Contract Vulnerability', 'protocol', 'Protocol hack and failure'],
    ['2', /*SERVICE*/ 'custodian', '', 'custodian', 'Custodian cover'],
    ['1' /*STABLECOIN*/, '', 'Stablecoin De-Peg', 'stable', 'Stable token de-pegging'],
    ['', 'token', '', 'yield', 'Yield de-pegging'],
    ['3' /*EXCHANGE*/, 'custodian', 'Custodian Risk', 'custodian'],
    ['' , '', 'IDO Event Risk', 'ido', 'IDO Event Risk'],
    ['' , '', 'Bundled Cover', 'bundled', 'Bundled cover'],
];

const CUSTOM_BRIDGE_PROTOCOLS = {
    '0xF0939011a9bb95c3B791f0cb546377Ed2693a574': {
        // logoURI: zeroExchange,
        name: '0.exchange'
    },
    '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9': {
        // logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
        name: 'Aave'
    },
    '0x0000000000000000000000000000000000000001': {
        // logoURI: anchor,
        name: 'Anchor Protocol'
    },
    '0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF': {
        // logoURI: alchemix,
        name: 'Alchemix'
    },
    '0xa1faa113cbE53436Df28FF0aEe54275c13B40975': {
        // logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa1faa113cbE53436Df28FF0aEe54275c13B40975/logo.png',
        name: 'Alpha Token'
    },
    '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C': {
        // logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C/logo.png',
        name: 'Bancor'
    },
    '0x0391D2021f89DC339F60Fff84546EA23E337750f': {
        // logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0391D2021f89DC339F60Fff84546EA23E337750f/logo.png',
        name: 'BarnBridge'
    },
    '0x3472A5A71965499acd81997a54BBA8D852C6E53d': {
        // logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x3472A5A71965499acd81997a54BBA8D852C6E53d/logo.png',
        name: 'BadgerDAO'
    },
    '0xf16e81dce15B08F326220742020379B855B87DF9': {
        // logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xf16e81dce15B08F326220742020379B855B87DF9/logo.png',
        name: 'IceToken'
    },
    '0x903bef1736cddf2a537176cf3c64579c3867a881': {
        // logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x903bef1736cddf2a537176cf3c64579c3867a881/logo.png',
        name: 'ICHI'
    },
    '0xfA5047c9c78B8877af97BDcb85Db743fD7313d4a': {
        // logoURI: keeper,
        name: 'Keeper DAO'
    },
    '0x808507121b80c02388fad14726482e061b8da827': {
        // logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x808507121b80c02388fad14726482e061b8da827/logo.png',
        name: 'Pendle'
    },
    '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2': {
        // logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png',
        name: 'Sushi'
    },
    '0x618679dF9EfCd19694BB1daa8D00718Eacfa2883': {
        // logoURI: universe,
        name: 'Universe.XYZ'
    },
    '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984': {
        // logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
        name: 'Uniswap'
    },
    '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e': {
        // logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/logo.png',
        name: 'Yearn Finance (all vaults)'
    },
}

class CatalogHelper {

  public static CreateCoverable(obj:any) {
    return {
      //Bridge
      bridgeCoverable: obj.bridgeCoverable,
      bridgeProductAddress: obj.bridgeProductAddress,                     // address of Bridge contract
      bridgeAPY: obj.bridgeAPY,                                           // staking APY is available for Bridge
      //Nexus
      nexusCoverable: obj.nexusCoverable,
      //InsurAce
      coingecko: obj.coingecko,
      productId: obj.productId,// underlying token on Coingecko
      stats: obj.stats,
      //Common
      source: obj.source,                                                 // holds the 'initial source' of this object.
      // Can be either Bridge | Nexus | InsurAce
      protocolAddress: obj.protocolAddress,
      logo: obj.logo,
      name: obj.name,
      type: obj.type,
      availableCounter: 1,                                                 //field will be increased if similar products found
    };
  }


  public static CommonCategory (category:string, provider:string) {
    try{
      if (provider === 'nexus') {
        return bridge_nexus_insurace_categories.find((cat) => {return cat[1] === category[3]});
      } else if (provider === 'bridge') {
        return bridge_nexus_insurace_categories.find((cat) => {cat[0] === category[3]});
      } else if (provider === 'insurace') {
        return bridge_nexus_insurace_categories.find((cat) => {cat[2] === category[3]});
      } else {
        return '';
      }
    } catch (e){ console.error(`Can't map ${category} from provider ${provider}`, e); }
  }


  public static getTrustWalletAssets () {
    let url = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/tokenlist.json"
    axios({ method: "GET", "url": url }).then( (result:any) => {
      let assets = _.reduce(result.data.tokens, (dict:any, token) => {
        dict[token.address] = token
        return dict
      }, {})
      return {...assets, ...CUSTOM_BRIDGE_PROTOCOLS};
    })
    // .catch((error:object) => {
      //   console.error('could not load trustwallet assets', error);
      // })
  }


}


export default CatalogHelper
