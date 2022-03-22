import Web3 from 'web3';

const VUE_APP_MAINNET_MODULES='BRIGHT_TOKEN UNISWAP BRIDGE_MUTUAL NEXUS_MUTUAL INSURACE'
const VUE_APP_KOVAN_MODULES='BRIGHT_TOKEN NEXUS_MUTUAL BRI_INDEX'
const VUE_APP_RINKEBY_MODULES='BRIDGE_MUTUAL INSURACE'
const VUE_APP_ROPSTEN_MODULES='BRIDGE_MUTUAL'
const VUE_APP_BSC_MODULES='INSURACE'
const VUE_APP_BSC_TESTNET_MODULES=''
const VUE_APP_POLYGON_MODULES='INSURACE'
const VUE_APP_MUMBAI_TESTNET_MODULES=''
const VUE_APP_AVALANCHE_MODULES='INSURACE'
const VUE_APP_AVALANCHE_TEST_MODULES='INSURACE'

 const NETWORK_CONFIG = [
    {
        name: 'Ethereum',
        id: 1,
        symbol: 'ETH',
        defaultCurrency: "ETH",
        explorer: 'https://etherscan.io',
        provider: 'https://eth-mainnet.alchemyapi.io/v2/OlIDDqLH9Uo3AUQ_0ezj6sfqHIGxJRxw',
        modules: VUE_APP_MAINNET_MODULES.split(' '),
        bridgeRegistry: '0x8050c5a46FC224E3BCfa5D7B7cBacB1e4010118d',
        bridgeV2Registry: '0x45269F7e69EE636067835e0DfDd597214A1de6ea',
        bridgeV2Distributor: '0x213ffaca158c4f8863c1980a41c25f34fb0b95e0',
        brightTreasury: '0xAc0734C62B316041D190438d5d3e5D1359614407',
        nexusDistributor: '0x3756C3C9374f38e0d9aAcB637Fed1641504a5b28',
        nexusAPI: 'https://api.nexusmutual.io',
        brightProtocol:'0x7ca75bf6c3f5aa2c0f5a2c0bb07acb622ace1e3c',
        insuraceDistributor: '0x98fb0e1191651b6292d3482cebf54e6d35542ca4',
        insuraceCover: '0x88Ef6F235a4790292068646e79Ee563339c796a0',
        insuraceAPI: 'https://api.insurace.io/ops/v1',
        insuraceAPIKey: 'H7C8k69Eiisz7AG1/6xcI5UWGluTtyAbizXrsfbfQIBDapQZEHAHFw==',
        insuraceReferral: '982107115070280393099561761653261738634756834311',
        ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
        USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        INSUR:'0x544c42fbb96b39b21df61cf322b5edc285ee7429',
    },
    {
        name: 'Ropsten',
        id: 3,
        symbol: 'ETH',
        defaultCurrency: "ETH",
        explorer: 'https://ropsten.etherscan.io',
        provider: 'https://ropsten.infura.io/v3/98d7e501879243c5877bac07a57cde7e',
        nexusAPI: 'https://api.nexusmutual.io',                 //not used
        brightProtocol:'',
        brightContractRegistry: '',
        bridgeV2Distributor: ' ',        //not used
        insuraceCover: '',                                      //not used
        insuraceAPI: '',                                        //not used
        insuraceAPIKey: '',                                     //not used
        insuraceReferral: '',
        modules: VUE_APP_ROPSTEN_MODULES.split(' '),
        ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        DAI: '0x69dDdb0F010D9Cac595F75d8b0fff59CDCD1D44f',      //not used
        USDT: '0xcc54b12a18f2c575ca97991046090f43c3070aa0',     //not used
        USDC: '',                                               //not used
        INSUR: '',                                               //not used
    },
    {
        name: 'Rinkeby',
        id: 4,
        symbol: 'ETH',
        defaultCurrency: "ETH",
        explorer: 'https://rinkeby.etherscan.io',
        provider: 'https://rinkeby.infura.io/v3/98d7e501879243c5877bac07a57cde7e',
        nexusAPI: 'https://api.nexusmutual.io',                 //not used
        brightProtocol:'0x908DDB24Ea9f1abc9B2cD2be8114b01EE5Ff76b2',
        brightContractRegistry: '',                             //not used
        insuraceCover: "0x0921f628b8463227615D2199D0D3860E4fBcD411" ,
        insuraceAPI: 'https://insurace-sl-microservice.azurewebsites.net',
        insuraceAPIKey: 'OmgwnM39a/M9/9Q856wbRkILcYh2ZmlJPpG9cVxT5Vy6aR8eNl3/jw==',
        insuraceReferral: '',
        modules: VUE_APP_RINKEBY_MODULES.split(' '),
        bridgeRegistry: '0x0Ac28BcDcef8D8C95c4a079418dbC34e4AD4DF1D',
        bridgeV2Registry: '0x38de74c5ac7d2a3bc81e566ee318fdedb4a8e1f1',
        bridgeV2Distributor: '0x4c130197E946eb8f840D37C4DdB39Aa1a6A71cd7',
        ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        DAI: '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea',      //not used
        USDT: '0xD92E713d051C37EbB2561803a3b5FBAbc4962431',
        USDC: '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
        INSUR: '',                                               //not used
    },
    {
        name: 'Kovan',
        id: 42,
        symbol: 'ETH',
        defaultCurrency: "ETH",
        explorer: 'https://kovan.etherscan.io',
        provider: 'https://eth-kovan.alchemyapi.io/v2/9r8lwXZcACNfMovcyYaquN_CNK81Cqxi',
        modules: VUE_APP_KOVAN_MODULES.split(' '),
        nexusDistributor: '0x95454264489114534dD39D81E03Cf4003F948cA6',
        nexusAPI: 'https://api.staging.nexusmutual.io',
        brightProtocol:'0x15E83c77857859C0Ab3E36c144c3225C4BacD7f7',
        brightContractRegistry: '0x269601a1825dB9194620477e2D251167Ae938117',
        bridgeV2Distributor: '0x4c130197E946eb8f840D37C4DdB39Aa1a6A71cd7',
        insuraceCover: '',                                      //not used
        insuraceAPI: '',                                        //not used
        insuraceAPIKey: '',                                     //not used
        insuraceReferral: '',
        ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        DAI: '0x5c422252c6a47cdacf667521566bf7bd5b0d769b',      // Nexus DAI
        USDT: '0xcc54b12a18f2c575ca97991046090f43c3070aa0',     //not used
        USDC: '',                                               //not used
        INSUR: '',                                               //not used
    },
    {
        name: 'BSC',
        id: 56,
        symbol: 'BSC',
        defaultCurrency: "BNB",
        explorer: 'https://bscscan.com',
        provider: 'https://bsc-dataseed.binance.org',
        modules: VUE_APP_BSC_MODULES.split(' '),
        bridgeRegistry: '',
        nexusDistributor: '',
        nexusAPI: '',
        brightProtocol:'0xe457d4be112ca8b14bd9fedebae48037c11366ea',
        bridgeV2Distributor: '',
        brightContractRegistry: '',
        insuraceDistributor: '0x68f4c3a5ac3ea721c67fc1061e02d39fb55e9fa9',
        insuraceCover: '0xfBa24bdbb36001F1F88B3a552c77EC1c10f5E4C0',
        // insuraceCover: '0xB96eB892fc5fAC87ffE4f4F6eB509Eeaf6019243',
        insuraceAPI: 'https://api.insurace.io/ops/v1',
        insuraceAPIKey: 'H7C8k69Eiisz7AG1/6xcI5UWGluTtyAbizXrsfbfQIBDapQZEHAHFw==',
        insuraceReferral: '982107115070280393099561761653261738634756834311',
        ETH: '',
        BNB: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
        USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        'BUSD-T': '0x55d398326f99059ff775485246999027b3197955',
        INSUR:'0x3192CCDdf1CDcE4Ff055EbC80f3F0231b86A7E30',
    },
    {
        name: 'BSC Testnet',
        id: 97,
        symbol: 'BSC',
        defaultCurrency: "BNB",
        explorer: 'https://testnet.bscscan.com',
        provider: 'https://data-seed-prebsc-1-s1.binance.org:8545',
        modules: VUE_APP_BSC_TESTNET_MODULES.split(' '),
        nexusDistributor: '',
        nexusAPI: '',
        brightProtocol:'0x888F2aDC65C4e64A4A9B98f8b1261a232397B348',
        brightContractRegistry: '',
        bridgeV2Distributor: '',
        insuraceCover: '0x5f463Cc70f9706E63d4b927E25c28d5A709828b9',
        insuraceAPI: 'https://insurace-sl-microservice.azurewebsites.net',
        insuraceAPIKey: 'OmgwnM39a/M9/9Q856wbRkILcYh2ZmlJPpG9cVxT5Vy6aR8eNl3/jw==',
        insuraceReferral: '',
        ETH: '',
        BNB: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        BUSD: '0xb4A9462116681C87dE2457e325971682c684b021',
        USDC: '0x1Fc429DfF3Fa42EDF2C61CB1105c0471fC2F8a8e',
        'BUSD-T': '0x8AE79aB449Ee5E836a6683DFdBE2499876504247',
        INSUR:'0x3e31e00980536D1EE24b016f318420bD797bcBC7',
    },
    {
        name: 'Polygon',
        id: 137,
        symbol: 'POLYGON',
        defaultCurrency: "MATIC",
        explorer: 'https://polygonscan.com',
        provider: 'https://polygon-rpc.com',
        modules: VUE_APP_POLYGON_MODULES.split(' '),
        bridgeRegistry: '',
        nexusDistributor: '',
        nexusAPI: '',
        brightProtocol:'0x2c3783aac396bacb02559a2bb209986f0e5ebf94',
        bridgeV2Distributor: ' ',
        brightContractRegistry: '',
        insuraceDistributor: '0x371bddd1321d24c130d79ec85f125dd34928b054',
        insuraceCover: '0x3e00FE643337A0f4E345539096cA01e6B8d4374A',
        insuraceAPI: 'https://api.insurace.io/ops/v1',
        insuraceAPIKey: 'H7C8k69Eiisz7AG1/6xcI5UWGluTtyAbizXrsfbfQIBDapQZEHAHFw==',
        insuraceReferral: '982107115070280393099561761653261738634756834311',
        ETH: '',
        MATIC: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        DAI: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
        USDT: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        USDC: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        INSUR: '0x8a0e8b4b0903929f47C3ea30973940D4a9702067',
    },
    {
        name: 'Mumbai Testnet',
        id: 80001,
        symbol: 'POLYGON',
        defaultCurrency: "MATIC",
        explorer: 'https://explorer-mumbai.maticvigil.com',
        provider: 'https://rpc-mumbai.matic.today',
        modules: VUE_APP_MUMBAI_TESTNET_MODULES.split(' '),
        nexusDistributor: '',
        nexusAPI: '',
        bridgeV2Distributor: '',
        brightProtocol:'0x5C59A3A67eC553345cb384eC58FCf1a2b9159b15',
        brightContractRegistry: '',
        insuraceCover: '0xE2Edf233eDB3F971415FD76A7b447e4bfFfcd221',
        insuraceAPI: 'https://insurace-sl-microservice.azurewebsites.net',
        insuraceAPIKey: 'OmgwnM39a/M9/9Q856wbRkILcYh2ZmlJPpG9cVxT5Vy6aR8eNl3/jw==',
        insuraceReferral: '',
        ETH: '',
        MATIC: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        DAI: '0xbF7f0C2B8E1C7631D8c99CB2CFF6523485e07CC7',
        USDT: '0x360974B871b280CdDcF076bDB6aB98624772E0b1',
        USDC: '0xb7c8bCA891143221a34DB60A26639785C4839040',
        INSUR: '0x0D3A05564821686CC7fB534eE44485B8025Eb4e8',
    },
    {
        name: 'Avalanche Mainnet C-Chain',
        id: 43114,
        symbol: 'AVALANCHE',
        defaultCurrency: "AVAX",
        explorer: 'https://snowtrace.io/',
        provider: 'https://api.avax.network/ext/bc/C/rpc',
        modules: VUE_APP_AVALANCHE_MODULES.split(' '),
        nexusDistributor: '',
        nexusAPI: '',
        // brightProtocol:'0x29dEc761e3DaFdD27cD819F0F01FF750552655a2',
        brightProtocol:'0x4fcCAE4221A43D31EfCEdEff1D4FE1C497fA0ec7',
        brightContractRegistry: '',
        bridgeV2Distributor: '',
        insuraceDistributor: '0x375d9567b483814d1275869b543101b725779b67',
        insuraceCover: '0xfBa24bdbb36001F1F88B3a552c77EC1c10f5E4C0',
        insuraceAPI: 'https://api.insurace.io/ops/v1',
        insuraceAPIKey: 'H7C8k69Eiisz7AG1/6xcI5UWGluTtyAbizXrsfbfQIBDapQZEHAHFw==',
        insuraceReferral: '982107115070280393099561761653261738634756834311',
        ETH: '',
        MATIC: '',
        'DAIe': '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
        'USDTe': '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
        'USDCe': '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
        INSUR: '0x544c42fBB96B39B21DF61cf322b5EDC285EE7429',
        AVAX: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
    {
        name: 'Avalanche FUJI C-Chain',
        id: 43113,
        symbol: 'AVALANCHE',
        defaultCurrency: "AVAX",
        explorer: 'https://testnet.snowtrace.io/',
        provider: 'https://api.avax-test.network/ext/bc/C/rpc',
        modules: VUE_APP_AVALANCHE_TEST_MODULES.split(' '),
        nexusDistributor: '',
        nexusAPI: '',
        brightProtocol:'0x5C59A3A67eC553345cb384eC58FCf1a2b9159b15',
        bridgeV2Distributor: '',
        brightContractRegistry: '',
        insuraceCover: '',
        insuraceAPI: 'https://insurace-sl-microservice.azurewebsites.net',
        insuraceAPIKey: 'OmgwnM39a/M9/9Q856wbRkILcYh2ZmlJPpG9cVxT5Vy6aR8eNl3/jw==',
        insuraceReferral: '',
        ETH: '',
        MATIC: '',
        'DAIe': '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
        'USDTe': '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
        'USDCe': '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
        INSUR: '0xE2Edf233eDB3F971415FD76A7b447e4bfFfcd221',
        AVAX: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',

    },

]

const MAIN_NETS = [1, 56, 137, 43114];
// const MAIN_NETS = [1, 56, 137]; // disable avaanche until release
const TEST_NETS = [4, 42, 97, 80001]; //using Kovan here as Eth testnet

const sixDecimalCurrencies:any = {
  1:[ 'USDT' , 'USDC'], //ETH Main
  56:[],//BSC Main
  137:[ 'USDT' , 'USDC'],//POLYGON Main
  43114 : ['USDTe' , 'USDCe'],//AVALANCHE Main
  4:[ 'USDT' , 'USDC'],//ETH Test
  42:[ 'USDT' , 'USDC'],//ETH Test
  97:[],//BSC Test
  80001:['USDT' , 'USDC'],//POLYGON Test
}

class NetConfig{

  public static async createWeb3Passives() {

    let nets: any[];

    if (TEST_NETS.includes(Number(global.user.networkId))) {
      //all testnets except current
      nets = TEST_NETS.filter(net => net != Number(global.user.networkId))
    } else {
      //all mainnets except current
      nets = MAIN_NETS.filter(net => net != Number(global.user.networkId))
    }

    let web3Passives = [];
    for (let net of nets) {
      web3Passives.push({
        account: global.user.account,
        networkId: net,
        symbol: this.netById(net).symbol,
        web3Instance: await new Web3(new Web3.providers.HttpProvider(this.netById(net).provider)),
        readOnly: true,
      });
    }
    return web3Passives;
    // this.$store.commit('registerWeb3Passive', web3Passive);
  }

  public static NETWORK_CONFIG = NETWORK_CONFIG;

  public static netById(id:any) {
    return this.NETWORK_CONFIG.filter(net => {
      return net.id === Number(id)
    })[0]
  }

  public static isMainNetwork(net:number){
    if (MAIN_NETS.includes(net)) return true;
    return false;
  }

  public static mainNets() {
    return MAIN_NETS
  }

  public static testNets() {
    return TEST_NETS
  }

  public static networkCurrency(id :any) : any{
    const obj : any = this.netById(id);
    return Object.keys(obj)
    .find(key => obj[key].toString().toUpperCase() === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toUpperCase());
  }

  public isNetworkCurrencyByAddress(address:any) {
    return address.toUpperCase() === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toUpperCase();
  }

  public static requiresAllowanceReset(networkId : any, symbol : any) {
    if (this.netById(networkId).symbol === 'ETH' && symbol === 'USDT') {
      return true;
    }
  }

  public static sixDecimalsCurrency(networkId : any, symbol : any) {
    return sixDecimalCurrencies[networkId].includes(symbol);
  }

  // Cannot buy De-peg bundles with testnet tokens
  public static insuraceDePegTestCurrency(protocol:any,currency:any,web3Symbol:any,selectedCurrency:any) : any {
    if(!protocol.name){
      return [currency,selectedCurrency]
    }
    if(currency !== 'ETH' && protocol.name.includes('De-Peg')){
      switch(web3Symbol){
        case "ETH": selectedCurrency.address = this.netById(1)['USDC']; break;
        case "BSC": selectedCurrency.address = this.netById(56)['USDC']; break;
        case "POLYGON": selectedCurrency.address = this.netById(137)['USDC']; break;
        case "AVALANCHE": selectedCurrency.address = this.netById(43114)['USDCe']; break;
      }
      return ['USDC',selectedCurrency]
    }
    return [currency,selectedCurrency]
  }

  public static isNetworkCurrencyBySymbol(asset:any) {
    return asset === 'ETH' || asset === 'BNB' || asset === 'MATIC' || asset === "AVAX";
  }

  public static getETHNetwork() {
    const activeWeb3 = { symbol: global.user.symbol , web3Instance: global.user.web3, networkId: global.user.networkId }
    const ethNet = [ activeWeb3 , ...global.user.web3Passive].find((net:any) => {
      return net.symbol == 'ETH'
    });
    return ethNet;
  }

  public static isSupportedNetwork (_netId:any) {
    return this.mainNets().includes(_netId) || this.testNets().includes(_netId)
  }

}

export default NetConfig;
