import BigNumber from 'bignumber.js';
declare type Immutables = {
    factory: string;
    token0: string;
    token1: string;
    fee: number;
    tickSpacing: number;
    maxLiquidityPerTick: BigNumber;
};
export default Immutables;
