import {_getIERC20Contract} from './helpers/getContract';
import { buyCoverInsurace, buyCover } from "./dao/Buying";
import NetConfig from './config/NetConfig';
import InsuraceApi from './distributorsApi/InsuraceApi';


export async function buyQuote(_quoteProtocol: any): Promise<any[]> {

  console.log('buyQuote 1 - ALL - ' , _quoteProtocol);

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


    // let state = { web3:{ web3Active:{ coinbase: owner }}};
    //
    //     ERC20Helper.approveAndCall(
    //         state,
    //         erc20Instance,
    //         nexusResponse.contract,
    //         nexusResponse.price,
    //         () => {
    //           console.log('signing tx')
    //                   // Sign tx manually
    //                 web3.eth.accounts.signTransaction({
    //                     to: nexusResponse.contract,
    //                     // value: '1000000000',
    //                     gas: 2000000
    //                 }, process.env.PRIVATE_KEY)
    //                 .then(console.log);
    //
    //
    //       const data = web3.eth.abi.encodeParameters(
    //           ['uint', 'uint', 'uint', 'uint', 'uint8', 'bytes32', 'bytes32'],
    //           [nexusResponse.price, nexusResponse.priceInNXM, nexusResponse.expiresAt,
    //            nexusResponse.generatedAt, nexusResponse.v, nexusResponse.r, nexusResponse.s],
    //       );
    //
    //         console.log('calling  brightClient.buyCover...')
    //             brightClient.buyCover(
    //                 owner,
    //                 'nexus',
    //                 nexusResponse.contract,
    //                 netConfig.USDT,  // payment asset
    //                 0, // sum assured, compliant
    //                 26, // period
    //                 1, //coverType
    //                 web3.utils.toBN("100000000000000000000"), // token amount to cover
    //                 data// random data
    //             )
    //
    //         },(err : any) => {
    //           console.log(err);
    //      });


  }else if(_quoteProtocol.distributorName == 'insurace'){

    console.log("buyQuote INSURACE 1 - ", _quoteProtocol);

    const chainSymbol:string  = NetConfig.netById(global.user.networkId).symbol;
    const confirmCoverResult  : any = await InsuraceApi.confirmCoverPremium(chainSymbol, _quoteProtocol.params);

    console.log("confirmCoverResult - " , confirmCoverResult);

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
