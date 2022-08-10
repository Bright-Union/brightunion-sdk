import axios from 'axios';
import * as _ from  "lodash";
import NetConfig from '../config/NetConfig';
import {hexToUtf8} from 'web3-utils';
// import * as Sentry from "@sentry/browser";


const bridge_nexus_insurace = [
  // BRIDGE NAME, NEXUS NAME, INSURACE NAME, EASE, UNSLASHED, UNORE, TIDAL, SOLACE, COMMON NAME
  ['', '88mph', '88mph V2', '', '', '88mph.app', '', '', '88mph V2'],
  ['', '88mph', '88mph V3', '', '', '88mph.app', '', '', '88mph V3'],
  ['88mph.app', '', '', '', '', '', '', '88mph', '88mph.app'],
  ['1INCH Token', '1Inch (DEX & Liquidity Pools)', '1inch (Liquidity Pools)', '', '', '1inch Network', '', '', '1Inch'],
  ['Aave', 'Aave V1', '', '', '', '', '', 'aave-v1', 'Aave V1'],
  ['Aave', 'Aave V2', 'Aave V2', 'aave', '', 'AAVE', '', 'aave-v2', 'Aave V2'],
  ['', '', 'AAVE V3', '', '', '', '', 'aave-v3', 'AAVE V3'],
  ['Balancer v1', 'Balancer v1', 'Balancer v1', 'Balancer v1', 'Balancer V1 & V2', 'Balancer', '', 'balancer-v1', 'Balancer v1'],
  ['Balancer v2', 'Balancer v2', 'Balancer v2', 'Balancer v2', 'Balancer V1 & V2', 'Balancer', '', 'balancer-v2', 'Balancer v2'],
  ['Anchor Protocol', 'Anchor Protocol', 'Anchor', '', '', '', 'Anchor Protocol', '', 'Anchor'],
  ['', '', '', 'ANC + UST De-Peg', 'Anchor + UST Peg', '', '', '', 'ANC + UST De-Peg'],
  ['Alchemix', 'Alchemix V1', '', '', '', 'Alchemix', '', 'alchemix', 'Alchemix V1'],
  ['', '', 'Alchemix v2', '', '', '', '', 'Alchemix-v2', 'Alchemix V2'],
  ['', 'Angle', 'Angle Protocol', '', '', '', '', 'Angle', 'Angle Protocol'],
  ['', '', 'Alpha Homora V1', '', '', '', '', 'alpha-v1', 'Alpha Homora V1'],
  ['', '', '', '', '', '', '', 'alpha-v2', 'Alpha Homora V2'],
  ['bmiV2DropsDAOCover', '', '', '', '', '', '', '', 'Drops Ownership Power'],
  ['BadgerDAO', 'BadgerDAO', 'Badger Finance', '', '', '', '', 'badger', 'BadgerDAO'],
  ['', 'Bancor v3', '', '', '', '', '', 'bancor-v3', 'Bancor v3'],
  ['BarnBridge', 'Barnbridge Smart Yield V1', '', '', '', '', '', 'barnbridge', 'Barnbridge V1'],
  ['', '', 'Beethoven X', '', '', '', '', 'beethoven-x', 'Beethoven X'],
  ['', '', 'Bella', '', '', '', 'Bella Protocol', '', 'Bella Protocol'],
  ['Compound', 'Compound V2', 'Compound V2', 'Compound', 'Compound', 'Compound', '', 'compound', 'Compound V2'],
  ['', 'Enzyme v3', 'Enzyme Finance', '', '', 'Enzyme Finance', '', 'enzyme-finance', 'Enzyme'],
  ['Cream', 'CREAM v1', '', '', '', 'Cream finance', '', 'cream', 'C.R.E.A.M.'],
  ['', 'Curve All Pools (incl staking)', 'Curve (All Pools)', 'Curve', '', '', '', 'curve', 'Curve (All Pools)'],
  ['', 'DODO Exchange', 'DODO', '', '', '', '', '', 'DODO'],
  ['', '', 'dHEDGE V2', '', '', '', '', 'dhedge-v2', 'dHEDGE V2'],
  ['Coinbase', '', 'Coinbase', '', 'Coinbase Exchange', '', '', '', 'Coinbase'],
  ['', '', 'Element Finance', '', '', '', '', 'element', 'Element Finance'],
  ['', '', 'Ellipsis Finance', '', '', '', '', 'ellipsis', 'Ellipsis Finance'],
  ['', '', 'FODL Finance', '', '', '', '', 'FODL', 'FODL Finance'],
  ['', '', 'Frax Finance', '', '', '', '', 'frax', 'Frax Finance'],
  ['', '', 'Geist Finance', '', '', '', '', 'geist', 'Geist Finance'],
  ['', '', 'Impermax Finance', '', '', '', '', 'impermax', 'Impermax Finance'],
  ['', '', 'Hector DAO', '', '', '', '', 'hector-dao', 'Hector DAO'],
  ['', '', 'Liquid Driver', '', '', '', '', 'liquiddriver', 'Liquid Driver'],
  ['bmiV2LidoCover', '', 'Lido', '', '', 'Lido', '', 'Lido', 'Lido'],
  ['', '', 'Notional Finance', '', '', '', '', 'notional-finance', 'Notional Finance'],
  ['', '', 'Saddle Finance', '', '', '', 'Saddle Finance', 'saddle', 'Saddle Finance'],
  ['', '', 'Spirit Swap', '', '', '', '', 'spiritswap', 'Spirit Swap'],
  ['', '', 'Ribbon Finance', '', '', '', '', 'ribbon', 'Ribbon Finance'],
  ['', '', 'Ribbon Finance v2', '', '', '', '', 'ribbon-v2', 'Ribbon Finance v2'],
  ['', '', 'Reaper Farm', '', '', '', '', 'reaper', 'Reaper Farm'],
  ['', 'Platypus', 'Platypus Finance', '', '', '', '', 'platypus-finance', 'Platypus Finance'],
  ['', 'Premia Finance', '', '', '', '', '', 'premia-finance', 'Premia Finance'],
  ['', 'Tornado Cash', 'Tornado Cash', '', '', '', '', 'tornado-cash', 'Tornado Cash'],
  ['', 'Iron Bank', '', '', '', '', '', 'iron-bank', 'Iron Bank'],
  ['bmiV2ICHICover', '', 'ICHI', '', '', 'ICHI Farm', '', '', 'ICHI'],
  ['', 'Harvest Finance', 'Harvest Finance', '', 'Harvest', '', '', 'harvest', 'Harvest Finance'],
  ['Maker', 'MakerDAO MCD', 'MakerDAO MCD', '', 'Maker DAO', '', '', 'maker', 'MakerDAO'],
  ['', 'Pancakeswap V1', 'PancakeSwap', '', '', '', '', '', 'PancakeSwap'],
  ['Perpetual', 'Perpetual Protocol', 'Perpetual Protocol', '', 'Perpetual Protocol', '', '', 'perpetual-protocol', 'Perpetual Protocol'],
  ['bmiV2PendleFinanceCover', 'Pendle', "Pendle", '', '', '', '', '', "Pendle"],
  ['Synthetix Network Token', 'Synthetix', '', '', '', '', '', '', 'Synthetix'],
  ['Sushi', 'SushiSwap V1', '', 'SushiSwap', '', 'SushiSwap', '', 'sushiswap', 'Sushi'],
  ['Keeper DAO', 'Keeper DAO', 'KeeperDAO', '', '', '', '', 'keeper-dao', 'KeeperDAO'],
  ['', 'Kyber (Katalyst)', 'KyberSwap', '', 'Kyber', 'Kyber Swap', '', '', 'Kyber'],
  ['', 'DyDx Perpetual', 'DyDx', '', '', '', '', '', 'DyDx'],
  ['', 'ETH 2.0 (deposit contract)', 'ETH 2.0', '', '', '', '', '', 'ETH 2.0'],
  ['', 'OlympusDAO', 'Olympus DAO', '', 'Olympus', '', '', 'olympus', 'Olympus DAO'],
  ['','','', '', '', 'Popsicle Finance', '', 'Popsicle', 'Popsicle'],
  ['','Paraswap v1','', '', 'Paraswap', '', '', '', 'Paraswap'],
  ['','Trader Joe','Trader Joe', '', '', '', '', 'trader-joe', 'Trader Joe'],
  ['','Origin OUSD','Origin Dollar', '', '', '', '', 'Origin-dollar', 'Origin Dollar'],
  ['Orion Protocol','','', '', '', '', '', 'orion-protocol', 'Orion Protocol'],
  ['Pickle Finance','','', '', '', '', '', 'pickle', 'Pickle Finance'],
  ['','Rari Capital','', '', '', 'Rari Capital', '', 'Rari', 'Rari Capital'],
  ['','','UST De-Peg', '', 'UST Peg', '', '', '', 'UST De-Peg'],
  ['','','USDT De-Peg', '', 'USDT Peg', '', '', '', 'USDT De-Peg'],
  ['','','USDT De-Peg', '', 'USDT Peg', 'USDT', '', '', 'USDT De-Peg'],
  ['','','USDC De-Peg', '', '', 'USDC', '', '', 'USDC De-Peg'],
  ['','','MIM De-Peg', '', '', 'MIM', '', '', 'MIM De-Peg'],
  ['','UMA','UMA', '', '', 'UMA Protocol', '', '', 'UMA'],
  ['','','Unagii (Vaults)', '', '', '', '', 'unagii', 'Unagii (vaults)'],
  ['','','VVS Finance', '', '', '', '', 'vvs-finance', 'VVS Finance'],
  ['','Stake DAO','Stake DAO', '', '', 'StakeDAO', '', 'stake-dao', 'Stake DAO'],
  ['','','Frax Finance', '', '', 'FRAX', '', '', 'Frax Finance'],
  ['','','BUSD De-Peg', '', '', 'BUSD', '', '', 'BUSD De-Peg'],
  ['Spell Token', 'Abracadabra', 'Abracadabra.money', '', '', '', '', '', 'Abracadabra'],
  ['Uniswap', 'Uniswap V1', '', '', '', '', '', 'uniswap-v1', 'Uniswap V1'],
  ['Uniswap', 'Uniswap V2', 'Uniswap V2', '', 'Uniswap V2 & V3', 'Uniswap', '', 'uniswap-v2', 'Uniswap V2'],
  ['Uniswap', 'Uniswap V3', 'Uniswap V3', '', 'Uniswap V2 & V3', '', '', 'uniswap-v3', 'Uniswap V3'],
  ['','Convex Finance V1','Convex', 'Convex', '', 'Convex Finance', '', '', 'Convex'],
  ['IceToken','Popsicle Finance','', '', '', '', '', '', 'IceToken'],
  ['','Yield Protocol','', '', '', '', '', 'yield-protocol', 'Yield Protocol'],
  ['Universe.XYZ','','', '', '', '', '', 'Universe', 'Universe'],
  ['Yearn Finance (all vaults)','Yearn Finance (all vaults)','Yearn Finance (all vaults)', 'yearn', 'Yearn', 'Yearn Finance', '', '', 'Yearn Finance (all vaults)']
]


