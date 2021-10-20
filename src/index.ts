import getCoversCount from "./service/covers";
import getDistributorAddress from "./service/helpers/getDistributorAddress";

export class BrightUnion {
    chain: {};
    constructor() {
        this.chain = {};
    }
}


export default {BrightUnion , getDistributorAddress, getCoversCount}
