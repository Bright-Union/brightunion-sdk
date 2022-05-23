import {

  _getIERC20Contract,
  _getDistributorsContract,
  _getBridgeV2RegistryContract,
  _getBridgeV2PolicyRegistry,

} from './helpers/getContract';
import { buyCoverNexus, buyCoverInsurace, buyCoverBridge } from "./dao/Buying";
import NetConfig from './config/NetConfig';
import InsuraceApi from './distributorsApi/InsuraceApi';
import ERC20Helper from './helpers/ERC20Helper';
import GoogleEvents from './config/GoogleEvents';

export async function buyQuote(_quoteProtocol: any): Promise<any> {

  GoogleEvents.buy(_quoteProtocol);

  if(_quoteProtocol.distributorName == 'bridge'){

    return await buyOnBridgeV2(_quoteProtocol);

  }else if(_quoteProtocol.distributorName == 'nexus'){

    return await buyOnNexus(_quoteProtocol);

  }else if(_quoteProtocol.distributorName == 'insurace'){

    return await buyOnInsurace(_quoteProtocol);

  }
}


export async function buyMultipleQuotes (_quotes:any):Promise<any> {
  GoogleEvents.multiBuy(_quotes);
  return buyMutipleOnInsurace(_quotes);
}

export async function buyMutipleOnInsurace (_quotes:any):Promise<any> {

  const chainSymbol:string  = NetConfig.netById(global.user.networkId).symbol;
  // Confirm insurace quoted premium & get security signature params to buy
  const confirmCoverResult:any = await InsuraceApi.confirmCoverPremium(chainSymbol, _quotes.params);
  // Map Quote confirmation to Insurace buying object
  const buyingObj:any = setInsuraceBuyingObject(confirmCoverResult);

  if(NetConfig.isNetworkCurrencyBySymbol(_quotes.currency.name)){
    return  callInsurace(buyingObj, true , _quotes );
  }else{

    const netConfig:any = NetConfig.netById(global.user.networkId);
    const erc20Address:string = netConfig[_quotes.currency.name];

    const erc20Instance = _getIERC20Contract(erc20Address);

    let account = global.user.account;
    let ercBalance  = await erc20Instance.methods.balanceOf(account).call();

    const insuraceAddress:any =  await _getDistributorsContract(global.user.web3).methods.getDistributorAddress('insurace').call();

    if (NetConfig.sixDecimalsCurrency(global.user.networkId, _quotes.currency.name) &&       //6 digits currency?
    Number(ERC20Helper.USDTtoERCDecimals(ercBalance)) >= (Number)(buyingObj.premium)) {

      buyingObj.premium = ERC20Helper.USDTtoERCDecimals(buyingObj.premium);

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
            global.events.emit("buy" , { status: "CONFIRMATION" , type:"get_transaction_hash" , count:2 , current:2 } );
          },
        () => {
          buyingObj.premium = ERC20Helper.ERCtoUSDTDecimals(buyingObj.premium)
          global.events.emit("buy" , { status: "CONFIRMATION" , type:"main", count:2 , current:2 } );
          return callInsurace(buyingObj, false, _quotes);
        },
        () => {
          GoogleEvents.buyRejected('REJECTED - ERC20Helper - approveUSDTAndCall' , _quotes );
          global.events.emit("buy" , { status: "REJECTED" } );
          return {error: "Confirmation rejected"}
        }
      )

    }else if (Number(ercBalance) >= (Number)(buyingObj.premium)) {
      return await ERC20Helper.approveAndCall(
        erc20Instance,
        insuraceAddress,  // global.user.brightProtoAddress //0x7e758e0D330B9B340A7282029e73dA448fb4BdB6
        buyingObj.premium,
          () => {
            global.events.emit("buy" , { status: "CONFIRMATION" , type:"get_transaction_hash" , count:2 , current:2 } );
          },
        () => {
          global.events.emit("buy" , { status: "CONFIRMATION" , type:"main" , count:2 , current:2 } );
          return callInsurace(buyingObj , false, _quotes);
        },
        (err:any) => {
          GoogleEvents.buyRejected('REJECTED - ERC20Helper - approveAndCall' , _quotes );
          global.events.emit("buy" , { status: "REJECTED" } );
          return {error: err , message: 'ERC20Helper approveAndCall Error'};
        }
      );

    } else{
      GoogleEvents.buyRejected('You have insufficient funds to continue with this transaction' , _quotes );
      global.events.emit("buy" , { status: "ERROR" , message:"You have insufficient funds to continue with this transaction" } );
      return {error: 'You have insufficient funds to continue with this transaction' }
    }

  }


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

  const insuraceAddress:any = await _getDistributorsContract(global.user.web3).methods.getDistributorAddress('insurace').call();

  if(NetConfig.isNetworkCurrencyBySymbol(_quoteProtocol.currency)){
    if (Number(netBalance) >= (Number)(_quoteProtocol.price)) {
      global.events.emit("buy" , { status: "CONFIRMATION" , type:"main", count:1 , current:1 } );
      return callInsurace(buyingObj , true, _quoteProtocol);
    } else {
      GoogleEvents.buyRejected('You have insufficient funds to continue with this transaction' , _quoteProtocol );
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

      buyingObj.premium = ERC20Helper.USDTtoERCDecimals(buyingObj.premium)

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
            global.events.emit("buy" , { status: "CONFIRMATION" , type:"get_transaction_hash" , count:2 , current:2 } );
          },
        () => {
          buyingObj.premium = ERC20Helper.ERCtoUSDTDecimals(buyingObj.premium)
          global.events.emit("buy" , { status: "CONFIRMATION" , type:"main", count:2 , current:2 } );
          return callInsurace(buyingObj, false, _quoteProtocol);
        },
        () => {
          GoogleEvents.buyRejected('REJECTED - ERC20Helper - approveUSDTAndCall' , _quoteProtocol );
          global.events.emit("buy" , { status: "REJECTED" } );
          return {error: "Confirmation rejected"}
        }
      );

      } else if (Number(ercBalance) >= (Number)(_quoteProtocol.price)) {
        //proceed with ERC

        global.events.emit("buy" , { status: "CONFIRMATION" , type:"approve_spending" , count:2 , current:1 } );

        return await ERC20Helper.approveAndCall(
          erc20Instance,
          insuraceAddress,  // global.user.brightProtoAddress //0x7e758e0D330B9B340A7282029e73dA448fb4BdB6
          buyingObj.premium,
            () => {
              global.events.emit("buy" , { status: "CONFIRMATION" , type:"get_transaction_hash" , count:2 , current:2 } );
            },
          () => {
            global.events.emit("buy" , { status: "CONFIRMATION" , type:"main" , count:2 , current:2 } );
            return callInsurace(buyingObj , false, _quoteProtocol);
          },
          (err:any) => {
            GoogleEvents.buyRejected('REJECTED - ERC20Helper - approveAndCall' , _quoteProtocol );
            global.events.emit("buy" , { status: "REJECTED" } );
            return {error: err , message: 'ERC20Helper approveAndCall Error'};
          });
        } else {
          GoogleEvents.buyRejected('You have insufficient funds to continue with this transaction' , _quoteProtocol );
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
export async function callInsurace(buyingObj:any, buyingWithNetworkCurrency: boolean, _quote:any):Promise<any>{
  return await buyCoverInsurace( buyingObj, buyingWithNetworkCurrency,_quote );
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

   const route =  _quoteProtocol.uniSwapRouteData.route[0] ? _quoteProtocol.uniSwapRouteData.route[0].route : false ;
   if(!route){
     return {error: "no swap route found"}
   }
   const swapVia = route.tokenPath.length > 2 ? route.tokenPath[1].address : "0x0000000000000000000000000000000000000000";
   const poolFeeA = route.pools[0].fee;
   const poolFeeB = route.pools[1] ? route.pools[1].fee : poolFeeA;

   const data = global.user.web3.eth.abi.encodeParameters(
     ['address','uint24','uint24','uint', 'uint', 'uint', 'uint', 'uint8', 'bytes32', 'bytes32'],
     [ swapVia, poolFeeA, poolFeeB, _quoteProtocol.rawData.price, _quoteProtocol.rawData.priceInNXM, _quoteProtocol.rawData.expiresAt,
       _quoteProtocol.rawData.generatedAt, _quoteProtocol.rawData.v, _quoteProtocol.rawData.r, _quoteProtocol.rawData.s],
     );

     let net:any = NetConfig.netById(global.user.networkId);
     let asset = net[_quoteProtocol.rawData.currency]

     return buyCoverNexus(
       global.user.account,
       'nexus',
       _quoteProtocol.rawData.contract,
       asset,  // payment asset
       _quoteProtocol.amount.toString(), // sum assured, compliant
       _quoteProtocol.priceInNXM,
       _quoteProtocol.rawData.period, // period
       0, //coverType
       _quoteProtocol.price.toString(), // token amount to cover with FEE
       data ,// random data
       buyingWithNetworkCurrency,
       _quoteProtocol,
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
      const onTXHash =  () => {
        global.events.emit("buy" , { status: "CONFIRMATION" , type:"get_transaction_hash" , count:2 , current:2 } );
        return callNexus(_quoteProtocol, false);
      };
      const onError =  (err:any) => {
        GoogleEvents.buyRejected('REJECTED' , _quoteProtocol );
        global.events.emit("buy" , { status: "REJECTED" } );
        return {error : "Confirmation rejected"};
      }

      global.events.emit("buy" , { status: "CONFIRMATION" , type:"approve_spending" , count:2 , current:1 } );

      return await ERC20Helper.approveAndCall( erc20Instance,  NetConfig.netById(global.user.networkId).nexusDistributor,  _quoteProtocol.rawData.price, onTXHash, onSuccess, onError);

    } else {
      GoogleEvents.buyRejected('You have insufficient funds to continue with this transaction' , _quoteProtocol );
      global.events.emit("buy" , { status: "ERROR" , message:"You have insufficient funds to continue with this transaction" } );
      return{ error: "You have insufficient funds to continue with this transaction" }
    }

  }else{

    const netBalance = await global.user.web3.eth.getBalance(global.user.account);
    if (Number(netBalance) >= (Number)(_quoteProtocol.rawData.price)) {
      global.events.emit("buy" , { status: "CONFIRMATION" , type:"main" , count:1 , current:1 } );

      return callNexus(_quoteProtocol, true);
    } else {
      GoogleEvents.buyRejected('You have insufficient funds to continue with this transaction' , _quoteProtocol );
      global.events.emit("buy" , { status: "ERROR" , message:"You have insufficient funds to continue with this transaction" } );
      return {error: 'You have insufficient funds to continue with this transaction' }
    }
  }

}

