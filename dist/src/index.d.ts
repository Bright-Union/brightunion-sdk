import { getCovers } from "./service/covers";
declare class BrightUnion {
    hash: string;
    constructor(hash: string);
    covers: {
        getCovers(): Promise<typeof getCovers>;
        getCoversCount(): any;
    };
}
export default BrightUnion;
