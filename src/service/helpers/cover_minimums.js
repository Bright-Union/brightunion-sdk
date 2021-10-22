
const COVER_MINIMUMS = {
    'bridge': {
      allNets: true,
      USDT: 100,
    },
    'nexus': {
      allNets: true,
      DAI: 10,
      ETH: 1,
    },
    'insurace': {
      allNets: false,
      network:{
        ETH: {
          DAI: 1000,
          USDC: 1000,
          USDT: 1000,
          ETH: 1,
        },
        BSC: {
          DAI: 1000,
          BUSD: 1000,
          USDC: 1000,
          'BUSD-T': 1000,
          BNB: 3,
        },
        POLYGON: {
          DAI: 1000,
          USDC: 1000,
          USDT: 1000,
          MATIC: 500,
        }
      }
    },
}

function getCoverMin( _partner, _networkSymbol , _currency) {
  let partner =  COVER_MINIMUMS[_partner];
  let min = null
  if(partner.allNets){
    min = partner[_currency];
  }else {
    min = partner.network[_networkSymbol][_currency];
  }
  return min ? min : 0 ;
}

module.exports = {
    COVER_MINIMUMS,
    getCoverMin,
}
