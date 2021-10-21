declare class BrightUnion {
    hash: string;
    constructor(hash: string);
    covers: {
        getCoversCount(): any;
        getCovers(): void;
    };
}
export default BrightUnion;
