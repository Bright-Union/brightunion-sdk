declare class GoogleEvents {
    static onBUInit: () => void;
    static setFormatCurrency: (_currency: any) => any;
    static catalog: () => void;
    static quote: (_quote: any, _type: any) => void;
    static multiBuy: (_items: any) => void;
    static buy: (_quote: any) => void;
    static buyRejected: (_message: any, _quote: any) => void;
    static onTxHash: (tx: any) => void;
    static onTxConfirmation: (tx: any) => void;
    static onTxRejected: (tx: any) => void;
}
export default GoogleEvents;
