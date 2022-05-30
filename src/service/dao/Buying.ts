import GoogleEvents from '../config/GoogleEvents';
import BuyReceipt from "../domain/BuyReceipt";
import {
  _getDistributorsContract,
  _getInsuraceDistributor,
  _getInsuraceDistributorsContract,
  _getNexusDistributorsContract,
  _getBridgeV2Distributor,
  _getBridgeV2PolicyBookContract,
  _getBridgeV2PolicyBookFacade,
  _getEaseContract,

} from "../helpers/getContract";

import ERC20Helper from '../helpers/ERC20Helper';
import NetConfig from '../config/NetConfig';
import { fromWei, toBN, toWei} from 'web3-utils'
import axios from 'axios'

/**
* Returns a transaction receipt.
* (Emits a boughtCover event at contract level)
*
* @remarks At the moment this function is only supported
* when intended distributor is Bridge & Nexus, for Insurace please
* refer to buyCoverDecode function.2
*
* @param _distributorName
* @param _contractAddress
* @param _coverAsset
* @param _sumAssured
* @param _coverPeriod
* @param _coverType
* @param _maxPriceWithFee
* @param _data
* @returns BuyReceipt Object
*/
export async function buyCoverBridge(
  _ownerAddress : string,
  _distributorName : string,
  _contractAddress : string,
  _coverAsset : string,
  _sumAssured : number,
  _coverPeriod : number,
  _coverType : any,
  _maxPriceWithFee : number,
  _data : any,
  buyingWithNetworkCurrency:boolean,
  _quoteProtocol:any,
):Promise<any>{
  let tx:any;
  tx = {
    'hash': null,
    'distributor': "bridge",
    'premium': fromWei(_quoteProtocol.price),
    'name': _quoteProtocol.name,
    'amount':  fromWei(_quoteProtocol.amount),
    'currency': _quoteProtocol.currency,
    'period': _quoteProtocol.period,
  }

    const brightRewardsAddress = NetConfig.netById(global.user.ethNet.networkId).brightTreasury;
    const policyBook = await  _getBridgeV2PolicyBookContract( _contractAddress, global.user.web3 );

    const policyBookFacadeAddress = await  policyBook.methods.policyBookFacade().call();
    const policyBookFacade = _getBridgeV2PolicyBookFacade( policyBookFacadeAddress, global.user.web3 );

    // convert period from days to bridge epochs (weeks)
    let epochs = Math.min(52, Math.ceil(_coverPeriod / 7));

    return await new Promise((resolve, reject) => {
      policyBookFacade.methods.buyPolicyFromDistributorFor( global.user.account, epochs, _sumAssured, brightRewardsAddress )
      .send({from: global.user.account})
      .on('transactionHash', (transactionHash:any) => {
        tx.hash = transactionHash;
        global.events.emit("buy" , { status: "TX_GENERATED" , data: transactionHash } );
        GoogleEvents.onTxHash(tx);
        resolve({success: transactionHash});
      })
      .on('error', (err:any, receipt:any) => {
        global.events.emit("buy" , { status: "REJECTED" } );
        GoogleEvents.onTxRejected(tx);
        reject( {error: err, receipt:receipt})
      })
      .on('confirmation', (confirmationNumber:any) => {
        if (confirmationNumber === 0) {
          GoogleEvents.onTxConfirmation(tx);
          global.events.emit("buy" , { status: "TX_CONFIRMED" } );

        }
      });
    });

}

export async function buyCoverEase(
  _ownerAddress : string,
  _contractAddress : string,
  _coverAsset : string,
  _sumAssured : number,
  _coverPeriod : number,
  _coverType : any,
  _maxPriceWithFee : number,
  _data : any,
  _quoteProtocol:any,
):Promise<any>{

  let tx:any;
  tx = {
    'hash': null,
    'distributor': "ease",
    'name': _quoteProtocol.name,
    'amount':  _data.amount,
    'currency': _quoteProtocol.asset,
  }

  return await new Promise( async (resolve, reject) => {
    await _getEaseContract(_quoteProtocol.vault.address).methods.mintTo(
      _data.user,
      NetConfig.NETWORK_CONFIG[0].brightTreasury,
      _data.amount,
      _data.expiry,
      _data.vInt,
      _data.r,
      _data.s,
      _quoteProtocol.vault.liquidation_amount,
      _quoteProtocol.vault.liquidation_proof
    ).send({ from: _data.user})
    .on('transactionHash', (res:any) => {
      tx.hash = res
      global.events.emit("buy" , { status: "TX_GENERATED" , data: res } );
      GoogleEvents.onTxHash(tx);
      resolve({success:res});
    })
    .on('error', (err:any, receipt:any) => {
      global.events.emit("buy" , { status: "REJECTED" } );
      GoogleEvents.onTxRejected(tx);
      reject( {error: err, receipt:receipt})
    })
    .on('confirmation', (confirmationNumber:any) => {
      if (confirmationNumber === 0) {
        GoogleEvents.onTxConfirmation(tx);
        global.events.emit("buy" , { status: "TX_CONFIRMED" } );

      }
    });
  });

}

