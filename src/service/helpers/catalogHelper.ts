import axios from 'axios';
import * as _ from  "lodash";
import NetConfig from '../config/NetConfig';
import {hexToUtf8} from 'web3-utils';
// import * as Sentry from "@sentry/browser";


const bridge_nexus_insurace = [
  // BRIDGE NAME, NEXUS NAME, INSURACE NAME, EASE, UNSLASHED, UNORE, COMMON NAME
  ['88mph.app', '88mph', '88mph V2', '', '', '88mph.app', '88mph V2'],
  ['88mph.app', '88mph', '88mph V3', '', '', '88mph.app', '88mph V3'],
  ['1INCH Token', '1Inch (DEX & Liquidity Pools)', '1Inch', '', '', '1inch Network', '1Inch'],
  ['Aave', 'Aave V1', '', '', '', '', 'Aave V1'],
  ['Aave', 'Aave V2', 'Aave V2', 'aave', '', 'AAVE', 'Aave V2'],
  ['Balancer v1', 'Balancer v1', 'Balancer v1', 'Balancer v1', 'Balancer V1 & V2', 'Balancer', 'Balancer v1'],
  ['Balancer v2', 'Balancer v2', 'Balancer v2', 'Balancer v2', 'Balancer V1 & V2', 'Balancer', 'Balancer v2'],
  ['Anchor Protocol', 'Anchor Protocol', 'Anchor', '', '', '', 'Anchor'],
  ['', '', '', 'ANC + UST De-Peg', 'Anchor + UST Peg', '', 'ANC + UST De-Peg'],
  ['Alchemix', 'Alchemix V1', '', '', '', 'Alchemix', 'Alchemix V1'],
  ['BadgerDAO', 'BadgerDAO', 'Badger Finance', '', '', '', 'BadgerDAO'],
  ['BarnBridge', 'Barnbridge Smart Yield V1', '', '', '', '', 'Barnbridge V1'],
  ['Compound', 'Compound V2', 'Compound V2', 'Compound', 'Compound', 'Compound', 'Compound V2'],
  ['', 'Enzyme v3', 'Enzyme Finance', '', '', 'Enzyme Finance', 'Enzyme'],
  ['Cream', 'CREAM v1', '', '', '', 'Cream finance', 'C.R.E.A.M.'],
  ['', 'Curve All Pools (incl staking)', 'Curve (All Pools)', 'Curve', '', '', 'Curve (All Pools)'],
  ['', 'DODO Exchange', 'DODO', '', '', '', 'DODO'],
  ['Coinbase', '', 'Coinbase', '', 'Coinbase Exchange', '', 'Coinbase'],
  ['', 'Harvest Finance', 'Harvest Finance', '', 'Harvest', '', 'Harvest Finance'],
  ['Maker', 'MakerDAO MCD', 'MakerDAO MCD', '', 'Maker DAO', '', 'MakerDAO'],
  ['', 'Pancakeswap V1', 'PancakeSwap', '', '', '', 'PancakeSwap'],
  ['Perpetual', 'Perpetual Protocol', 'Perpetual Protocol', '', 'Perpetual Protocol', '', 'Perpetual Protocol'],
  ['bmiV2PendleFinanceCover', 'Pendle', "Pendle", '', '', '', "Pendle"],
  ['Synthetix Network Token', 'Synthetix', '', '', '', '', 'Synthetix'],
  ['Sushi', 'SushiSwap V1', '', 'SushiSwap', '', 'SushiSwap', 'Sushi'],
  ['Keeper DAO', 'Keeper DAO', 'KeeperDAO', '', '', '', 'KeeperDAO'],
  ['', 'Kyber (Katalyst)', 'Kyber', '', 'Kyber', 'Kyber Swap', 'Kyber'],
  ['', 'DyDx Perpetual', 'DyDx', '', '', '', 'DyDx'],
  ['', 'ETH 2.0 (deposit contract)', 'ETH 2.0', '', '', '', 'ETH 2.0'],
  ['', 'OlympusDAO', 'Olympus DAO', '', 'Olympus', '', 'Olympus DAO'],
  ['','Paraswap v1','', '', 'Paraswap', '', 'Paraswap'],
  ['','','UST De-Peg', '', 'UST Peg', '', 'UST De-Peg'],
  ['','','USDT De-Peg', '', 'USDT Peg', '', 'USDT De-Peg'],
  ['','','USDT De-Peg', '', 'USDT Peg', 'USDT', 'USDT De-Peg'],
  ['','','USDC De-Peg', '', '', 'USDC', 'USDC De-Peg'],
  ['','','MIM De-Peg', '', '', 'MIM', 'MIM De-Peg'],
  ['','UMA','UMA', '', '', 'UMA Protocol', 'UMA'],
  ['','Stake DAO','Stake DAO', '', '', 'StakeDAO', 'Stake DAO'],
  ['','','Frax Finance', '', '', 'FRAX', 'Frax Finance'],
  ['','','BUSD De-Peg', '', '', 'BUSD', 'BUSD De-Peg'],
  ['Spell Token', 'Abracadabra', 'Abracadabra.money', '', '', '', 'Abracadabra'],
  ['Uniswap', 'Uniswap V1', '', '', '', '', 'Uniswap V1'],
  ['Uniswap', 'Uniswap V2', 'Uniswap V2', '', 'Uniswap V2 & V3', 'Uniswap', 'Uniswap V2'],
  ['Uniswap', 'Uniswap V3', 'Uniswap V3', '', 'Uniswap V2 & V3', '', 'Uniswap V3'],
  ['','Convex Finance V1','Convex', 'Convex', '', 'Convex Finance', 'Convex'],
  ['IceToken','Popsicle Finance','', '', '', '', 'IceToken'],
  ['Yearn Finance (all vaults)','Yearn Finance (all vaults)','Yearn Finance (all vaults)', 'yearn', 'Yearn', 'Yearn Finance', 'Yearn Finance (all vaults)']
]


