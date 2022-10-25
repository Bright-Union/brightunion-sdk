<p align="center">
  <img src="https://img.api.cryptorank.io/coins/bright%20union%201628151410793.png" alt="Bright Union"/>
</p>

# Bright Union SDK
The Bright Union SDK is a set of javascript utilities that enables an easy integration of the Bright Union's multi-chain protocol into any web project.

This SDK will give you access to the Bright Union aggregator contract that combines risk coverage services from:

- [Nexus Mutual](https://nexusmutual.io/)
- [Bridge Mutual](https://www.bridgemutual.io/)
- [Insurace](https://www.insurace.io/)

A swagger API documentation can be found [here](http://api.brightunion.io/protocol/api-docs/).
## Prerequisites

- Node v14+
- Blockchain client node provider:
    - infura, quicknode, anyblock etc...

## Prerequisites for Nexus Quotation
Quotation support for Nexus provider is only allowed by white-listing your URL, please contact us for support and we will add your app to Nexus supported URL's.
Not doing so, will cause Nexus quotations throwing 403 error. Other quotations from other providers will load.

## Installation

```javascript
npm install @brightunion/sdk
```


# Available methods

### Get the full catalog from all our distributors
```
getCatalog()
```

### Get quotes from distributors
```
getQuotes( <amount> , <currency> , <period> , <productId> )
```

### Get a quote from a distributor
```
getQuoteFrom( <distributorName>, <amount>, <currency>, <period>, <productId>)
```

### Buy previously queried quote
```
buyQuote(<preExistingQuote>)
```

### Get details on purchased covers from a distributor
```
getCoversFrom(<DistributorName>)
```

### Get details on purchased covers from all distributors
```
getAllCovers()
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
  // Transaction done
})

// Get purchased covers from all distributors
const coversAll = await brightClient.getAllCovers();

```

## Quote and buy a specific cover product

```javascript
const BrightClient = require('@Brightunion/SDK');B

const brightClient= new BrightClient({ <web3_instance> });

// Initialize the client
await brightClient.initialize();


// Define a Catalog Item from a supported insurance distributor
// INSURACE catalog item example
const catalogItemInsurace = { productId: <Insurace_product_id> };
// BRIDGE catalog item example
const catalogItemBridge = { bridgeProductAddress: <Bridge_product_address> };
// NEXUS catalog item example
const catalogItemNexus = { nexusCoverable: <Nexus_product_address> };

// Get quote from specific distributor on a catalog item
const quote = await brightClient.getQuoteFrom( <distributorName>, <amount> , <currency>, <period>, <catalog_item>);

// Buy quoted cover
brightClient.buyQuote( <quote> ).then(data => {
  // Transaction done
})

```

## Multiple Quotation and Buy
 Quote and buy multiple covers in one transaction. Currently supported only for covers from Insurace.

 ```javascript

 const BrightClient = require('@Brightunion/SDK');B

 const brightClient= new BrightClient({ <web3_instance> });

 // Initialize the client
 await brightClient.initialize();

 // Get catalog of all risk covers available
 const catalog = brightClient.getCatalog();

 // Get  multiple quotes
 const quotesArray = await brightClient.getMultipleQuotes([catalog[0], catalog[1], catalog[3]]);
 // Buy multiple quotes
 await brightClient.buyQuotes(quotesArray).then(data => {
   // Transaction done
 });

 ```

## Provider Network Switch
When provider (Metamask, Trust, WalletConnect etc.) network is switched, new Bright Client should be initialized with the new instance of Web3.
 ```javascript

const brightClient= new BrightClient({ <web3_instance> });

// Initialize the client
await brightClient.initialize();

```


## Events
Events are fired before the main function returns the final response

```
brightClient.events.on(<eventName> , ()=> {})
```
Events which are currently supported are for methods related to Quotation and Buy
- "quote"
- "buy"

### Examples of event subscriptions

```javascript
brightClient.events.on("buy" , (data)=> {})

brightClient.events.on("quote" , (data)=> {})
```

<!-- ## Currently supported distributors
- InsurAce
- Ethereum - ETH
- Binance smart chain -
- Polygon
- Nexus -->



<!-- ## Methods -->