export async function buyCoverNexus(
  _ownerAddress : string,
  _distributorName : string,
  _contractAddress : string,
  _coverAsset : string,
  _sumAssured : number,
  _amountOut: number,
  _coverPeriod : number,
  _coverType : any,
  _maxPriceWithFee : number,
  buyingWithNetworkCurrency:boolean,
  _quoteProtocol:any,
  _swapVia : any,
  _swapVia2 : any,
  _poolFeeA : any,
  _poolFeeB : any,
  _poolFeeC : any,
  _uniProtocol: any,
) {

  let tx:any = {
    'hash': null,
    'distributor': _quoteProtocol.distributorName,
    'premium': fromWei(_quoteProtocol.price),
    'name': _quoteProtocol.name,
    'amount':  fromWei(_quoteProtocol.amount),
    'currency': _quoteProtocol.currency,
    'period': _quoteProtocol.period,
  }

const sendValue = buyingWithNetworkCurrency ? _maxPriceWithFee : 0;

  return await new Promise( async (resolve, reject) => {
    // const nexusAddress = await _getDistributorsContract(global.user.web3).methods.getDistributorAddress('nexus').call();
    const nexusAddress = NetConfig.netById(1).nexusDistributor;

     const data = global.user.web3.eth.abi.encodeParameters(
  ['address', 'address', 'uint24', 'uint24' ,'uint24', 'string',
  'uint256', 'uint256', 'uint256',
  'uint256', 'uint8', 'bytes32', 'bytes32'],
  [  _swapVia, _swapVia2, _poolFeeA, _poolFeeB, _poolFeeC, _uniProtocol,
    _quoteProtocol.rawData.price,
    _quoteProtocol.rawData.priceInNXM,
    _quoteProtocol.rawData.expiresAt,
    _quoteProtocol.rawData.generatedAt,
    _quoteProtocol.rawData.v,
    _quoteProtocol.rawData.r,
    _quoteProtocol.rawData.s
  ]);

    _getNexusDistributorsContract(nexusAddress) // Nexus Call through Bright Protocol Distributors Layer
    .methods.buyCover(
      _contractAddress,
      _coverAsset,
      _sumAssured,
      _amountOut,
      _coverPeriod,
      _coverType,
      _maxPriceWithFee,
      data,
    ).send({ from: _ownerAddress, value: sendValue })
    .on('transactionHash', (res:any) => {
      tx.hash = res
      global.events.emit("buy" , { status: "TX_GENERATED" , data: res } );
      GoogleEvents.onTxHash(tx);
      resolve({success:res});
    })
    .on('error', (err:any, receipt:any) => {
      global.events.emit("buy" , { status: "REJECTED" } );
      GoogleEvents.onTxRejected(tx);
      reject( {error: err, receipt:receipt})
    })
    .on('confirmation', (confirmationNumber:any) => {
      if (confirmationNumber === 0) {
        GoogleEvents.onTxConfirmation(tx);
        global.events.emit("buy" , { status: "TX_CONFIRMED" } );

      }
    });
  });
}


/**
* Returns a transaction receipt.
* (Emits a boughtCover event at contract level)
*
* @remarks Buy coverages for Insurance
*
* @param _distributorName
* @param _products
* @param _durationInDays
* @param _amounts
* @param _currency
* @param _premiumAmount
* @param _helperParameters
* @param _securityParameters
* @param _v
* @param _r
* @param _s
* @returns  BuyReceipt Object
*/

export async function buyCoverInsurace(buyingObj:any , buyingWithNetworkCurrency:boolean, _quotes:any) {

  let insuraceAddress :any;
  const sendValue = buyingWithNetworkCurrency ? buyingObj.premium : 0;

  let tx:any = {
    'hash': null,
    'distributor': 'insurace',
    'premium': _quotes.price ,
    'name': _quotes.name,
    'amount': _quotes.amount,
    'currency': _quotes.currency,
    'period':_quotes.period,
  }

    insuraceAddress = await _getDistributorsContract(global.user.web3).methods.getDistributorAddress('insurace').call();

      const contractInstance = _getInsuraceDistributorsContract(insuraceAddress);
      let gasEstimationCost : any = null;
      let estimatedGasPrice:any = null;

      let buyTransactionData:any = {
        from: buyingObj.owner,
        value: sendValue,
      }

      if(global.user.networkId == 137 ){
        let  gasPriceNow =  await axios.get("https://gasstation-mainnet.matic.network/")
        .then((response:any) => {
          return response.data.standard;
        },
        (error) => {
          console.error('gasstation-mainnet.matic.network error - ', error);
          return 50;
        });

        let gasPrice = Math.round(Number(gasPriceNow));
        estimatedGasPrice = toWei(toBN(Number(gasPrice)), "gwei").toString();

        await contractInstance.methods.buyCoverInsurace(buyingObj).estimateGas({
          from: buyingObj.owner,
          gas: estimatedGasPrice,
          value:_quotes.price
        }).then(function(gasAmount:any){ gasEstimationCost = gasAmount && gasAmount.toString() })
        .catch(function(error:any){
          console.info("Simulated transaction to estimate gas costs", error)
        });

        buyTransactionData.gas = gasEstimationCost;
        buyTransactionData.gasLimit = 2500000;
        buyTransactionData.gasPrice = estimatedGasPrice;
      }

      return await new Promise((resolve, reject) => {
          contractInstance.methods
          .buyCoverInsurace(buyingObj)
          .send(buyTransactionData)
          .on('transactionHash', (res:any) => {
            tx.hash = res;
            global.events.emit("buy" , { status: "TX_GENERATED" , data: res } );
            GoogleEvents.onTxHash(tx);
            resolve({success: res});
          })
          .on('error', (err:any, receipt:any) => {
            global.events.emit("buy" , { status: "REJECTED" } );
            GoogleEvents.onTxRejected(tx);
            reject({error: err , receipt:receipt})
          })
          .on('confirmation', (confirmationNumber:any) => {
            if (confirmationNumber === 0) {
              global.events.emit("buy" , { status: "TX_CONFIRMED" } );
              GoogleEvents.onTxConfirmation(tx);
            }
          });
        });
}


export default {
  buyCoverBridge, buyCoverInsurace, buyCoverNexus, buyCoverEase
}
