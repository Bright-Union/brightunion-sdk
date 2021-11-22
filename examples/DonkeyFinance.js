(async function main() {
    const BrightClient = require('@brightunion/sdk');
    const Web3 = require("web3");
    const detectEthereumProvider = require( "@metamask/detect-provider")
    
    /**
    * Init web3 BSC
    */
    const provider = await detectEthereumProvider();
    
    const web3 = new Web3(provider);

    const brightClient = new BrightClient({web3: web3.web3Active.web3Instance});

     await brightClient.initialize();

     const principal = 1000; // 1k BNB
     const period    = 90; // 90 days / 3 months

     /**
      *  AUTO FARM
      */
     const Autofarm = {
       productId: 39,
       amount: principal * .25, // 25%
       period: period,
       asset: "BNB",
       name:"Autofarm",
     };

     // Get  Autofarm Quote
     const AutofarmQuote = await brightClient.getQuoteFrom(
       "insurace", Autofarm.amount , Autofarm.asset, Autofarm.period, Autofarm );

     // Buy Quote
     await brightClient.buyQuote(AutofarmQuote).then(data => { console.log("Successful Tx data", data);  });


      /**
      *  PANCAKE SWAP
      */
     const PancakeSwap = {
       productId: 37,
       amount: principal * .25, // 25%
       period: period,
       asset: "BNB",
       name:"PancakeSwap",
     };

     // GET PancakeSwapQuote QUOTE
     const PancakeSwapQuote = await brightClient.getQuoteFrom(
       "insurace", PancakeSwap.amount , PancakeSwap.asset, PancakeSwap.period, PancakeSwap );

     // BUY PancakeSwapQuote QUOTE
     await brightClient.buyQuote( PancakeSwapQuote ).then(data => { console.log("Successful Tx data", data);  });



      /**
      *    ALPACA FINANCE
      */
     const Alpaca = {
       productId: 75,
       amount: principal * .50, // 50%
       period: period,
       asset: "BNB",
       name:"Alpaca",

     };

     // GET ALPACA QUOTE
     const AlpacaQuote = await brightClient.getQuoteFrom(
       "insurace", Alpaca.amount , Alpaca.asset, Alpaca.period, Alpaca );

     // BUY ALPACA QUOTE
     await brightClient.buyQuote( AlpacaQuote ).then(data => { console.log("Successful Tx data", data);  });



      /**
      *    AUTO FARM FOR IBALPACA LP TOKENS
      */
     const AutofarmLP = {
       productId: 39,
       amount: principal * .50, // 50%
       period: period,
       asset: "BNB",
       name:"AutofarmLP",
     };

       // GET Autofarm QUOTE
     const AutofarmLPQuote = await brightClient.getQuoteFrom(
       "insurace", AutofarmLP.amount , AutofarmLP.asset, AutofarmLP.period, AutofarmLP );

       // console.log("AutofarmLPQuote - "  ,  AutofarmLPQuote);

     // BUY Autofarm QUOTE
     await brightClient.buyQuote( AutofarmLPQuote ).then(data => { console.log("Successful Tx data", data);  });

 
})();