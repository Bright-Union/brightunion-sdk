// const alchemix = require('@/assets/img/alchemix.webp');
// const keeper = require('@/assets/img/keeperDAO.webp');
// const universe = require('@/assets/img/universexyz.webp');
// const zeroExchange = require('@/assets/img/zeroExchange.webp');
// const anchor = require('@/assets/img/anchor.webp');

const NEXUS:object = {
    description: {
        paymentIn: {
            ETH: ['DAI', 'ETH'],
        },
        estimatedGas: 750000,
        description: ''
    },
    cover: {
        kycDescription: 'Requirements for membership are payment of 0.002Eth and a KYC check',
        inclusions:'Code Failure & hacks, Economic & Governance attacks, oracle failures.',
        exclusions: 'Phishing & malware at individual customer, Regpulls, Secret key theft of individual customers',
        period:'30-365 days, specify per day',
        minPeriod: 30,
        capitalReq: 'Staked amount is at least 100% of the amount reserved by active covers ',
        network: 'Ethereum',
        payment:' Single upfront payment'
    },
    claim: {
        definition: '100% of the covered assets will be returned in case it is proven there is a material loss of funds for the holder or the system.',
        requirements: '- Cryptographic evidence that links impacted account to the claimer\n' +
            '- Loss of funds needs to be material' +
            '- Submit claim within 35 days of cover period ending',
        costs: ''
    },
    fallbackQuotation: 'DAI',
}

const BRIDGE:object = {
    description: {
        paymentIn: {
            ETH: ['USDT']
        },
        estimatedGas: 286000,
        description: '100% of the covered assets will be returned in case it is proven there is a material loss of funds for the holder or the system.'
    },
    cover: {
        kyc: 'Not required',
        inclusions:'Code Failure & hacks.',
        exclusions: 'Phishing & malware at individual customer, Regpulls, Secret key theft of individual customers',
        period:'1-52 weeks',
        minPeriod: 7,
        capitalReq: 'Staked amount is at least 100% of the amount reserved by active covers ',
        network: 'Ethereum',
        payment:' Single upfront payment'
    },
    claim: {
        definition: '100% of the covered assets will be returned in case it is proven there is a material loss of funds for the holder or the system.',
        requirements: '- Cryptographic evidence that links impacted account to the claimer\n' +
            '- Loss of funds needs to be material (>20% of covered amount)\n' +
            '- Submit claim during cover period or within 7 days of cover period ending',
        costs: ''
    },
    fallbackQuotation: 'USDT',
}

const INSURACE:any = {
    description: {
        paymentIn: {
            ETH: ['ETH', 'DAI', 'USDC', 'USDT'],
            BSC: ['BNB', 'BUSD', 'BUSD-T', 'USDC'],
            POLYGON: ['MATIC', 'DAI', 'USDT', 'USDC'],
        },
        estimatedGas:  700000,
        description: 'Lorem ipsum...'
    },
    cover: {
        kyc: 'TODO',
        inclusions:'Code Failure & hacks.',
        exclusions: 'Phishing & malware at individual customer, Regpulls, Secret key theft of \n' +
            'individual customers Economic & governance attack, oracle failures',
        period:'15-365 days',
        minPeriod: 15,
        capitalReq: 'TODO',
        network: 'Ethereum, BSC, Polygon',
        payment:' Single upfront payment'
    },
    claim: {
        definition: '100% of the covered assets will be returned in case it is proven there is a material loss of funds for the holder or the system.',
        requirements: '- Cryptographic evidence that links impacted account to the claimer\n' +
            '- Loss of funds needs to be material\n' +
            '- Submit claim during cover period or within 15 days of cover period ending',
    },
    fallbackQuotation: {
        ETH: 'DAI',
        BSC: 'BUSD',
        POLYGON: 'DAI',
    },
}

const STAKE_NOTES:object = {
    general: {
        notes: '- Earn a return by staking projects\n' +
            '- In the event a successful claims is made your stake will be lost'
    },
    nexus: {
        notes: '- NXM token required for staking\n' +
            '- No KYC required when staking through BrightUnion\n' +
            '- APY is an indicative calculation based on the historical payouts over past 8 weeks\n' +
            '- Lockout period of 30 days to unstake to allow any late claims to be assessed',
    },
    bridge: {
        notes: '- BMI token required for staking\n' +
            '- APY is an indicative calculation based on current ratio of capital staked vs covers bought\n' +
            'Lockout period of 30 days to unstake to allow any late claims to be assessed',
    }
}

const CUSTOM_BRIDGE_PROTOCOLS:object = {
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

const PROTOCOL_TYPES:object = {
    protocol: 'In case the user has financial loss due to failure of the protocol caused by code, governance and oracle failures',
    custodian: 'Protects against hacks and halted withdrawals at crypto wallets',
    yield: 'In case the market price of a yield tokens deviates from the face value for a significant amount of time',
    ido:"tbd"
}

export default class RiskCarriers {
  public static INSURACE = INSURACE;
}

// export default { CUSTOM_BRIDGE_PROTOCOLS, NEXUS, BRIDGE, INSURACE }
