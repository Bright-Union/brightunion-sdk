
import BuyReceipt from "../domain/BuyReceipt";
import {_getDistributorContract} from "../helpers/getContract";

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
        _brightProtoAddress:string,
        _web3:any,
        _distributorName : string,
        _contractAddress : string,
        _coverAsset : string,
        _sumAssured : number,
        _coverPeriod : number,
        _coverType : number,
        _maxPriceWithFee : number,
        _data : any,
) :  Promise<BuyReceipt>  {

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
              ).call();
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
export async function buyCoverDecode (
        _brightProtoAddress:string,
        _web3:any,
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
)   {
  console.log('price: ',_premiumAmount)
  return await _getDistributorContract()
              .methods
              .buyCoverDecode(
                //_distributorName,
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

              // testing only:
              .send({
                from: _ownerAddress,
                value: _premiumAmount+1,
                gasLimit: 129913, // 7000000
              })
              .on('transactionHash', (x:any) => {
                console.log('SHOW_CONFIRMATION_DONE', {msg: 'Thanks for using us!', tx: x});
                console.log('TX_CONFIRMING');
                console.log('TRACK_EVENT', {
                  action: 'buy-insurace-policy-hash',
                  category: 'trxHash',
                  label: 'Transaction Hash',
                  value: 1
                });
              })
              .on('confirmation', (confirmationNumber : any, receipt : any) => {
                if (confirmationNumber === 0) {
                  console.log('TRACK_PURCHASE', {
                    tx: receipt.transactionHash,
                    provider: 'insurace'
                  });
                  console.log('TX_CONFIRMED');

                }
              })
              .on('error', (err : any, receipt : any) => {
                console.error(err, receipt)
                console.log('TRACK_EVENT', {
                  action: 'buy-insurace-policy-error',
                  category: 'trxError',
                  label: 'Transaction Error',
                  value: 1
                });
              });
}


export default {
  buyCover, buyCoverDecode
}