const bridge_nexus_insurace_categories : string[][] = [
  // BRIDGE CATEGORY, NEXUS CATEGORY, INSURACE, EASE, UNSLASHED, UNORE, TIDAL, COMMON CATEGORY, DESCRIPTION
  ['0' /*CONTRACT*/, 'protocol', 'Smart Contract Vulnerability', 'Lending Protocol', 'DAPP', 'Lending', '0', 'protocol', 'Protocol hack and failure'],
  ['2', /*SERVICE*/ 'custodian', '', '', 'Custodian', '', '', 'custodian', 'Custodian cover'],
  ['1' /*STABLECOIN*/, '', 'Stablecoin De-Peg', '', '', 'Stablecoin', '', 'stable', 'Stable token de-pegging'],
  ['', 'token', '', 'Yield Aggregator', '', '', '', 'yield', 'Yield de-pegging'],
  ['3' /*EXCHANGE*/, 'custodian', 'Custodian Risk', '', 'Custodian', '', '', 'custodian', 'Custodian Risk'],
  ['' , '', 'IDO Event Risk', '', '', '', '', 'ido', 'IDO Event Risk'],
  ['' , '', 'Bundled Cover', '', '', '', '', 'bundled', 'Bundled cover'],
  ['' , '', '', 'Decentralized Exchange', 'Exchange', 'Dexes', '', 'exchange', 'Decentralized Exchange'],
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
  { name: "Autobahn Network" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/autobahn%20network_logo.png"},
  { name: "AAVE V3" , link:"https://files.insurace.io/public/asset/product/AaveV2.png"},
  { name: "RAMP V2" , link:"https://files.insurace.io/public/asset/product/RampV2.png"},
  { name: "Unagii (Vaults)" , link:"https://files.insurace.io/public/asset/product/Unagii.png"},
  { name: "Eth 2.0" , link:"https://app.insurace.io/asset/product/Eth2.0.png"},
  { name: "Beefy" , link:"https://app.insurace.io/asset/product/BeefyFinance.png"},
  { name: "Bunny" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/bunny_logo.jpg"},
  { name: "Babylons" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/babylons_logo.png"},
  { name: "Berry Data" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/berry%20data_logo.png"},
  { name: "Bot Planet" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/bot%20planet_logo.png"},
  { name: "Alchemix V1" , link:"https://app.bridgemutual.io/assets/icons/coins/Alchemix.webp"},
  { name: "Anchor" , link:"https://app.bridgemutual.io/assets/icons/coins/anchor_protocol_logo.webp"},
  { name: "Arcade Network" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/arcade%20network_logo.png"},
  { name: "Alpha Token" , link:"https://assets.coingecko.com/coins/images/12738/large/AlphaToken_256x256.png?1617160876"},
  { name: "Aldrin DEX" , link:"https://app.insurace.io/asset/product/Aldrin.png"},
  { name: "ANC + UST De-Peg" , link:"https://app.unslashed.finance/logos/terra-ust@2x.svg"},
  { name: "ANC + MIR + UST De-Peg" , link:"https://app.bridgemutual.io/assets/icons/coins/anchor_protocol_logo.webp"},
  { name: "BitMEX" , link:"https://app.unslashed.finance/logos/bitmex@2x.png"},
  { name: "Convex" , link:"https://app.insurace.io/asset/product/ConvexFinance.png"},
  { name: "Curate" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/curate_logo.png"},
  { name: "DAO Maker" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/dao%20maker_logo.jpg"},
  { name: "DAI" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/dai_logo.png"},
  { name: "Gamerse" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/gamerse_logo.png"},
  { name: "Fortknoxster" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/fortknoxster_logo.png"},
  { name: "Fear NFT" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/fear%20nft_logo.png"},
  { name: "Gains Network (DAI Vault)" , link:"https://app.insurace.io/asset/product/GainsNetwork.png"},
  { name: "CRV+CVX" , link:"https://app.insurace.io/asset/product/CurveAllPools.png"},
  { name: "Curve DAO Token" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/curve_logo.png"},
  { name: "Vesper" , link:"https://app.insurace.io/asset/product/Vesper.png"},
  { name: "Idle V4" , link:"https://app.insurace.io/asset/product/IdleFinance.png"},
  { name: "Kyber" , link:"https://app.insurace.io/asset/product/KyberNetwork.png"},
  { name: "Closed Sea" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/closed%20sea_logo.png"},
  { name: "Cere Network" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/cere%20network_logo.png"},
  { name: "Collateral DeFi" , link:"https://assets.coingecko.com/coins/images/14682/small/cpay.jpg?1617767452"},
  { name: "Kephi Gallery" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/kephi%20gallery_logo.png"},
  { name: "Maple" , link:"https://app.insurace.io/asset/product/MapleFinance.png"},
  { name: "MCDex" , link:"https://app.insurace.io/asset/product/MCDEX.png"},
  { name: "Drops Ownership Power" , link:"https://assets.coingecko.com/coins/images/15696/large/dop.png?1640325078"},
  { name: "DeFi 11" , link:"https://assets.coingecko.com/coins/images/18174/small/wjuVH0sC_400x400.jpg?1631267074"},
  { name: "DeFi For you" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/defi%20for%20you_logo.png"},
  { name: "Abracadabra.money" , link:"https://app.insurace.io/asset/product/AbracadabraMoney.png"},
  { name: "Mushrooms" , link:"https://app.insurace.io/asset/product/MushroomsFinance.png"},
  { name: "Netvrk" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/netvrk_logo.png"},
  { name: "Nord finance" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/nord%20finance_logo.png"},
  { name: "NAOS Finance Formation V2" , link:"https://app.insurace.io/asset/product/NaosFinance.png"},
  { name: "PancakeSwap" , link:"https://app.insurace.io/asset/product/PancakeSwapV1.png"},
  { name: "CAKE+ALPACA" , link:"https://app.insurace.io/asset/product/PancakeSwapV1.png"},
  { name: "Pendle" , link:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x808507121B80c02388fAd14726482e061B8da827/logo.png"},
  { name: "PolkaInsure" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/polkainsure_logo.png"},
  { name: "TribeOne" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/tribeone_logo.png"},
  { name: "Popsicle Finance" , link:"https://icons.llama.fi/popsicle-finance.jpg"},
  { name: "Polychain Monsters" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/polychain%20monsters_logo.png"},
  { name: "Orion Protocol" , link:"https://icons.llama.fi/orion-protocol.jpg"},
  { name: "Orion Money" , link:"https://app.insurace.io/asset/product/OrionMoney.png"},
  { name: "OwlDAO" , link:"https://polygonscan.com/token/images/owldao_32.png"},
  { name: "StepHero Multiverse" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/stephero%20multiverse_logo.png"},
  { name: "RefinedApe" , link:"https://rabp.io/ggo-1b-1.png"},
  { name: "RocketVault" , link:"https://raw.githubusercontent.com/Uno-Re/cover-products-info/main/logos/rocketvault_logo.png"},
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
          { name: '"Drops Ownership Power"'},
          { name: 'Anchor'}
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
      } else if(_distributorName == 'ease'){
        logoData.url = _name;
        logoData.strongLogoData = true;
      } else if(_distributorName == 'unore'){
        logoData.url = _name;
        logoData.strongLogoData = true;
      } else if(_distributorName == 'unslashed'){
        logoData.url = _name;
        logoData.strongLogoData = true;
      } else if(_distributorName == 'solace') {
        logoData.url = `https://assets.solace.fi/zapperLogos/${_name}`;
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
      status: obj.status,
      priceInNXM: obj.priceInNXM,
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
      priceOrigin: obj.priceOrigin,
      priceNoMargin: obj.priceNoMargin,
      pricePercentOrigin: obj.pricePercentOrigin,
      pricePercent: obj.pricePercent,
      errorMsg: obj.errorMsg,
      cashBackPercent: obj.cashBackPercent,
      cashBack: obj.cashBack,
      rawData: obj.rawData,
      stats: stats,
      type: obj.type,
      typeDescription: obj.typeDescription,
      minimumAmount: obj.minimumAmount,
      uniSwapRouteData: obj.uniSwapRouteData,
      capacity: obj.capacity,
      nonPartnerLink: obj.nonPartnerLink,
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
      chainListSolace: obj.chainListSolace,
      rawDataNexus: obj.rawDataNexus,                                           //field will be increased if similar products found
      rawDataBridge: obj.rawDataBridge,                                           //field will be increased if similar products found
      rawDataInsurace: obj.rawDataInsurace,                                           //field will be increased if similar products found
      rawDataEase: obj.rawDataEase,
      rawDataUnore: obj.rawDataUnore,
      rawDataUnslashed: obj.rawDataUnslashed,
      rawDataTidal: obj.rawDataTidal,
      rawDataSolace: obj.rawDataSolace
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
      commonCategory = bridge_nexus_insurace_categories.find((cat) => {return cat[5] === category});
    } else if (provider == 'unslashed') {
      commonCategory = bridge_nexus_insurace_categories.find((cat) => {return cat[4] === category});
    } else if (provider == 'tidal') {
      commonCategory = bridge_nexus_insurace_categories.find((cat) => {return cat[6] === category});
    }
    return commonCategory ? commonCategory[7] : '' ;
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
    } else if (_distributorName == 'solace') {
      list = coverable.chainListSolace;
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
    let categoryFound = bridge_nexus_insurace_categories.find(cat => cat[6] === category);
    if (categoryFound) {
      return categoryFound[7]
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
      }else if(_riskProtocol === 'tidal') {
        cov1SourceNameIndex = bridge_nexus_insurace.findIndex(element => element[6].toUpperCase() === _coverName.toUpperCase())
      }else if(_riskProtocol === 'solace') {
        cov1SourceNameIndex = bridge_nexus_insurace.findIndex(element => element[7].toUpperCase() === _coverName.toUpperCase())
      }

      if(cov1SourceNameIndex && cov1SourceNameIndex > -1){
        return bridge_nexus_insurace[cov1SourceNameIndex][8];
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
