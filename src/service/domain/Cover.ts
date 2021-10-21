
declare interface  Cover {
        coverType           ? : string ;
        productId           ? : number ;
        contractName        ? : string ;
        coverAmount         ? : number ;
        premium             ? : number ;
        currency            ? : string ;
        contractAddress     ? : string ;
        expiration          ? : number ;
        status              ? : number ;
        refAddress          ? : string ;
}

// declare interface CoversArray {
//         [index:number] : Cover;
// }

export default Cover
