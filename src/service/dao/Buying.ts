
import NetConfig from "../config/NetConfig";
import BuyReceipt from "../domain/BuyReceipt";
import {_getDistributorContract, getInsurAceCoverContract} from "../helpers/getContract";

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
){
  return await _getDistributorContract()
              .methods
              .buyCover(
                _distributorName,
                _contractAddress,
                _coverAsset,
                _sumAssured,
                _coverPeriod,
                _coverType,
                _maxPriceWithFee,
                _data,
              )
              .send({
                from: _ownerAddress,
                value: _maxPriceWithFee+1,
                gasLimit: 129913, // 7000000
              })
              .on('transactionHash', (x:any) => {
                console.log('SHOW_CONFIRMATION_DONE', {msg: 'Thanks for using us!', tx: x});
                console.log('TX_CONFIRMING');
                console.log('TRACK_EVENT', {
                  action: 'buy-bridge-policy-hash',
                  category: 'trxHash',
                  label: 'Transaction Hash',
                  value: 1
                });
              })
              .on('confirmation', (confirmationNumber:any, receipt:any) => {
                if (confirmationNumber === 0) {
                  console.log('TRACK_PURCHASE', {
                    tx: receipt.transactionHash,
                    provider: 'bridge',
                    value: this.readablePrice,
                    currency: '0xcc54b12a18f2C575CA97991046090f43C3070aA0',
                    name: this.quote.name,
                    period: this.quote.actualPeriod,
                  });
                  console.log('TX_CONFIRMED');
                }
              })
              .on('error', (err:any, receipt:any) => {
                console.error(err, receipt)
                console.log('TRACK_EVENT', {
                  action: 'buy-bridge-policy-error',
                  category: 'trxError',
                  label: 'Transaction Error',
                  value: 1
                });
                console.log('CLOSE_CONFIRMATION_WAITING',err.message);
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
export async function buyCoverInsurace (
        _ownerAddress:any,
        _distributorName : string,
        _products : Array<number>,
        _durationInDays : Array<number>,
        _amounts : Array<number>,
        _currency : string,
        _premiumAmount : number,
        _helperParameters : Array<number>,
        _securityParameters : Array<number>,
        _v : Array<number>,
        _r : Array<number>,
        _s: Array<number>,
){
  console.log('calling: buyCoverInsurace - ' , _premiumAmount )
  return await _getDistributorContract()
              .methods
              .buyCoverInsurace(
                _products,
                _durationInDays,
                _amounts,
                _currency,
                _ownerAddress,
                _premiumAmount,
                _helperParameters,
                _securityParameters,
                _v,
                _r,
                _s
              )
              .send({
                from: _ownerAddress,
                value: _premiumAmount,
                // gasLimit: 129913, // 7000000
              })
              .on('transactionHash', (x:any) => {
                console.log('SHOW_CONFIRMATION_DONE', {msg: 'Thanks for using us!', tx: x});
                console.log('TX_CONFIRMING');
                console.log('TRACK_EVENT', {
                  action: 'buy-bridge-policy-hash',
                  category: 'trxHash',
                  label: 'Transaction Hash',
                  value: 1
                });
              })
              .on('confirmation', (confirmationNumber:any, receipt:any) => {
                if (confirmationNumber === 0) {
                  console.log('TRACK_PURCHASE', {
                    tx: receipt.transactionHash,
                    provider: 'bridge',
                    value: this.readablePrice,
                    currency: '0xcc54b12a18f2C575CA97991046090f43C3070aA0',
                    name: this.quote.name,
                    period: this.quote.actualPeriod,
                  });
                  console.log('TX_CONFIRMED');
                }
              })
              .on('error', (err:any, receipt:any) => {
                console.error(err, receipt)
                console.log('TRACK_EVENT', {
                  action: 'buy-bridge-policy-error',
                  category: 'trxError',
                  label: 'Transaction Error',
                  value: 1
                });
                console.log('CLOSE_CONFIRMATION_WAITING',err.message);
              });
}


export async function buyCoverInsuraceTest (
    confirmCoverResult:any
){

  // let insuraceCoverInstance:any = await getInsurAceCoverContract(NetConfig.netById(global.user.networkId).insuraceCover, global.user.web3 )
  let insuraceCoverInstance:any = await getInsurAceCoverContract( "0xC7F07402105eeE47E17cD5FB36Eee8d9FF2C8f7b" , global.user.web3 );
  let insuraceCover:any = () => insuraceCoverInstance ;

  console.log('calling: buyCoverInsurace TEST - ' , insuraceCoverInstance, '//' , insuraceCover, '//',  confirmCoverResult )

  return await insuraceCover()
              .methods
              .buyCoverDecode(
                confirmCoverResult[0],
                confirmCoverResult[1],
                confirmCoverResult[2],
                confirmCoverResult[3],
                confirmCoverResult[4],
                // confirmCoverResult[5],
                confirmCoverResult[6],
                confirmCoverResult[7],
                confirmCoverResult[8],
                confirmCoverResult[9],
                confirmCoverResult[10],
                confirmCoverResult[11]
              )
              .send({
                from: global.user.account,
                value: confirmCoverResult[6],
                // gasLimit: 129913, // 7000000
              })
              .on('transactionHash', (x:any) => {
                console.log('SHOW_CONFIRMATION_DONE', {msg: 'Thanks for using us!', tx: x});
                console.log('TX_CONFIRMING');
                console.log('TRACK_EVENT', {
                  action: 'buy-bridge-policy-hash',
                  category: 'trxHash',
                  label: 'Transaction Hash',
                  value: 1
                });
              })
              .on('confirmation', (confirmationNumber:any, receipt:any) => {
                if (confirmationNumber === 0) {
                  console.log('TRACK_PURCHASE', {
                    tx: receipt.transactionHash,
                    provider: 'bridge',
                    value: this.readablePrice,
                    currency: '0xcc54b12a18f2C575CA97991046090f43C3070aA0',
                    name: this.quote.name,
                    period: this.quote.actualPeriod,
                  });
                  console.log('TX_CONFIRMED');
                }
              })
              .on('error', (err:any, receipt:any) => {
                console.error(err, receipt)
                console.log('TRACK_EVENT', {
                  action: 'buy-bridge-policy-error',
                  category: 'trxError',
                  label: 'Transaction Error',
                  value: 1
                });
                console.log('CLOSE_CONFIRMATION_WAITING',err.message);
              });
}




export default {
  buyCover, buyCoverInsurace, buyCoverInsuraceTest
}
