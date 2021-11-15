import {_getIERC20Contract} from './helpers/getContract';
import { buyCoverInsurace, buyCover } from "./dao/Buying";
import NetConfig from './config/NetConfig';
import InsuraceApi from './distributorsApi/InsuraceApi';
import ERC20Helper from './helpers/ERC20Helper';



export async function buyQuote(_quoteProtocol: any): Promise<any> {

  if(_quoteProtocol.distributorName == 'bridge'){

    return await buyOnBridge(_quoteProtocol);

  }else if(_quoteProtocol.distributorName == 'nexus'){

    return await buyOnNexus(_quoteProtocol);

  }else if(_quoteProtocol.distributorName == 'insurace'){

    return await buyOnInsurace(_quoteProtocol);

  }
}


/**
 *  Buy on Insurace multi-currency handler method
 *
 * @param _quoteProtocol Quote to buy
 */
export async function buyOnInsurace (_quoteProtocol:any) {

  const chainSymbol:string  = NetConfig.netById(global.user.networkId).symbol;

  // Confirm insurace quoted premium & get security signature params to buy
  const confirmCoverResult:any = await InsuraceApi.confirmCoverPremium(chainSymbol, _quoteProtocol.rawData.params);

  // Map Quote confirmation to Insurace buying object
  const buyingObj = setInsuraceBuyingObject(confirmCoverResult);
  const netConfig:any = NetConfig.netById(global.user.networkId);
  const erc20Address:string = netConfig[_quoteProtocol.currency]
 
  console.log('erc20Address: ',erc20Address);

  const erc20Instance = _getIERC20Contract(erc20Address);
  buyingObj.currency = erc20Address

  // Check for user ETH balance
  const netBalance = await global.user.web3.eth.getBalance(global.user.account);

  if(NetConfig.isNetworkCurrencyBySymbol(_quoteProtocol.currency)){
    if (Number(netBalance) >= (Number)(_quoteProtocol.price)) {
      return callInsurace(buyingObj);
    } else {
      console.log('You have insufficient funds to continue with this transaction...');
      return {error: "You have insufficient funds to continue with this transaction..." }
    }
  }else{


    let account = global.user.account;
    let ercBalance  = await erc20Instance.methods.balanceOf(account).call();



    // balance is enough?
    if (NetConfig.sixDecimalsCurrency(global.user.networkId, _quoteProtocol.currency) &&       //6 digits currency?
    Number(ERC20Helper.USDTtoERCDecimals(ercBalance)) >= (Number)(_quoteProtocol.quote.price)) {

      buyingObj.premium = Number(ERC20Helper.USDTtoERCDecimals(buyingObj.premium))
      
      console.log('proceed with USDT');
      ERC20Helper.approveUSDTAndCall(
        erc20Instance,
        '0x1D2ba34121C4b8C92d3b78953143A283d65d7d47',  // global.user.brightProtoAddress
        buyingObj.premium,
        () => {
          console.log('SHOW_CONFIRMATION_WAITING', {msg: `(1/3) Resetting USDT allowance to 0`});
        },
        () => {
          return callInsurace(buyingObj);
        },
        () => {
          console.log('CLOSE_CONFIRMATION_WAITING');
        })

      } else if (Number(ercBalance) >= (Number)(_quoteProtocol.quote.price)) {

        //proceed with ERC
        ERC20Helper.approveAndCall(
          erc20Instance,
          '0x1D2ba34121C4b8C92d3b78953143A283d65d7d47',  // this.$store.state.insurAceCover().options.address,
          buyingObj.premium,
          () => {
            return callInsurace(buyingObj);
          },
          (err:any) => {
            console.log('ERC20Helper approveAndCall Error - ', err);
          });
        } else {
          console.log('You have insufficient funds to continue with this transaction');
          return {error: 'You have insufficient funds to continue with this transaction' }
        }

      }

    }

/**
 * Contract Call to buy quote
 * @param buyingObj
 * @returns
 */
export async function callInsurace(buyingObj:any){
  return await buyCoverInsurace('insurace', buyingObj);
}

/**
 * Specific buying struct for Insurace Contract
 * @param confirmCoverResult
 *
 * @prop _products
 * @prop _durationInDays
 * @prop _amounts
 * @prop _currency
 * @prop _premiumAmount
 * @prop _helperParameters
 * @prop _securityParameters
 * @prop _v
 * @prop _r
 * @prop _s
 *
 * @returns {Object} insurance buying struct
 */
function setInsuraceBuyingObject(confirmCoverResult:any){
  return {
    products:            confirmCoverResult[0],
    durationInDays:      confirmCoverResult[1],
    amounts:             confirmCoverResult[2],
    currency:            confirmCoverResult[3],
    owner:               confirmCoverResult[4],
    refCode:             confirmCoverResult[5],
    premium:             confirmCoverResult[6],
    helperParameters:    confirmCoverResult[7],
    securityParameters:  confirmCoverResult[8],
    v:                   confirmCoverResult[9],
    r:                   confirmCoverResult[10],
    s:                   confirmCoverResult[11]
  }
}

