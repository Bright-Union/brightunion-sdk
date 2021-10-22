
const createCoverable = (obj) => {
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

const bridge_nexus_insurace = [
    // BRIDGE NAME, NEXUS NAME, INSURACE NAME, COMMON NAME
    ['88mph.app', '', '88mph', '88mph'],
    ['1INCH Token', '1Inch (DEX & Liquidity Pools)', '1Inch', '1Inch'],
    ['Aave', 'Aave V2', 'Aave V2', 'Aave V2'],
    ['Aave', 'Aave V1', '', 'Aave V1'],
    ['Anchor', 'Anchor Protocol', 'Anchor', 'Anchor'],
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

const bridge_nexus_insurace_categories = [
    // BRIDGE CATEGORY, NEXUS CATEGORY, INSURACE, COMMON CATEGORY, DESCRIPTION
    ['0' /*CONTRACT*/, 'protocol', 'Smart Contract Vulnerability', 'protocol', 'Protocol hack and failure'],
    ['2', /*SERVICE*/ 'custodian', '', 'custodian', 'Custodian cover'],
    ['1' /*STABLECOIN*/, '', 'Stablecoin De-Peg', 'stable', 'Stable token de-pegging'],
    ['', 'token', '', 'yield', 'Yield de-pegging'],
    ['3' /*EXCHANGE*/, 'custodian', 'Custodian Risk', 'custodian'],
    ['' , '', 'IDO Event Risk', 'ido', 'IDO Event Risk'],
    ['' , '', 'Bundled Cover', 'bundled', 'Bundled cover'],
]

const commonCategory = (category, provider) => {
    try{
        if (provider === 'nexus') {
        return bridge_nexus_insurace_categories.find(cat => cat[1] === category)[3];
        } else if (provider === 'bridge') {
            return bridge_nexus_insurace_categories.find(cat => cat[0] === category)[3];
        } else if (provider === 'insurace') {
            return bridge_nexus_insurace_categories.find(cat => cat[2] === category)[3];
        } else {
            return '';
        }
    } catch (e){ console.error(`Can't map ${category} from provider ${provider}`, e); }
}

const descriptionByCategory = (category) => {
    let categoryFound = bridge_nexus_insurace_categories.find(cat => cat[3] === category);
    if (categoryFound) {
        return categoryFound[4]
    }
}

const coverableDuplicate = (cov1, cov2) => {
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

const quoteFromCoverable = (protocol, coverable, obj, stats) => {
    return {
        risk_protocol: protocol,
        quote: {
            name: coverable.name,
            logoSrc: coverable.logo,
            rating: 4.5,
            amount: obj.amount,
            currency: obj.currency,
            period: obj.period,
            chain: obj.chain,
            chainId: obj.chainId,
            actualPeriod: obj.actualPeriod ? obj.actualPeriod : obj.period,
            protocol: coverable,
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
        stats: stats
    }
}

const stakeQuoteFromCoverable = (protocol, obj) => {
    return {
        risk_protocol: protocol,
        apy: obj.apy,
        totalStaked: obj.totalStaked,
        currency: obj.currency,
        protocol: obj.coverable,
    }
}

const getCoverCommonName = (_coverName , _coverProtocol) => {
  let coverNameIndex = -1;
  if (_coverProtocol === 'bridge') {
      coverNameIndex = bridge_nexus_insurace.findIndex(element => element[0].toUpperCase() === _coverName.toUpperCase())
  } else if(_coverProtocol === 'insurace') {
      coverNameIndex = bridge_nexus_insurace.findIndex(element => element[2].toUpperCase() === _coverName.toUpperCase())
  }
  return coverNameIndex > -1 ? bridge_nexus_insurace[coverNameIndex][3] : _coverName ;
}

module.exports = {
    createCoverable,
    quoteFromCoverable,
    stakeQuoteFromCoverable,
    coverableDuplicate,
    commonCategory,
    descriptionByCategory,
    getCoverCommonName,
}
