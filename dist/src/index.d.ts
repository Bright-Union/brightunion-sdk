declare class BrightUnion {
    hash: string;
    constructor(hash: string);
    covers: {
        getCoversCount(): Promise<object>;
        getCovers(): Promise<object>;
    };
}
export default BrightUnion;
