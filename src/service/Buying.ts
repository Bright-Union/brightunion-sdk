import {_getIERC20Contract,_getInsuraceDistributor,_getDistributorsContract, _getBridgeRegistryContract} from './helpers/getContract';
import { buyCoverInsurace, buyCover } from "./dao/Buying";
import NetConfig from './config/NetConfig';
import InsuraceApi from './distributorsApi/InsuraceApi';
import ERC20Helper from './helpers/ERC20Helper';
import GoogleEvents from './config/GoogleEvents';



export async function buyQuote(_quoteProtocol: any): Promise<any> {

  GoogleEvents.buy(_quoteProtocol);

  if(_quoteProtocol.distributorName == 'bridge'){

    return await buyOnBridge(_quoteProtocol);

  }else if(_quoteProtocol.distributorName == 'nexus'){

    return await buyOnNexus(_quoteProtocol);

  }else if(_quoteProtocol.distributorName == 'insurace'){

    return await buyOnInsurace(_quoteProtocol);

  }
}


export async function buyMultipleQuotes (_quotes:any):Promise<any> {

  GoogleEvents.multiBuy();

  return buyMutipleOnInsurace(_quotes);
}

export async function buyMutipleOnInsurace (_quotes:any):Promise<any> {

  const chainSymbol:string  = NetConfig.netById(global.user.networkId).symbol;

  // Confirm insurace quoted premium & get security signature params to buy
  const confirmCoverResult:any = await InsuraceApi.confirmCoverPremium(chainSymbol, _quotes.params);

  // Map Quote confirmation to Insurace buying object
  const buyingObj = setInsuraceBuyingObject(confirmCoverResult);

  let buyingWithNetworkCurrency = true;
  return  callInsurace(buyingObj, buyingWithNetworkCurrency);
}


/**
 *  Buy on Insurace multi-currency handler method
 *
 * @param _quoteProtocol Quote to buy
 */
export async function buyOnInsurace (_quoteProtocol:any):Promise<any> {


  const chainSymbol:string  = NetConfig.netById(global.user.networkId).symbol;

  // Confirm insurace quoted premium & get security signature params to buy
  const confirmCoverResult:any = await InsuraceApi.confirmCoverPremium(chainSymbol, _quoteProtocol.rawData.params);

  // Map Quote confirmation to Insurace buying object
  const buyingObj = setInsuraceBuyingObject(confirmCoverResult);

  // Check for user ETH balance
  const netBalance = await global.user.web3.eth.getBalance(global.user.account);

  global.events.emit("buy" , { status: "INITIALIZED"} );

  let insuraceAddress :any;
  if(global.user.networkId === 1 ){ insuraceAddress = NetConfig.netById(1).insuraceCover; }
  else { insuraceAddress = await _getDistributorsContract().methods.getDistributorAddress('insurace').call();}

  if(NetConfig.isNetworkCurrencyBySymbol(_quoteProtocol.currency)){
    if (Number(netBalance) >= (Number)(_quoteProtocol.price)) {
      global.events.emit("buy" , { status: "CONFIRMATION" , type:"main", count:1 , current:1 } );
      return callInsurace(buyingObj , true);
    } else {
      global.events.emit("buy" , { status: "ERROR" , message:"You have insufficient funds to continue with this transaction" } );
      return { error: "You have insufficient funds to continue with this transaction..." };
    }
  }else{
    const netConfig:any = NetConfig.netById(global.user.networkId);
    const erc20Address:string = netConfig[_quoteProtocol.currency];

    const erc20Instance = _getIERC20Contract(erc20Address);

    let account = global.user.account;
    let ercBalance  = await erc20Instance.methods.balanceOf(account).call();

    // balance is enough?
    if (NetConfig.sixDecimalsCurrency(global.user.networkId, _quoteProtocol.currency) &&       //6 digits currency?
    Number(ERC20Helper.USDTtoERCDecimals(ercBalance)) >= (Number)(_quoteProtocol.price)) {

      buyingObj.premium = Number(ERC20Helper.USDTtoERCDecimals(buyingObj.premium))

      //proceed with USDT
      global.events.emit("buy" , { status: "CONFIRMATION" , type:"approve_spending" , count:2 , current:1 } );
      return ERC20Helper.approveUSDTAndCall(
        erc20Instance,
        insuraceAddress,
        buyingObj.premium,
        () => {
          global.events.emit("buy" , { status: "CONFIRMATION" , type:"reset_usdt_allowance" , count:3 , current:2 } );
        },
        () => {
          buyingObj.premium = Number(ERC20Helper.ERCtoUSDTDecimals(buyingObj.premium))
          global.events.emit("buy" , { status: "CONFIRMATION" , type:"main", count:2 , current:2 } );
          return callInsurace(buyingObj, false);
        },
        () => {
          global.events.emit("buy" , { status: "REJECTED" } );
          return {error: "Confirmation rejected"}
        })

      } else if (Number(ercBalance) >= (Number)(_quoteProtocol.price)) {
        //proceed with ERC

        global.events.emit("buy" , { status: "CONFIRMATION" , type:"approve_spending" , count:2 , current:1 } );

        return await ERC20Helper.approveAndCall(
          erc20Instance,
          insuraceAddress,  // global.user.brightProtoAddress //0x7e758e0D330B9B340A7282029e73dA448fb4BdB6
          buyingObj.premium,
          () => {

            global.events.emit("buy" , { status: "CONFIRMATION" , type:"main" , count:2 , current:2 } );
            return callInsurace(buyingObj , false);
          },
          (err:any) => {
            global.events.emit("buy" , { status: "REJECTED" } );
            return {error: err , message: 'ERC20Helper approveAndCall Error'};
          });
        } else {
          global.events.emit("buy" , { status: "ERROR" , message:"You have insufficient funds to continue with this transaction" } );
          return {error: 'You have insufficient funds to continue with this transaction' }
        }

      }

    }

