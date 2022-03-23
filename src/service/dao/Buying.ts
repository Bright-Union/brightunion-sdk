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

} from "../helpers/getContract";

import ERC20Helper from '../helpers/ERC20Helper';
import NetConfig from '../config/NetConfig';
import { fromWei} from 'web3-utils'

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
  _quoteProtocol:any,
):Promise<any>{
  // let txHash : any;

  let tx:any = {
    'hash': null,
    'distributor': _quoteProtocol.distributorName,
    'premium': fromWei(_quoteProtocol.price),
    'name': _quoteProtocol.name,
    'amount':  fromWei(_quoteProtocol.amount),
    'currency': _quoteProtocol.currency,
    'period': _quoteProtocol.period,
  }

  if(_distributorName == 'nexus'){
    tx.distributor  = 'nexus';
    const sendValue = buyingWithNetworkCurrency ? _maxPriceWithFee : 0;

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

  } else if(_distributorName == 'bridge'){
    const bridgeAddress = await _getDistributorsContract().methods.getDistributorAddress('bridge').call();

    const bridgeV2 = _getBridgeV2Distributor( bridgeAddress, global.user.web3 );
    tx.distributor = 'bridge';

    const brightRewardsAddress = NetConfig.netById(global.user.ethNet.networkId).brightTreasury;
    const policyBook = await  _getBridgeV2PolicyBookContract( _contractAddress, global.user.web3 );

    // convert period from days to bridge epochs (weeks)
    let epochs = Math.min(52, Math.ceil(_coverPeriod / 7));

    return await new Promise((resolve, reject) => {
      bridgeV2.methods.buyCover(
        policyBook.address,
        epochs,
        _sumAssured,
        global.user.account,
        brightRewardsAddress,
        _maxPriceWithFee,
        _data
      )
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

    insuraceAddress = await _getDistributorsContract().methods.getDistributorAddress('insurace').call();

    return await new Promise((resolve, reject) => {
      _getInsuraceDistributorsContract(insuraceAddress)
      .methods
      .buyCoverInsurace(buyingObj)
      .send({ from: buyingObj.owner, value: sendValue })
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
  buyCover, buyCoverInsurace
}
