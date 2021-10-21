declare class BrightUnion {
    web3: object;
    constructor(web3: object);
    covers: {
        getCovers(): Promise<object>;
        getCoversCount(): void;
    };
}
export default BrightUnion;
