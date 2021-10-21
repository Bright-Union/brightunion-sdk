import { getCoversCount } from "./service/covers";
declare class BrightUnion {
    hash: string;
    constructor();
    getCovers(): Promise<object>;
    covers: {
        getCoversCount: typeof getCoversCount;
        getCovers(): Promise<object>;
    };
    staking: {
        staking: string;
    };
}
export default BrightUnion;
