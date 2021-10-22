import { getCovers } from "./service/Covers";
declare class Distributors {
    web3: any;
    constructor(_web3: any);
    getCovers(): Promise<typeof getCovers>;
    getCoversCount(_distributorName: string, _owner: string, _isActive: boolean): Promise<number>;
}
export default Distributors;