export async function callBridgeV2(_quoteProtocol:any){

  const data = global.user.web3.eth.abi.encodeParameters(
    ['uint256', 'uint256'],
    [_quoteProtocol.price, _quoteProtocol.period ],
  );

  return buyCoverBridge(
    global.user.account,
    'bridge',
    _quoteProtocol.protocol.bridgeProductAddress, //bridge prod address
    null,  // payment asset
    _quoteProtocol.amount.toString(), // sum assured, compliant
    _quoteProtocol.actualPeriod, // period
    null, //coverType
    _quoteProtocol.price, // token amount to cover
    data, // random data
    null,
    _quoteProtocol
  )

}

export async function buyOnBridgeV2(_quoteProtocol:any) : Promise<any>{

  const registry:any = await _getBridgeV2RegistryContract(NetConfig.netById(global.user.networkId).bridgeV2Registry, global.user.web3 )

  let asset: any = await  registry.methods.getUSDTContract().call().then((stableTokenAddr:any) => {
    return  _getIERC20Contract(stableTokenAddr).options.address
  });

  const policyRegistryAddr = await _getBridgeV2RegistryContract( NetConfig.netById(global.user.ethNet.networkId).bridgeV2Registry , global.user.ethNet.web3Instance).methods.getPolicyRegistryContract().call();
  const policyRegistry = await  _getBridgeV2PolicyRegistry(policyRegistryAddr, global.user.ethNet.web3Instance)

  const nPolicies = await  policyRegistry.methods.getPoliciesLength(global.user.account).call();
  const activeInfos = await  policyRegistry.methods.getPoliciesInfo(global.user.account, true, 0, nPolicies).call();

  for (var i = 0; i < activeInfos._policyBooksArr.length; i++) {
    if(activeInfos._policyBooksArr[i] == _quoteProtocol.protocol.bridgeProductAddress){
      return await new Promise((reject) => {
        global.events.emit("buy" , { status: "ERROR" , message: "Bridge does not support buying multiple active covers by the same address. Please check your expiry date on the existing cover." } );
        reject( {error: "Bridge cover already exists" , message: "Bridge does not support buying multiple active policies by the same address. Please check your expiry date on the existing cover."} )
      })
    }
  }

  const erc20Instance = _getIERC20Contract(asset);
  const ercBalance = await erc20Instance.methods.balanceOf(global.user.account).call();

  global.events.emit("buy" , { status: "INITIALIZED"} );

  if (Number(ERC20Helper.USDTtoERCDecimals(ercBalance)) >= (Number)(_quoteProtocol.price)) {

    global.events.emit("buy" , { status: "CONFIRMATION" , type:"approve_spending", count:2 , current:1 } );

    return  ERC20Helper.approveUSDTAndCall(
      erc20Instance,
      _quoteProtocol.protocol.bridgeProductAddress,
      _quoteProtocol.price,
      () => {
        global.events.emit("buy" , { status: "CONFIRMATION" , type:"reset_usdt_allowance" , count:3 , current:2 } );
      },
        () => {
          global.events.emit("buy" , { status: "CONFIRMATION" , type:"get_transaction_hash" , count:2 , current:2 } );
        },
      () => {
        global.events.emit("buy" , { status: "CONFIRMATION" , type:"main", count:2 , current:2 } );
        return callBridgeV2(_quoteProtocol);
      },
      () => {
        GoogleEvents.buyRejected('REJECTED - ERC20Helper - approveUSDTAndCall' , _quoteProtocol );
        global.events.emit("buy" , { status: "REJECTED" } );
        return {error: "Rejected confirmation"};
      }
    )

  } else {
    GoogleEvents.buyRejected('You have insufficient funds to continue with this transaction' , _quoteProtocol );
    global.events.emit("buy" , { status: "ERROR" , message:"You have insufficient funds to continue with this transaction" } );
    return {error: "You have insufficient funds to continue with this transaction"};
  }

}

export default {buyQuote, buyMultipleQuotes }
