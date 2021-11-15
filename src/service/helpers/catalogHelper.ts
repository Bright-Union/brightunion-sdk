import axios from 'axios';
import * as _ from  "lodash";
// import {
//   _getBridgeRegistryContract,
//   _getBridgePolicyBookRegistryContract,
//   _getBridgePolicyQuoteContract,
//   _getBridgePolicyBookContract,
//   _getBridgePolicyRegistryContract,
// } from '../helpers/getContract';
import NetConfig from '../config/NetConfig';
import {hexToUtf8} from 'web3-utils';

const bridge_nexus_insurace = [
  // BRIDGE NAME, NEXUS NAME, INSURACE NAME, COMMON NAME
  ['88mph.app', '', '88mph', '88mph'],
  ['1INCH Token', '1Inch (DEX & Liquidity Pools)', '1Inch', '1Inch'],
  ['Aave', 'Aave V2', 'Aave V2', 'Aave V2'],
  ['Aave', 'Aave V1', '', 'Aave V1'],
  ['Anchor Protocol', 'Anchor Protocol', 'Anchor', 'Anchor'],
  ['Alchemix', 'Alchemix V1', '', 'Alchemix V1'],
  ['BadgerDAO', 'BadgerDAO', 'Badger Finance', 'BadgerDAO'],
  ['BarnBridge', 'Barnbridge Smart Yield V1', '', 'Barnbridge V1'],
  ['Compound', 'Compound V2', 'Compound V2', 'Compound V2'],
  ['Cream', 'C.R.E.A.M. V1', '', 'C.R.E.A.M.'],
  ['', 'Curve All Pools (incl staking)', 'Curve (All Pools)', 'Curve (All Pools)'],
  ['', 'DODO Exchange', 'DODO', 'DODO'],
  ['MakerDAO', 'MakerDAO MCD', 'MakerDAO MCD', 'MakerDAO'],
  ['', 'Pancakeswap V1', 'PancakeSwap', 'PancakeSwap'],
  ['Synthetix Network Token', 'Synthetix', '', 'Synthetix'],
  ['Sushi', 'SushiSwap V1', '', 'Sushi'],
  ['Uniswap', 'Uniswap V1', '', 'Uniswap V1'],
  ['Uniswap', 'Uniswap V2', 'Uniswap V2', 'Uniswap V2'],
  ['Uniswap', 'Uniswap V3', 'Uniswap V3', 'Uniswap V3'],
  ['','Convex Finance V1','Convex', 'Convex']
]


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

const CUSTOM_BRIDGE_PROTOCOLS : object = {
  '0xF0939011a9bb95c3B791f0cb546377Ed2693a574': {
    // logoURI: zeroExchange,
    name: '0.exchange'
  },
  '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9': {
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
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
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xa1faa113cbE53436Df28FF0aEe54275c13B40975/logo.png',
    name: 'Alpha Token'
  },
  '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C': {
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C/logo.png',
    name: 'Bancor'
  },
  '0x0391D2021f89DC339F60Fff84546EA23E337750f': {
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0391D2021f89DC339F60Fff84546EA23E337750f/logo.png',
    name: 'BarnBridge'
  },
  '0x3472A5A71965499acd81997a54BBA8D852C6E53d': {
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x3472A5A71965499acd81997a54BBA8D852C6E53d/logo.png',
    name: 'BadgerDAO'
  },
  '0xf16e81dce15B08F326220742020379B855B87DF9': {
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xf16e81dce15B08F326220742020379B855B87DF9/logo.png',
    name: 'IceToken'
  },
  '0x903bef1736cddf2a537176cf3c64579c3867a881': {
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x903bef1736cddf2a537176cf3c64579c3867a881/logo.png',
    name: 'ICHI'
  },
  '0xfA5047c9c78B8877af97BDcb85Db743fD7313d4a': {
    // logoURI: keeper,
    name: 'Keeper DAO'
  },
  '0x808507121b80c02388fad14726482e061b8da827': {
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x808507121b80c02388fad14726482e061b8da827/logo.png',
    name: 'Pendle'
  },
  '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2': {
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png',
    name: 'Sushi'
  },
  '0x618679dF9EfCd19694BB1daa8D00718Eacfa2883': {
    // logoURI: universe,
    name: 'Universe.XYZ'
  },
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984': {
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
    name: 'Uniswap'
  },
  '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e': {
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/logo.png',
    name: 'Yearn Finance (all vaults)'
  },
}

class CatalogHelper {

  public static quoteFromCoverable (_distributorName:string, _coverable:any, obj:any, stats:object) {
    return {
      distributorName: _distributorName,
      risk_protocol: _distributorName,
      name: _coverable.name,
      logoSrc: _coverable.logo,
      // rating: 4.5,
      amount: obj.amount,
      currency: obj.currency,
      period: obj.period,
      chain: obj.chain,
      chainId: obj.chainId,
      actualPeriod: obj.actualPeriod ? obj.actualPeriod : obj.period,
      protocol: _coverable,
      price: obj.price,
      pricePercent: obj.pricePercent,
      errorMsg: obj.errorMsg,
      cashBack: obj.cashBack,
      cashBackInWei: obj.cashBackInWei,
      estimatedGasPrice: obj.estimatedGasPrice,
      estimatedGasPriceCurrency: obj.estimatedGasPriceCurrency,
      estimatedGasPriceDefault: obj.estimatedGasPriceDefault,
      rawData: obj.response,
      stats: stats,
      quote: { // duplicate for test purposes
        name: _coverable.name,
        logoSrc: _coverable.logo,
        rating: 4.5,
        amount: obj.amount,
        currency: obj.currency,
        period: obj.period,
        chain: obj.chain,
        chainId: obj.chainId,
        actualPeriod: obj.actualPeriod ? obj.actualPeriod : obj.period,
        protocol: _coverable,
        price: obj.price,
        pricePercent: obj.pricePercent,
        responseObj: obj.response,
        errorMsg: obj.errorMsg,
        cashBack: obj.cashBack,
        cashBackInWei: obj.cashBackInWei,
        estimatedGasPrice: obj.estimatedGasPrice,
        estimatedGasPriceCurrency: obj.estimatedGasPriceCurrency,
        estimatedGasPriceDefault: obj.estimatedGasPriceDefault
      },
    }
  }

