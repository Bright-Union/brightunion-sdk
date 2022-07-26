export default class ERC20Helper {
    static USDTtoERCDecimals(usdtAmount: any): string;
    static ERCtoUSDTDecimals(ercAmount: any): string;
    static approveAndCall(erc20Instance: any, spender: any, amount: any, onTxHash: any, onConfirmation: any, onError: any): Promise<any>;
    static approveUSDTAndCall(erc20Instance: any, spender: any, amount: any, onAllowanceReset: any, onTxHash: any, onConfirmation: any, onError: any): void;
}
