<p align="center">
  <img src="https://img.api.cryptorank.io/coins/bright%20union%201628151410793.png" alt="Bright Union"/>
</p>

# Bright Union SDK
The Bright Union SDK is a set of javascript utilities that enables an easy integration of the Bright Union's multi-chain protocol into any web project.

This SDK will give you access to the Bright Union aggregator contract that combines risk coverage services from:

- [Nexus Mutual](https://nexusmutual.io/)
- [Bridge Mutual](https://www.bridgemutual.io/)
- [Inurace](https://www.insurace.io/)

A swagger API documentation can be found [here](http://api.brightunion.io/protocol/api-docs/).
## Prerequisites

- Node v14+
- Blockchain client node provider:
    - infura, quicknode, anyblock etc...

## Installation

```javascript
npm install @brightunion/sdk
```

## Basic Use

```javascript
const BrightClient = require('@Brightunion/SDK');

const brightClient= new BrightClient({ <web3_instance> });

// Initialize the client
await brightClient.initialize();

// Get catalog of all risk covers available
const catalog = brightClient.getCatalog();

// Get quotes for a catalog item from all risk providers available
const quotes = brightClient.getQuotes( <amount> , <currency>, <period>, <catalog_item> )

// Buy quoted cover
brightClient.buyQuote( <quote> ).then(data => {
  console.log( 'success: ' , data.status, 'txHash: ' , data.transactionHash );
})

```

## Quote and buy a specific cover product

```javascript
const BrightClient = require('@Brightunion/SDK');B

const brightClient= new BrightClient({ <web3_instance> });

// Initialize the client
await brightClient.initialize();


//Define a Catalog Item from a supported insurance distributor
//INSURACE catalog item example
const catalogItemInsurace = { productId: <Insurace_product_id> };
//BRIDGE catalog item example
const catalogItemBridge = { bridgeProductAddress: <Bridge_product_address> };
//NEXUS catalog item example
const catalogItemNexus = { nexusCoverable: <Nexus_product_address> };

// Get quote from specific distributor on a catalog item
const quote = await state.brightClient.getQuoteFrom( <distributorName>, <amount> , <currency>, <period>, <catalog_item>);

// Buy quoted cover
brightClient.buyQuote( <quote> ).then(data => {
  console.log( 'success: ' , data.status, 'txHash: ' , data.transactionHash );
})

```

<!-- ## Currently supported distributors
- InsurAce
- Ethereum - ETH
- Binance smart chain -
- Polygon
- Nexus -->



<!-- ## Methods -->
