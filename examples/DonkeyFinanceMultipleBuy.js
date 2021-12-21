(async function main() {
    const BrightClient = require('@brightunion/sdk');
    const Web3 = require("web3");
    const detectEthereumProvider = require( "@metamask/detect-provider")

    /**
    * Init web3 BSC
    */
    const provider = await detectEthereumProvider();
    await  provider.request({ method: 'eth_requestAccounts' })

    const web3 = new Web3(provider);

    const brightClient = new BrightClient({web3: web3});

     await brightClient.initialize();

     const principal = 1000; // 1k BNB
     const period    = 90; // 90 days / 3 months

      /**
      *  PANCAKE SWAP
      */
     const PancakeSwap = {
       productId: 37,
       amount: principal * .25, // 25%
       period: period,
       currency: "BNB",
       name:"PancakeSwap",
     };

      /**
      *    ALPACA FINANCE
      */
     const Alpaca = {
       productId: 75,
       amount: principal * .50, // 50%
       period: period,
       currency: "BNB",
       name:"Alpaca",

     };

      /**
      *    AUTO FARM FOR IBALPACA LP TOKENS
      */
     const AutofarmLP = {
       productId: 39,
       amount: principal * .75, // 50%
       period: period,
       currency: "BNB",
       name:"AutofarmLP",
     };

     // Get  Autofarm Quote
     const quotesArray = await brightClient.getMultipleQuotes( [ AutofarmLP, Alpaca ,PancakeSwap ]);
     // Buy Quote
     await brightClient.buyQuotes(allQuotes).then(data => { console.log("Successful Tx data", data);  });

})();