/**
 *  Buy on Nexus Mutual
 * @param _quoteProtocol Quote to buy
 */
export async function callNexus(_quoteProtocol:any){

    const data = global.user.web3.eth.abi.encodeParameters(
      ['uint', 'uint', 'uint', 'uint', 'uint8', 'bytes32', 'bytes32'],
      [_quoteProtocol.rawData.price, _quoteProtocol.rawData.priceInNXM, _quoteProtocol.rawData.expiresAt,
        _quoteProtocol.rawData.generatedAt, _quoteProtocol.rawData.v, _quoteProtocol.rawData.r, _quoteProtocol.rawData.s],
      );

      // let bridgeProductAddress: any = '0x85A976045F1dCaEf1279A031934d1DB40d7b0a8f';
      let net:any = NetConfig.netById(global.user.networkId);
      let asset = net[_quoteProtocol.rawData.currency]

    return buyCover(
      global.user.account,
      'nexus',
      _quoteProtocol.rawData.contract,
      asset,  // payment asset
      _quoteProtocol.amount.toString(), // sum assured, compliant
      _quoteProtocol.rawData.period, // period
      0, //coverType
      _quoteProtocol.rawData.price, // token amount to cover
      data// random data
    )

}

export async function buyOnNexus(_quoteProtocol:any) : Promise<any>{

  let asset:any;
  if (NetConfig.isNetworkCurrencyBySymbol(_quoteProtocol.rawData.currency)) {
    asset = NetConfig.netById(global.user.networkId).ETH;
  } else if (_quoteProtocol.currency === 'DAI') {
    asset = NetConfig.netById(global.user.networkId).DAI;
  } else {
    //Not supported yet
    throw new Error();
  }

  if(!NetConfig.isNetworkCurrencyBySymbol(_quoteProtocol.rawData.currency)){

    const erc20Instance = await _getIERC20Contract(NetConfig.netById(global.user.networkId).ETH);
    const ercBalance = await erc20Instance.methods.balanceOf(global.user.account).call();

    if (Number(ercBalance) >= (Number)(_quoteProtocol.rawData.price)) {
      // this.showModal = false;

      const onSuccess =  () => {
        return callNexus(_quoteProtocol);
        };
        const onError =  (err:any) => {
          console.log('CLOSE_CONFIRMATION_WAITING - ' , err);
        }

        ERC20Helper.approveAndCall( erc20Instance,  _quoteProtocol.rawData.contract,  _quoteProtocol.rawData.price, onSuccess, onError);

      } else {
        console.log('TRACK_EVENT', {
          action: 'buy-balance-nexus-policy-error',
          category: 'trxError',
          label: 'You have insufficient funds to continue with this transaction',
          value: 1
        });
      }

  }else{

  const netBalance = await global.user.web3.eth.getBalance(global.user.account);
    if (Number(netBalance) >= (Number)(_quoteProtocol.rawData.price)) {
      return callNexus(_quoteProtocol);
    } else {
      console.log("You have insufficient funds to continue with this transaction");
    }
  }

}

export async function callBridge(_quoteProtocol:any){

    let bridgeProductAddress: any = '0x85A976045F1dCaEf1279A031934d1DB40d7b0a8f';

    let net:any = NetConfig.netById(global.user.networkId);
    let asset = net[_quoteProtocol.rawData.currency]

    return buyCover(
      global.user.account,
      'bridge',
      _quoteProtocol.protocol.bridgeProductAddress, //bridge prod address
      asset,  // payment asset
      _quoteProtocol.amount.toString(), // sum assured, compliant
      _quoteProtocol.actualPeriod, // period
      0, //coverType
      _quoteProtocol.rawData.price, // token amount to cover
      global.user.web3.utils.hexToBytes(global.user.web3.utils.numberToHex(500)) // random data
    )

}

export async function buyOnBridge(_quoteProtocol:any) : Promise<any>{

  const erc20Instance = _getIERC20Contract(NetConfig.netById(global.user.networkId).USDT);
  const ercBalance = await erc20Instance.methods.balanceOf(global.user.account).call();

  if (Number(ERC20Helper.USDTtoERCDecimals(ercBalance)) >= (Number)(_quoteProtocol.rawData.price)) {
    // this.showModal = false;
    ERC20Helper.approveUSDTAndCall(
      erc20Instance,
      _quoteProtocol.protocol.bridgeProductAddress,
      _quoteProtocol.rawData.price,
      () => {
        // EventBus.publish('SHOW_CONFIRMATION_WAITING', {msg: `(1/3) Resetting USDT allowance to 0`});
        console.log('Confirmation waiting');
      },
      () => {
        callBridge(_quoteProtocol);
      },
      () => {
        console.log('Error')
        // EventBus.publish('CLOSE_CONFIRMATION_WAITING');
        // this.showModal = true;
      })

    } else {
      console.log('TRACK_EVENT', {
        action: 'buy-bridge-policy-error',
        category: 'trxError',
        label: 'You have insufficient funds to continue with this transaction',
        value: 1
      });
    }

    return;

  }


  export default buyQuote