/**
 * Contract Call to buy quote
 * @param buyingObj
 * @returns
 */
export async function callInsurace(buyingObj:any, buyingWithNetworkCurrency: boolean):Promise<any>{
  return await buyCoverInsurace( buyingObj, buyingWithNetworkCurrency );
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
export async function callNexus(_quoteProtocol:any , buyingWithNetworkCurrency: boolean){

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
      _quoteProtocol.price.toString(), // token amount to cover with FEE
      data ,// random data
      buyingWithNetworkCurrency
    )

}

export async function buyOnNexus(_quoteProtocol:any) : Promise<any>{

  let asset:any;
  if (NetConfig.isNetworkCurrencyBySymbol(_quoteProtocol.rawData.currency)) {
    asset = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  } else if (_quoteProtocol.currency === 'DAI') {
    asset = NetConfig.netById(global.user.networkId).DAI;
  } else {
    //Not supported yet
    throw new Error();
  }

  global.events.emit("buy" , { status: "INITIALIZED"} );

  if(!NetConfig.isNetworkCurrencyBySymbol(_quoteProtocol.rawData.currency)){

    const erc20Instance = await _getIERC20Contract(asset);
    const ercBalance = await erc20Instance.methods.balanceOf(global.user.account).call();

    if (Number(ercBalance) >= (Number)(_quoteProtocol.rawData.price)) {

      const onSuccess =  () => {
        global.events.emit("buy" , { status: "CONFIRMATION" , type:"main" , count:2 , current:2 } );
        return callNexus(_quoteProtocol, false);
      };
      const onError =  (err:any) => {
        global.events.emit("buy" , { status: "REJECTED" } );
        return {error : "Confirmation rejected"};
      }

      global.events.emit("buy" , { status: "CONFIRMATION" , type:"approve_spending" , count:2 , current:1 } );

      return await ERC20Helper.approveAndCall( erc20Instance,  _quoteProtocol.rawData.contract,  _quoteProtocol.rawData.price, onSuccess, onError);

    } else {
      global.events.emit("buy" , { status: "ERROR" , message:"You have insufficient funds to continue with this transaction" } );
      return{ error: "You have insufficient funds to continue with this transaction" }
    }

  }else{

    const netBalance = await global.user.web3.eth.getBalance(global.user.account);
    if (Number(netBalance) >= (Number)(_quoteProtocol.rawData.price)) {
      global.events.emit("buy" , { status: "CONFIRMATION" , type:"main" , count:1 , current:1 } );

      return callNexus(_quoteProtocol, true);
    } else {
      global.events.emit("buy" , { status: "ERROR" , message:"You have insufficient funds to continue with this transaction" } );
      return {error: 'You have insufficient funds to continue with this transaction' }
    }
  }

}

export async function callBridge(_quoteProtocol:any){

    // let net:any = NetConfig.netById(global.user.networkId);
    // let asset = net[_quoteProtocol.rawData.currency]

    return buyCover(
      global.user.account,
      'bridge',
      _quoteProtocol.protocol.bridgeProductAddress, //bridge prod address
      null,  // payment asset
      _quoteProtocol.amount.toString(), // sum assured, compliant
      _quoteProtocol.actualPeriod, // period
      null, //coverType
      null, // token amount to cover
      null, // random data
      null
    )

}

export async function buyOnBridge(_quoteProtocol:any) : Promise<any>{

  const registry:any = await _getBridgeRegistryContract(NetConfig.netById(global.user.networkId).bridgeRegistry, global.user.web3 )

  let asset: any = await  registry.methods.getUSDTContract().call().then((stableTokenAddr:any) => {
    return  _getIERC20Contract(stableTokenAddr).options.address
  });

  const erc20Instance = _getIERC20Contract(asset);
  const ercBalance = await erc20Instance.methods.balanceOf(global.user.account).call();

  global.events.emit("buy" , { status: "INITIALIZED"} );

  if (Number(ERC20Helper.USDTtoERCDecimals(ercBalance)) >= (Number)(_quoteProtocol.price)) {
    // this.showModal = false;
    global.events.emit("buy" , { status: "CONFIRMATION" , type:"approve_spending", count:2 , current:1 } );

    return  ERC20Helper.approveUSDTAndCall(
      erc20Instance,
      _quoteProtocol.protocol.bridgeProductAddress,
      _quoteProtocol.price,
      () => {
        global.events.emit("buy" , { status: "CONFIRMATION" , type:"reset_usdt_allowance" , count:3 , current:2 } );
      },
      () => {
        global.events.emit("buy" , { status: "CONFIRMATION" , type:"main", count:2 , current:2 } );
        return callBridge(_quoteProtocol);
      },
      () => {
        global.events.emit("buy" , { status: "REJECTED" } );
        return {error: "Rejected confirmation"};
      })

    } else {
      global.events.emit("buy" , { status: "ERROR" , message:"You have insufficient funds to continue with this transaction" } );
      return {error: "You have insufficient funds to continue with this transaction"};
    }

  }




  export default {buyQuote, buyMultipleQuotes }