const bridge_nexus_insurace_categories : string[][] = [
  // BRIDGE CATEGORY, NEXUS CATEGORY, INSURACE, EASE, UNORE, COMMON CATEGORY, DESCRIPTION
  ['0' /*CONTRACT*/, 'protocol', 'Smart Contract Vulnerability', 'Lending Protocol', 'Lending', 'protocol', 'Protocol hack and failure'],
  ['2', /*SERVICE*/ 'custodian', '', '', '', 'custodian', 'Custodian cover'],
  ['1' /*STABLECOIN*/, '', 'Stablecoin De-Peg', '', 'Stablecoin', 'stable', 'Stable token de-pegging'],
  ['', 'token', '', 'Yield Aggregator', '', 'yield', 'Yield de-pegging'],
  ['3' /*EXCHANGE*/, 'custodian', '', '', '', 'Custodian Risk', 'custodian'],
  ['' , '', 'IDO Event Risk', '', '', 'ido', 'IDO Event Risk'],
  ['' , '', 'Bundled Cover', '', '', 'bundled', 'Bundled cover'],
  ['' , '', '', 'Decentralized Exchange', 'Dexes', 'exchange', 'Decentralized Exchange'],
];

const CUSTOM_BRIDGE_PROTOCOLS : object = {
  // '0x111111111117dC0aa78b770fA6A738034120C302': {
  //   name: '1Inch'
  // },
  '0xF0939011a9bb95c3B791f0cb546377Ed2693a574': {
    name: '0.exchange'
  },
  '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9': {
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
    name: 'Aave'
  },
  '0x0000000000000000000000000000000000000001': {
    name: 'Anchor Protocol'
  },
  '0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF': {
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

const catalogLogoLinks: any = [
  { name: "FODL Finance" , link:"https://files.insurace.io/public/asset/product/FodlFinance.png"},
  { name: "Vauld" , link:"https://files.insurace.io/public/asset/product/Vauld.png"},
  { name: "BUSD De-Peg" , link:"https://files.insurace.io/public/asset/product/BUSDDepeg.png"},
  { name: "Planet" , link:"https://files.insurace.io/public/asset/product/PlanetFinance.png"},
  { name: "Autobahn Network" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/7024.png"},
  { name: "AAVE V3" , link:"https://files.insurace.io/public/asset/product/AaveV2.png"},
  { name: "RAMP V2" , link:"https://files.insurace.io/public/asset/product/RampV2.png"},
  { name: "Unagii (Vaults)" , link:"https://files.insurace.io/public/asset/product/Unagii.png"},
  { name: "Eth 2.0" , link:"https://app.insurace.io/asset/product/Eth2.0.png"},
  { name: "Beefy" , link:"https://app.insurace.io/asset/product/BeefyFinance.png"},
  { name: "Babylons" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/10714.png"},
  { name: "Berry Data" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/8483.png"},
  { name: "Bot Planet " , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/16238.png"},
  { name: "Alchemix V1" , link:"https://app.bridgemutual.io/assets/icons/coins/Alchemix.webp"},
  { name: "Anchor" , link:"https://app.insurace.io/asset/product/AnchorProtocol.png"},
  { name: "Arcade Network" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/13933.png"},
  { name: "Alpha Token" , link:"https://assets.coingecko.com/coins/images/12738/large/AlphaToken_256x256.png?1617160876"},
  { name: "Aldrin DEX" , link:"https://app.insurace.io/asset/product/Aldrin.png"},
  { name: "ANC + UST De-Peg" , link:"https://app.insurace.io/asset/product/AnchorProtocol.png"},
  { name: "ANC + MIR + UST De-Peg" , link:"https://app.insurace.io/asset/product/AnchorProtocol.png"},
  { name: "BitMEX" , link:"https://app.unslashed.finance/logos/bitmex@2x.png"},
  { name: "Convex" , link:"https://app.insurace.io/asset/product/ConvexFinance.png"},
  { name: "Curate" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/7942.png"},
  { name: "DAO Maker" , link:"https://icons.llama.fi/dao-maker.jpg"},
  { name: "DAI" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png"},
  { name: "Gamerse" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/11086.png"},
  { name: "Fortknoxster" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/3241.png"},
  { name: "Fear NFT" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/9866.png"},
  { name: "Gains Network (DAI Vault)" , link:"https://app.insurace.io/asset/product/GainsNetwork.png"},
  { name: "CRV+CVX" , link:"https://app.insurace.io/asset/product/CurveAllPools.png"},
  { name: "Curve DAO Token" , link:"https://app.insurace.io/asset/product/CurveAllPools.png"},
  { name: "Vesper" , link:"https://app.insurace.io/asset/product/Vesper.png"},
  { name: "Idle V4" , link:"https://app.insurace.io/asset/product/IdleFinance.png"},
  { name: "Kyber" , link:"https://app.insurace.io/asset/product/KyberNetwork.png"},
  { name: "Closed Sea" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/13716.png"},
  { name: "Cere Network" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/4710.png"},
  { name: "Collateral DeFi" , link:"https://assets.coingecko.com/coins/images/14682/small/cpay.jpg?1617767452"},
  { name: "Kephi Gallery" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/11247.png"},
  { name: "Maple" , link:"https://app.insurace.io/asset/product/MapleFinance.png"},
  { name: "MCDex" , link:"https://app.insurace.io/asset/product/MCDEX.png"},
  { name: "DeFi 11" , link:"https://assets.coingecko.com/coins/images/18174/small/wjuVH0sC_400x400.jpg?1631267074"},
  { name: "DeFi For you" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/9179.png"},
  { name: "Abracadabra.money" , link:"https://app.insurace.io/asset/product/AbracadabraMoney.png"},
  { name: "Mushrooms" , link:"https://app.insurace.io/asset/product/MushroomsFinance.png"},
  { name: "Netvrk" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/9954.png"},
  { name: "Nord finance" , link:" https://s2.coinmarketcap.com/static/img/coins/64x64/8143.png"},
  { name: "NAOS Finance Formation V2" , link:"https://app.insurace.io/asset/product/NaosFinance.png"},
  { name: "PancakeSwap" , link:"https://app.insurace.io/asset/product/PancakeSwapV1.png"},
  { name: "CAKE+ALPACA" , link:"https://app.insurace.io/asset/product/PancakeSwapV1.png"},
  { name: "Pendle" , link:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x808507121B80c02388fAd14726482e061B8da827/logo.png"},
  { name: "PolkaInsure" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/8169.png"},
  { name: "TribeOne" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/10526.png"},
  { name: "Popsicle Finance" , link:"https://icons.llama.fi/popsicle-finance.jpg"},
  { name: "Polychain Monsters" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/8968.png"},
  { name: "Orion Protocol" , link:"https://icons.llama.fi/orion-protocol.jpg"},
  { name: "Orion Money + UST De-Peg" , link:"https://app.insurace.io/asset/product/OrionMoney.png"},
  { name: "OwlDAO" , link:"https://polygonscan.com/token/images/owldao_32.png"},
  { name: "StepHero Multiverse" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/11067.png"},
  { name: "RefinedApe" , link:"https://rabp.io/ggo-1b-1.png"},
  { name: "RocketVault" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/9176.png"},
  { name: "MIM De-Peg" , link:"https://app.insurace.io/asset/product/MIMDepeg.png"},
  { name: "MIR + UST De-Peg" , link:"https://app.insurace.io/asset/product/MirrorFinance.png"},
  { name: "Yield YAK" , link:"https://app.insurace.io/asset/product/YieldYak.png"},
  { name: "YAK+JOE+PNG" , link:"https://app.insurace.io/asset/product/YieldYak.png"},
  { name: "YFI + CRV" , link:"https://app.insurace.io/asset/product/YearnFinance.png"},
  { name: "Yearn Finance (all vaults)" , link:"https://app.insurace.io/asset/product/YearnFinance.png"},
  { name: "YFI + BAL V2 + Element" , link:"https://app.insurace.io/asset/product/YearnFinance.png"},
  { name: "Venus" , link:"https://app.insurace.io/asset/product/Venus.png"},
  { name: "VVS Finance" , link:"https://app.insurace.io/asset/product/VVSFinance.png"},
  { name: "UST De-Peg" , link:"https://app.insurace.io/asset/product/USTDepeg.png"},
  { name: "USDC De-Peg" , link:"https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"},
  { name: "USDT De-Peg" , link:"https://app.insurace.io/asset/product/USDTDepeg.png"},
  { name: "Trader JOE" , link:"https://app.insurace.io/asset/product/TraderJoe.png"},
  { name: "SPELL + MIM De-Peg" , link:"https://app.insurace.io/asset/product/SPELLDepeg.png"},
  { name: "SPELL+(MIM+UST) De-Peg" , link:"https://app.insurace.io/asset/product/SPELLDepeg.png"},
  { name: "Set Protocol V2" , link:"https://app.insurace.io/asset/product/SetProtocolV2.png"},
  { name: "Serum DEX" , link:"https://app.insurace.io/asset/product/Serum.png"},
  { name: "Spectrum" , link:"https://app.insurace.io/asset/product/SpectrumProtocol.png"},
  { name: "0.exchange" , link:"https://app.bridgemutual.io/assets/icons/coins/0.webp"},
  { name: "Keeper DAO" , link:"https://app.bridgemutual.io/assets/icons/coins/keeper_dao_logo.webp"},
  { name: "Universe.XYZ" , link:"https://app.bridgemutual.io/assets/icons/coins/universexyz.webp"},
  { name: "Vires Finance + USDN" , link:"https://app.unslashed.finance/logos/vires-usdn.svg"},
  { name: "Solv Protocol" , link:"https://app.unslashed.finance/logos/solv.svg"},
  { name: "Old Lido ETH 2.0" , link:"https://app.unslashed.finance/logos/Lido@2x.png"},
  { name: "Neutrino + USDN Peg" , link:"https://app.unslashed.finance/logos/WavesNeutrino%2BUSDNPeg.svg"},
  { name: "Instadapp" , link:"https://app.unslashed.finance/logos/instadapp@2x.png"},
  { name: "Visor Finance" , link:"https://assets.coingecko.com/coins/images/14381/small/visor_logo.png?1615782828"},
  { name: "Wall Street Games" , link:"https://assets.coingecko.com/coins/images/15872/small/X3Awe42.png?1622181358"},
  { name: "88mph.app" , link:"https://files.insurace.io/public/asset/product/88mph.png"},
];

class CatalogHelper {

  public static async getLogoUrl (_name:string, _address:string , _distributorName:any){

    let logoData: any = { url:null ,strongLogoData: false};
    let trustWalletAssets: { [key: string]: any } = {};
    trustWalletAssets = await this.getTrustWalletAssets()

    let assetLogo: any = null;
    Object.keys(trustWalletAssets).find((k: string) => {
      if (trustWalletAssets[k].name && _address && trustWalletAssets[k].name.toUpperCase() == _address.toUpperCase()) {
        assetLogo = trustWalletAssets[k].logoURI;
      }
    });
    let specialLogo:any = CatalogHelper.getSpecialLogoName(_name);

    if(assetLogo){
      logoData.url = assetLogo;
      logoData.strongLogoData = true;
    }else if(specialLogo){
      logoData.url = specialLogo;
      logoData.strongLogoData = true;
    }else{
      if(_distributorName == 'insurace'){
        logoData.url = _name;
        logoData.strongLogoData = true;
      } else if(_distributorName == 'bridge'){
        logoData.url = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${_address}/logo.png`;
        const missedLogos: any = [
          { name: '0.exchange'},
          { name: 'Keeper DAO'},
          { name: 'Universe.XYZ'},
          { name: 'Alchemix'},
          { name: 'Anchor Protocol'}
        ];
        let missedLogoName = missedLogos.find((i:any) => i.name == _name)
        if(missedLogoName) {
          let specialLogo:any = CatalogHelper.getSpecialLogoName(missedLogoName.name);
          logoData.url = specialLogo;
          logoData.strongLogoData = true;
        }
      }
      else if(_distributorName == 'nexus'){
        logoData.url = `https://app.nexusmutual.io/logos/${_name}`;
        logoData.strongLogoData = true;
      }
    }
    return logoData;
  }

  public static getSpecialLogoName (_name:string){
    const isSpecial = catalogLogoLinks.find((i:any) => i.name == _name); // find name in
    if(isSpecial ){
      return isSpecial.link;
    }else{
      return false;
    }
  }

  public static chainLogos (name:string) {
    let transformedName = name.toLowerCase();
    if (transformedName === 'ethereum') transformedName = 'eth';
    if (transformedName === 'binance') transformedName = 'bsc';
    const insuraceSrc = `https://app.insurace.io/asset/chain/${transformedName}.png`
    const nexusPng = `https://app.nexusmutual.io/logos/${transformedName}.png`
    const nexusSvg = `https://app.nexusmutual.io/logos/${transformedName}.svg`
    let imgSrc = '';
    if (transformedName == 'metis' || transformedName == 'thorchain' || transformedName == 'starkware' || transformedName == 'fuse') {
      imgSrc = nexusSvg;
    } else if (transformedName == 'xdai') {
      imgSrc = nexusPng;
    } else {
      imgSrc = insuraceSrc;
    }
    return {name, imgSrc}
  }

  //Unify Cover object from Bright contract
  public static coverFromData (_distributorName:string, _rawData:any ) {
    return{
    }
  }

  public static quoteFromCoverable (_distributorName:string, _coverable:any, obj:any, stats:object) {

    const chainList = this.chainList(_distributorName, _coverable);

    return {
      distributorName: _distributorName,
      risk_protocol: _distributorName,
      name: _coverable.name,
      logoSrc: _coverable.logo,
      amount: obj.amount,
      currency: obj.currency,
      period: obj.period,
      chain: obj.chain,
      chainId: obj.chainId,
      chainList: chainList,
      actualPeriod: obj.actualPeriod ? obj.actualPeriod : obj.period,
      protocol: _coverable,
      price: obj.price,
      pricePercent: obj.pricePercent,
      errorMsg: obj.errorMsg,
      cashBackPercent: obj.cashBackPercent,
      cashBack: obj.cashBack,
      rawData: obj.response,
      stats: stats,
      type: obj.type,
      typeDescription: obj.typeDescription,
      minimumAmount: obj.minimumAmount,
      capacity: obj.capacity,
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
      ['stats_'+obj.netSymbol]: obj['stats_'+obj.netSymbol],
      //Common
      source: obj.source,                                                 // holds the 'initial source' of this object.
      // Can be either Bridge | Nexus | InsurAce
      protocolAddress: obj.protocolAddress,
      logo: obj.logo,
      name: obj.name,
      type: obj.type,
      typeDescription: obj.typeDescription,
      availableCounter: 1,
      typeList: obj.typeList,
      chainListInsurace: obj.chainListInsurace,
      chainListNexus: obj.chainListNexus,
      chainListUnore: obj.chainListUnore,
      rawDataNexus: obj.rawDataNexus,                                           //field will be increased if similar products found
      rawDataBridge: obj.rawDataBridge,                                           //field will be increased if similar products found
      rawDataInsurace: obj.rawDataInsurace,                                           //field will be increased if similar products found
      rawDataEase: obj.rawDataEase,
      rawDataUnore: obj.rawDataUnore,
      rawDataUnslashed: obj.rawDataUnslashed
    };
  }

  public static commonCategory (category:string, provider:string) {
    let commonCategory:any = '';
    if (provider == 'nexus') {
      commonCategory = bridge_nexus_insurace_categories.find((cat) => {return cat[1] === category});
    } else if (provider == 'bridge') {
      commonCategory = bridge_nexus_insurace_categories.find((cat) => {return cat[0] === category});
    } else if (provider == 'insurace') {
      commonCategory = bridge_nexus_insurace_categories.find((cat) => {return cat[2] === category});
    } else if (provider == 'ease') {
      commonCategory = bridge_nexus_insurace_categories.find((cat) => {return cat[3] === category});
    } else if (provider == 'unore') {
      commonCategory = bridge_nexus_insurace_categories.find((cat) => {return cat[4] === category});
    }
    return commonCategory ? commonCategory[5] : '' ;
  }

  public static chainList(_distributorName:string, coverable:any) {
    let list:any = [];
    const logosArr:any = [];
    if (_distributorName == 'nexus') {
      list = coverable.chainListNexus;
    } else if (_distributorName == 'insurace') {
      list = coverable.chainListInsurace;
    } else if (_distributorName == 'unore') {
      list = coverable.chainListUnore;
    } else {
      list = ['Ethereum']
    }
    if (list) {
      list.forEach((item:any) => {
        const itemObj = this.chainLogos(item);
        if (item.toLowerCase() === itemObj.name.toLowerCase()) {
          logosArr.push(itemObj)
        }
      })
    }
    return logosArr;
  }

  public static descriptionByCategory (category: string) {
    let categoryFound = bridge_nexus_insurace_categories.find(cat => cat[5] === category);
    if (categoryFound) {
      return categoryFound[6]
    }
  }

  public static trustWalletAssets:any = null;

  public static getTrustWalletAssets (): Promise<object[]> {
    if(this.trustWalletAssets){
      return new Promise( async (resolve) => {
        resolve(this.trustWalletAssets)
      })
    }else{
      let url = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/tokenlist.json"
      return axios({ method: "GET", "url": url }).then( (result:any) => {
        let assets = _.reduce(result.data.tokens, (dict:any, token) => {
          dict[token.address] = token
          return dict
        }, {})
        const wallets : object[] = { ...assets, ...CUSTOM_BRIDGE_PROTOCOLS }
        this.trustWalletAssets = wallets;
        return wallets;
      })
    }
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

              let mergedLogoUrl = mergedCoverableObject.logo.url;
              if(_catalog[i].logo.strongLogoData) mergedLogoUrl =_catalog[i].logo.url;
              if(_catalog[j].logo.strongLogoData) mergedLogoUrl = _catalog[j].logo.url;
              if(mergedPair.logo.strongLogoData) mergedLogoUrl = mergedPair.logo.url;

              mergedCoverableObject.availableCounter = ++duplicates;
              mergedCoverableObject.name = mergedName;
              mergedCoverableObject.logo = mergedLogoUrl;
              duplicateIndexes.push(j)
            }
          }
          if (duplicates > 1) {
            coverablesNoDuplicates.push(mergedCoverableObject);
          } else {
            //no duplicate for it, leave it as is
            if(_catalog[i].productId){
              mergedCoverableObject.availableCounter += 2;
            }
            _catalog[i].logo = _catalog[i].logo.url;
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

    static unifyCoverName( _coverName : any , _riskProtocol:any ) {
      let cov1SourceNameIndex:any = false;

      if (_riskProtocol === 'bridge') {
        cov1SourceNameIndex = bridge_nexus_insurace.findIndex(element => element[0].toUpperCase() === _coverName.toUpperCase())
      } else if(_riskProtocol === 'nexus') {
        cov1SourceNameIndex = bridge_nexus_insurace.findIndex(element => element[1].toUpperCase() === _coverName.toUpperCase())
      } else if(_riskProtocol === 'insurace') {
        cov1SourceNameIndex = bridge_nexus_insurace.findIndex(element => element[2].toUpperCase() === _coverName.toUpperCase())
      } else if(_riskProtocol === 'ease') {
        cov1SourceNameIndex = bridge_nexus_insurace.findIndex(element => element[3].toUpperCase() === _coverName.toUpperCase())
      } else if(_riskProtocol === 'unslashed') {
        cov1SourceNameIndex = bridge_nexus_insurace.findIndex(element => element[4].toUpperCase() === _coverName.toUpperCase())
      }else if(_riskProtocol === 'unore') {
        cov1SourceNameIndex = bridge_nexus_insurace.findIndex(element => element[5].toUpperCase() === _coverName.toUpperCase())
      }

      if(cov1SourceNameIndex && cov1SourceNameIndex > -1){
        return bridge_nexus_insurace[cov1SourceNameIndex][6];
      }else{
        return _coverName
      }
    }

    static coverableDuplicate (cov1:any, cov2:any) {
      if (cov1.name.toUpperCase() === cov2.name.toUpperCase()) {
        return cov1.name;
      } else if (cov1.protocolAddress && cov2.protocolAddress && cov1.protocolAddress.toUpperCase() === cov2.protocolAddress.toUpperCase()){
        // BRIDGE address equals NEXUS address
        return cov1.name;
      }
      else {
        return;
      }
    }

    static availableOnNetwork(networkId:number, module:string) {
      if(!NetConfig.netById(networkId)) return false;
      return NetConfig.netById(networkId).modules.find(mod => mod === module);
    }


  }

  export default CatalogHelper
