import {_getIERC20Contract} from './helpers/getContract';
import { buyCoverInsurace, buyCover } from "./dao/Buying";
import NetConfig from './config/NetConfig';
import InsuraceApi from './distributorsApi/InsuraceApi';


export async function buyQuote(_quoteProtocol: any): Promise<any[]> {

  if(_quoteProtocol.distributorName == 'bridge'){

    // return await buyCover()

  }else if(_quoteProtocol.distributorName == 'nexus'){


  }else if(_quoteProtocol.distributorName == 'insurace'){

    const chainSymbol:string  = NetConfig.netById(global.user.networkId).symbol;
    const confirmCoverResult  : any = await InsuraceApi.confirmCoverPremium(chainSymbol, _quoteProtocol.params);

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
