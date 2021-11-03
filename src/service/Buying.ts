import {_getIERC20Contract} from './helpers/getContract';
import { buyCoverInsurace, buyCover } from "./dao/Buying";
import NetConfig from './config/NetConfig';
import InsuraceApi from './distributorsApi/InsuraceApi';
import ERC20Helper from './helpers/ERC20Helper';



export async function buyQuote(_quoteProtocol: any): Promise<any[]> {

  if(_quoteProtocol.distributorName == 'bridge'){

    // console.log('enter helper...');
    // let state = { web3:{ web3Active:{ coinbase: owner }}};
    // ERC20Helper.approveUSDTAndCall(
    //     state, // state
    //     erc20Instance, // pay with asset
    //     bridgeProductAddress, // spender
    //     web3.utils.toBN('10000000000000000000'), // price, amount to allow spender spend in wei
    //     () => { // onAllowanceReset
    //     console.log('SHOW_CONFIRMATION_WAITING', {msg: `(1/3) Resetting USDT allowance to 0`});
    //     },async () => {
    //
    //         // Sign tx manually
    //         web3.eth.accounts.signTransaction({
    //             to: bridgeProductAddress,
    //             // value: '1000000000',
    //             gas: 2000000
    //         }, process.env.PRIVATE_KEY)
    //         .then(console.log);
    //
    //
    //         console.log('calling  brightClient.buyCover...')
    //         await brightClient.buyCover(
    //             owner,
    //             'bridge',
    //             bridgeProductAddress,
    //             netConfig.USDT,  // payment asset
    //             0, // sum assured, compliant
    //             26, // bridge epochs
    //             1, //coverType
    //             web3.utils.toBN("100000000000000000000"), // token amount to cover
    //             web3.utils.hexToBytes(web3.utils.numberToHex(500)) // random data
    //         )
    //
    //
    //     }, () => { console.log(Error);  }  //onError
    // );


  }else if(_quoteProtocol.distributorName == 'nexus'){

    console.log('NEXUS BUY COVER 111 '  , _quoteProtocol);


    let asset:any;
    if (this.buyingWithNetworkCurrency) {
      asset = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    } else if (this.paymentCurrency === 'DAI') {
      asset = this.activeNetworkConfig().DAI;
    } else {
      //Not supported yet
      throw new Error();
    }

    _getIERC20Contract(asset).then((erc20Instance:any) => {

      const ercBalance = (token:any) => {
      return token.methods.balanceOf(this.myAddress()).call();
    }

  ercBalance(erc20Instance).then( (balance:any) => {
    if (Number(balance) >= (Number)(_quoteProtocol.quote.price)) {
      this.showModal = false;
      ERC20Helper.approveAndCall(
          erc20Instance,
          _quoteProtocol.quote.contract,
          _quoteProtocol.quote.price,
          () => {

            console.log('NEXUS BUY COVER 333 '  , _quoteProtocol);

            // EventBus.publish('SHOW_CONFIRMATION_WAITING', {msg: `(2/2) Buying cover for ${this.readablePrice} ${this.paymentCurrency}`});
            // self.callDistributorBuy(asset);

            const data = global.user.web3.eth.abi.encodeParameters(
                ['uint', 'uint', 'uint', 'uint', 'uint8', 'bytes32', 'bytes32'],
                [_quoteProtocol.price, _quoteProtocol.priceInNXM, _quoteProtocol.expiresAt,
                 _quoteProtocol.generatedAt, _quoteProtocol.v, _quoteProtocol.r, _quoteProtocol.s],
            );

            buyCover(
              global.user.account,
              'nexus',
              _quoteProtocol.contract,
              NetConfig.netById(global.user.networkId).USDT,  // payment asset
              0, // sum assured, compliant
              _quoteProtocol.quote.period, // period
              1, //coverType
              // global.user.web3.utils.toBN('100000000000000000000'), // token amount to cover
              _quoteProtocol.quote.amount,
              data// random data
            )



          },
          (err:any) => {
          console.log('CLOSE_CONFIRMATION_WAITING');
            // this.errorMessage = err.message;
            // this.showModal = true;
          });
    } else {
      console.log('TRACK_EVENT', {
        action: 'buy-balance-nexus-policy-error',
        category: 'trxError',
        label: 'You have insufficient funds to continue with this transaction',
        value: 1
      });
      console.log('CLOSE_CONFIRMATION_WAITING');
      this.errorMessage = "You have insufficient funds to continue with this transaction";
    }

  })
})


        // ERC20Helper.approveAndCall(
        //     erc20Instance,
        //     _quoteProtocol.quote.contract,
        //     _quoteProtocol.quote.price,
        //     () => {
        //       console.log('signing tx')
        //               // Sign tx manually
        //             web3.eth.accounts.signTransaction({
        //                 to: nexusResponse.contract,
        //                 // value: '1000000000',
        //                 gas: 2000000
        //             }, process.env.PRIVATE_KEY)
        //             .then(console.log);
        //
        //
        //   const data = web3.eth.abi.encodeParameters(
        //       ['uint', 'uint', 'uint', 'uint', 'uint8', 'bytes32', 'bytes32'],
        //       [nexusResponse.price, nexusResponse.priceInNXM, nexusResponse.expiresAt,
        //        nexusResponse.generatedAt, nexusResponse.v, nexusResponse.r, nexusResponse.s],
        //   );
        //
        //     console.log('calling  brightClient.buyCover...')
        //         brightClient.buyCover(
        //             owner,
        //             'nexus',
        //             nexusResponse.contract,
        //             netConfig.USDT,  // payment asset
        //             0, // sum assured, compliant
        //             26, // period
        //             1, //coverType
        //             web3.utils.toBN("100000000000000000000"), // token amount to cover
        //             data// random data
        //         )
        //
        //     },(err : any) => {
        //       console.log(err);
        //  });


  }else if(_quoteProtocol.distributorName == 'insurace'){

    const chainSymbol:string  = NetConfig.netById(global.user.networkId).symbol;
    const confirmCoverResult  : any = await InsuraceApi.confirmCoverPremium(chainSymbol, _quoteProtocol.quote.responseObj.params);

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

  return [];

}


export default buyQuote
