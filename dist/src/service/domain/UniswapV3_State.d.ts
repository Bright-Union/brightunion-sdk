import BigNumber from 'bignumber.js';
declare type State = {
    liquidity: BigNumber;
    sqrtPriceX96: BigNumber;
    tick: number;
    observationIndex: number;
    observationCardinality: number;
    observationCardinalityNext: number;
    feeProtocol: number;
    unlocked: boolean;
};
export default State;
