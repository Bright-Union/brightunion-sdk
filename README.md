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
const BrightClient = require('@Brightunion/SDK');B

const brightClient= new BrightClient({ <web3_instance> });

// Initialize the client
await brightClient.initialize();

// Get catalog of all risk covers available
const catalog = brightClient.getCatalog();

// Get quotes for a catalog item from all risk providers available
const quotes = brightClient.getQuotes( <amount> , <currency>, <period>, <catalog_item> )

// Buy a quote
brightClient.getQuotes( <quote> )

```
