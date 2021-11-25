import TxEvents from '../config/GoogleA';
import BuyReceipt from "../domain/BuyReceipt";
import {
  _getDistributorsContract,
  _getInsuraceDistributor,
  _getInsuraceDistributorsContract,
  _getNexusDistributor,
  _getNexusDistributorsContract,
  _getBridgePolicyBookContract
} from "../helpers/getContract";

import ERC20Helper from '../helpers/ERC20Helper';
import NetConfig from '../config/NetConfig';

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
export async function buyCover(
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
):Promise<any>{
  let txHash : any;
  if(_distributorName == 'nexus'){
    const sendValue = buyingWithNetworkCurrency ? _maxPriceWithFee : 0;
        if(global.user.networkId === 1 ){
          return await new Promise((resolve, reject) => {
            const nexusAddress = NetConfig.netById(1).nexusDistributor;
            _getNexusDistributor(nexusAddress) // Direct Call to Nexus Contract
            .methods.buyCover(
              _contractAddress,
              _coverAsset,
              _sumAssured,
              _coverPeriod,
              _coverType,
              _maxPriceWithFee,
              _data,
            ).send({ from: _ownerAddress, value: sendValue })
            .on('transactionHash', (res:any) => {
              txHash = res;

              const tx ={
                'hash': txHash ,
                'distributor': 'nexus',
                'premium': _maxPriceWithFee,
                'productId': _contractAddress,
                'amount': _sumAssured,
                'currency': _coverAsset,
                'period': _coverPeriod
              }

              global.events.emit("buy_quote" , { status: "TX_GENERATED" , data: res } );
              isProdNet(global.user.networkId) ? TxEvents.onTxHash(tx) : null;
              resolve({success:res});
             })
            .on('error', (err:any, receipt:any) => {
              global.events.emit("buy_quote" , { status: "REJECTED" } );
              reject( {error: err, receipt:receipt})
            })
            .on('confirmation', (confirmationNumber:any) => {
              if (confirmationNumber === 0) {
                isProdNet(global.user.networkId) ? TxEvents.onTxHash(txHash) : null;
                global.events.emit("buy_quote" , { status: "TX_CONFIRMED" } );

              }
            });
          });
        } else { // if not Ethereum Mainnet
          return await new Promise( async (resolve, reject) => {
            const nexusAddress = await _getDistributorsContract().methods.getDistributorAddress('nexus').call();
            _getNexusDistributorsContract(nexusAddress) // Nexus Call through Bright Protocol Distributors Layer
            .methods.buyCover(
              _contractAddress,
              _coverAsset,
              _sumAssured,
              _coverPeriod,
              _coverType,
              _maxPriceWithFee,
              _data,
            ).send({ from: _ownerAddress, value: sendValue })
            .on('transactionHash', (res:any) => {
              txHash = res;

                const tx ={
                  'hash': txHash ,
                  'distributor': 'nexus',
                  'premium': _maxPriceWithFee,
                  'productId': _contractAddress,
                  'amount': _sumAssured,
                  'currency': _coverAsset,
                  'period': _coverPeriod
                }

                global.events.emit("buy_quote" , { status: "TX_GENERATED" , data: res } );

                isProdNet(global.user.networkId) ? TxEvents.onTxHash(tx) : null;
                resolve({success:res});
            })
            .on('error', (err:any, receipt:any) => {
              global.events.emit("buy_quote" , { status: "REJECTED" } );
              reject( {error: err, receipt:receipt})
            })
            .on('confirmation', (confirmationNumber:any) => {
              if (confirmationNumber === 0) {
                isProdNet(global.user.networkId) ? TxEvents.onTxHash(txHash) : null;
                global.events.emit("buy_quote" , { status: "TX_CONFIRMED" } );

              }
            });
          });
        }

  } else if(_distributorName == 'bridge'){
    const  bookContract = _getBridgePolicyBookContract(_contractAddress, global.user.web3 );
    // convert period from days to bridge epochs (weeks)
    let epochs = Math.min(52, Math.ceil(_coverPeriod / 7));

    return await new Promise((resolve, reject) => {
      bookContract.methods.buyPolicy( epochs, _sumAssured )
      .send({from: global.user.account})
      .on('transactionHash', (transactionHash:any) => {

        txHash = transactionHash;
        const tx ={
          'hash': txHash ,
          'distributor': 'bridge',
          'amount': _sumAssured,
          'productId': _contractAddress,
          'period': epochs,
          'currency':'USDT'
        }
        global.events.emit("buy_quote" , { status: "TX_GENERATED" , data: transactionHash } );

        isProdNet(global.user.networkId) ? TxEvents.onTxHash(tx) : null;
        resolve({success: transactionHash});
      })
      .on('error', (err:any, receipt:any) => {
        global.events.emit("buy_quote" , { status: "REJECTED" } );
        reject( {error: err, receipt:receipt})
      })
      .on('confirmation', (confirmationNumber:any) => {
        if (confirmationNumber === 0) {
          isProdNet(global.user.networkId) ? TxEvents.onTxHash(txHash) : null;
          global.events.emit("buy_quote" , { status: "TX_CONFIRMED" } );

        }
      });
    });
  }
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

export async function buyCoverInsurace(buyingObj:any , buyingWithNetworkCurrency:boolean) {

  let insuraceAddress :any;
  const sendValue = buyingWithNetworkCurrency ? buyingObj.premium : 0;
  let txHash : any;

  // If mainnet call Distributor Directly
  if(global.user.networkId === 1 ){
    insuraceAddress = NetConfig.netById(1).insuraceCover;
    return await new Promise((resolve, reject) => {
      _getInsuraceDistributor(insuraceAddress)
      .methods
      .buyCover(
                  buyingObj.products,
                  buyingObj.durationInDays,
                  buyingObj.amounts,
                  buyingObj.currency,
                  buyingObj.owner,
                  buyingObj.refCode,
                  buyingObj.premium,
                  buyingObj.helperParameters,
                  buyingObj.securityParameters,
                  buyingObj.v,
                  buyingObj.r,
                  buyingObj.s
               )
      .send({ from: buyingObj.owner, value: sendValue})
      .on('transactionHash', (res:any) => {
        txHash = res;
        const tx ={
          'hash': txHash ,
          'distributor': 'insurace',
          'premium': buyingObj.premium ,
          'productId': buyingObj.products[0],
          'amount': buyingObj.amounts[0],
          'currency': buyingObj.currency,
          'period':buyingObj.durationInDays
        }

        global.events.emit("buy_quote" , { status: "TX_GENERATED" , data: res } );
        isProdNet(global.user.networkId) ? TxEvents.onTxHash(tx) : null;
        resolve({success: res});
      })
      .on('error', (err:any, receipt:any) => {
        global.events.emit("buy_quote" , { status: "REJECTED" } );
        reject({error: err , receipt:receipt})
      })
      .on('confirmation', (confirmationNumber:any) => {
        if (confirmationNumber === 0) {
          isProdNet(global.user.networkId) ? TxEvents.onTxHash(txHash) : null;
          global.events.emit("buy_quote" , { status: "TX_CONFIRMED" } );
        }
      });
    });

 // Else call through Bright Union protocol
  } else {
    insuraceAddress = await _getDistributorsContract().methods.getDistributorAddress('insurace').call();
    return await new Promise((resolve, reject) => {
      _getInsuraceDistributorsContract(insuraceAddress)
      .methods
      .buyCoverInsurace(buyingObj)
      .send({ from: buyingObj.owner, value: sendValue })
      .on('transactionHash', (res:any) => {

        txHash = res;

        const tx ={
          'hash': txHash ,
          'distributor': 'insurace',
          'premium': buyingObj.premium ,
          'productId': buyingObj.products[0],
          'amount': buyingObj.amounts[0],
          'currency': buyingObj.currency,
          'period':buyingObj.durationInDays
        }

        global.events.emit("buy_quote" , { status: "TX_GENERATED" , data: res } );
        isProdNet(global.user.networkId) ? TxEvents.onTxHash(tx) : null;
        resolve({success: res});
      })
      .on('error', (err:any, receipt:any) => {
        global.events.emit("buy_quote" , { status: "REJECTED" } );
        reject({error: err , receipt:receipt})
      })
      .on('confirmation', (confirmationNumber:any) => {
        if (confirmationNumber === 0) {
          global.events.emit("buy_quote" , { status: "TX_CONFIRMED" } );
          isProdNet(global.user.networkId)?TxEvents.onTxConfirmation(txHash) :null;
        }
      });
    });
  }

}


const isProdNet = (net:number)  =>{
  if ([1,56,137].includes(net)) return true;
  return false;
}

export default {
  buyCover, buyCoverInsurace
}
