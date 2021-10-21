export interface Cover {
    coverType?: string;
    productId?: number;
    contractName?: string;
    coverAmount?: number;
    premium?: number;
    currency?: string;
    contractAddress?: string;
    expiration?: number;
    status?: number;
    refAddress?: string;
}
export interface CoverArray {
    [index: number]: Cover;
}