  public static createCoverable(obj:any) {
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

  public static createCoverItem(obj:any) {
    return {
      distributorName: obj.distributorName,
      contractName: obj.contractName,
      name: obj.name,
      logo: obj.logo,
      coverType: obj.coverType,
      coverAmount: obj.coverAmount,
      coverAsset: obj.coverAsset,
      endTime: obj.endTime,
      status: obj.status,
      net: obj.net,
      rawData: obj.response,
    };
  }


  public static commonCategory (category:string, provider:string) {
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


  public static getTrustWalletAssets (): Promise<object[]> {
    let url = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/tokenlist.json"
    return axios({ method: "GET", "url": url }).then( (result:any) => {
      let assets = _.reduce(result.data.tokens, (dict:any, token) => {
        dict[token.address] = token
        return dict
      }, {})
      const wallets : object[] = { ...assets, ...CUSTOM_BRIDGE_PROTOCOLS }
      return wallets;
    })
    // .catch((error:object) => {
      //   console.error('could not load trustwallet assets', error);
      // })
    }

      public static mergeCoverables(_catalog: any[]) : any[] {

        let coverablesNoDuplicates:any[] = [];
        let duplicateIndexes:any[] = [];
        for (let i = 0; i < _catalog.length; i++) { // compare every with every
          if (!duplicateIndexes.includes(i)) {
            let duplicates = 1;
            let mergedCoverableObject:any = {};
            for (let j = i + 1; j < _catalog.length; j++) {
              const mergedName = this.coverableDuplicate(_catalog[i], _catalog[j]);
              if (mergedName) {
                //duplicate found. merge the fields
                const mergedPair = _.mergeWith({}, _catalog[i], _catalog[j], (o, s) => _.isNull(s) ? o : s);
                mergedCoverableObject = _.mergeWith({}, mergedCoverableObject, mergedPair, (o, s) => _.isNull(s) ? o : s);

                mergedCoverableObject.availableCounter = ++duplicates;
                mergedCoverableObject.name = mergedName;
                duplicateIndexes.push(j)
              }
            }
            if (duplicates > 1) {
              coverablesNoDuplicates.push(mergedCoverableObject);
            } else {
              //no duplicate for it, leave it as is
              coverablesNoDuplicates.push(_catalog[i])
            }
          }
        }
        coverablesNoDuplicates = coverablesNoDuplicates.sort((first, second) => {
          var nameA = first.name.toUpperCase();
          var nameB = second.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });

        return coverablesNoDuplicates;


      }


      static coverableDuplicate (cov1:any, cov2:any) {

        if (cov1.name.toUpperCase() === cov2.name.toUpperCase()) {
          // name equals
          return cov1.name;
        } else if (cov1.protocolAddress && cov2.protocolAddress &&
          cov1.protocolAddress.toUpperCase() === cov2.protocolAddress.toUpperCase()){
            // BRIDGE address equals NEXUS address
            return cov1.name;
          }
          else if (cov1.source !== cov2.source){
            let cov1SourceNameIndex;
            if (cov1.source === 'bridge') {
              cov1SourceNameIndex = bridge_nexus_insurace.findIndex(element => element[0].toUpperCase() === cov1.name.toUpperCase())
            } else if(cov1.source === 'nexus') {
              cov1SourceNameIndex = bridge_nexus_insurace.findIndex(element => element[1].toUpperCase() === cov1.name.toUpperCase())
            } else if(cov1.source === 'insurace') {
              cov1SourceNameIndex = bridge_nexus_insurace.findIndex(element => element[2].toUpperCase() === cov1.name.toUpperCase())
            }
            if (cov1SourceNameIndex > -1) {
              let cov2SourceNameFound;
              if (cov2.source === 'bridge') {
                cov2SourceNameFound = bridge_nexus_insurace[cov1SourceNameIndex][0].toUpperCase() === cov2.name.toUpperCase();
              } else if(cov2.source === 'nexus') {
                cov2SourceNameFound = bridge_nexus_insurace[cov1SourceNameIndex][1].toUpperCase() === cov2.name.toUpperCase();
              } else if(cov2.source === 'insurace') {
                cov2SourceNameFound = bridge_nexus_insurace[cov1SourceNameIndex][2].toUpperCase() === cov2.name.toUpperCase();
              }
              if (cov2SourceNameFound) {
                //both found in custom mapping
                return bridge_nexus_insurace[cov1SourceNameIndex][3];
              } else {
                return;
              }
            } else {
              return;
            }
          } else {
            return;
          }
        }

        static availableOnNetwork(networkId:number, module:string) {

          return NetConfig.netById(networkId).modules.find(mod => mod === module);
        }


      }


      export default CatalogHelper
