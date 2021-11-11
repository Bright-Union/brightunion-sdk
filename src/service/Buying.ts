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

export async function buyOnInsurace (_quoteProtocol:any) {

  const chainSymbol:string  = NetConfig.netById(global.user.networkId).symbol;
  const confirmCoverResult  : any = await InsuraceApi.confirmCoverPremium(chainSymbol, _quoteProtocol.rawData.params);

  const netBalance = await global.user.web3.eth.getBalance(global.user.account);

  if(NetConfig.isNetworkCurrencyBySymbol(_quoteProtocol.currency)){
    if (Number(netBalance) >= (Number)(_quoteProtocol.price)) {
      callInsurace(confirmCoverResult);
    } else {
      console.log('You have insufficient funds to continue with this transaction');
      // this.errorMessage = "You have insufficient funds to continue with this transaction";
    }
  }else{
    const netConfig:any = NetConfig.netById(global.user.networkId);
    const erc20Address:string = netConfig[_quoteProtocol.currency]
    const erc20Instance = _getIERC20Contract(erc20Address);
    const ercBalance = await erc20Instance.methods.balanceOf(global.user.account).call();

    const asset:any = NetConfig.netById(global.user.networkId);

    //balance is enough?
    if (NetConfig.sixDecimalsCurrency(global.user.networkId, _quoteProtocol.currency) &&       //6 digits currency?
    Number(ERC20Helper.USDTtoERCDecimals(ercBalance)) >= (Number)(_quoteProtocol.rawData.price)) {

      //proceed with USDT
      // this.showModal = false;
      ERC20Helper.approveUSDTAndCall(
        erc20Instance,
        _quoteProtocol.protocol.bridgeProductAddress,  // this.$store.state.insurAceCover().options.address,
        _quoteProtocol.rawData.price,
        () => {
          console.log('SHOW_CONFIRMATION_WAITING', {msg: `(1/3) Resetting USDT allowance to 0`});
        },
        () => {
          callInsurace(confirmCoverResult);
        },
        () => {
          console.log('CLOSE_CONFIRMATION_WAITING');
        })

      } else if (Number(ercBalance) >= (Number)(_quoteProtocol.rawData.price)) {

        //proceed with ERC
        ERC20Helper.approveAndCall(
          erc20Instance,
          _quoteProtocol.protocol.bridgeProductAddress,  // this.$store.state.insurAceCover().options.address,
          _quoteProtocol.rawData.price,
          () => {
            callInsurace(confirmCoverResult);
          },
          (err:any) => {
            console.log('ERC20Helper approveAndCall Error - ', err);
          });
        } else {
          console.log('You have insufficient funds to continue with this transaction');
        }

      }

    }

export async function callInsurace(confirmCoverResult:any){
  return await buyCoverInsurace(
    global.user.account,
    'insurace',
    confirmCoverResult[0],
    confirmCoverResult[1],
    confirmCoverResult[2],
    confirmCoverResult[3],
    confirmCoverResult[6],
    confirmCoverResult[7],
    confirmCoverResult[8],
    confirmCoverResult[9],
    confirmCoverResult[10],
    confirmCoverResult[11],
  )
}


export async function callNexus(_quoteProtocol:any){

  const data = global.user.web3.eth.abi.encodeParameters(
    ['uint', 'uint', 'uint', 'uint', 'uint8', 'bytes32', 'bytes32'],
    [_quoteProtocol.rawData.price, _quoteProtocol.rawData.priceInNXM, _quoteProtocol.rawData.expiresAt,
      _quoteProtocol.rawData.generatedAt, _quoteProtocol.rawData.v, _quoteProtocol.rawData.r, _quoteProtocol.rawData.s],
    );

    buyCover(
      global.user.account,
      'nexus',
      _quoteProtocol.rawData.contract,
      NetConfig.netById(global.user.networkId).USDT,  // payment asset
      0, // sum assured, compliant
      _quoteProtocol.rawData.period, // period
      1, //coverType
      _quoteProtocol.rawData.amount, // token amount to cover
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
        callNexus(_quoteProtocol);
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
      callNexus(_quoteProtocol);
    } else {
      console.log("You have insufficient funds to continue with this transaction");
    }
  }

}

export async function callBridge(_quoteProtocol:any){

  // const data = global.user.web3.eth.abi.encodeParameters(
  //   ['uint', 'uint', 'uint', 'uint', 'uint8', 'bytes32', 'bytes32'],
  //   [_quoteProtocol.rawData.price, _quoteProtocol.rawData.priceInNXM, _quoteProtocol.rawData.expiresAt,
  //     _quoteProtocol.rawData.generatedAt, _quoteProtocol.rawData.v, _quoteProtocol.rawData.r, _quoteProtocol.rawData.s],
  //   );

    let bridgeProductAddress: any = '0x85A976045F1dCaEf1279A031934d1DB40d7b0a8f';

    await buyCover(
        global.user.account,
        'bridge',
        bridgeProductAddress,
        NetConfig.netById(global.user.networkId).USDT,  // payment asset
        0, // sum assured, compliant
        _quoteProtocol.rawData.period, // bridge epochs - weeks
        1, //coverType
        _quoteProtocol.rawData.amount, // token amount to cover
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
