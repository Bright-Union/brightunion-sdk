
const NEXUS:any = {
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
        exclusions: 'Phishing & malware at individual customer, rug pulls, secret key theft of individual customers.',
        period:'30-365 days, specify per day.',
        minPeriod: 30,
        capitalReq: 'Staked amount is at least 100% of the amount reserved by active covers.',
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
    assetsIds: {
        ETH: '0',
        DAI: '1',
    }
}

const BRIDGE:any = {
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
        exclusions: 'Phishing & malware at individual customer, rug pulls, secret key theft of individual customers',
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
            AVALANCHE: ['AVAX', 'DAIe', 'USDCe', 'USDTe'],
        },
        estimatedGas:  700000,
        description: 'Lorem ipsum...'
    },
    cover: {
        kyc: 'TODO',
        inclusions:'Code Failure & hacks.',
        exclusions: 'Phishing & malware at individual customer, rug pulls, secret key theft of \n' +
            'individual customers Economic & governance attack, oracle failures.',
        period:'15-365 days.',
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
        AVALANCHE: 'DAIe',
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


const PROTOCOL_TYPES:object = {
    protocol: 'In case the user has financial loss due to failure of the protocol caused by code, governance and oracle failures.',
    custodian: 'Protects against hacks and halted withdrawals at crypto wallets.',
    yield: 'In case the market price of a yield tokens deviates from the face value for a significant amount of time.',
    ido:"tbd"
}

export default class RiskCarriers {
  public static INSURACE = INSURACE;
  public static NEXUS = NEXUS;
  public static BRIDGE = BRIDGE;
}
