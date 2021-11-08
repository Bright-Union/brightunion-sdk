import NetConfig from '../config/NetConfig';
import CatalogHelper from './catalogHelper';
import UniswapV2Api from './UniswapV2Api';

class CurrencyHelper {

  public static eth_dai = '2000' //fallback to testnet ratio

  public static getETHDAIPrice () {
    if (CatalogHelper.availableOnNetwork(global.user.networkId, 'UNISWAP')) {
      try {
        return UniswapV2Api.priceTokenAtoETH(global.user.networkId, NetConfig.netById(global.user.networkId).DAI).then((price:any) => {
          this.eth_dai =  price
        })} catch(e) {
          console.error(e)
        }
      }
    }

    public static  eth2usd(eth:any) {
      return global.user.web3.utils.toBN(eth.toString().split('.')[0]).mul(global.user.web3.utils.toBN(this.eth_dai.toString().split('.')[0])).toString();
    }

    public static usd2eth(dai:any) {
      return global.user.web3.utils.toBN(dai.toString().split('.')[0]).div(global.user.web3.utils.toBN(this.eth_dai.toString().split('.')[0])).toString();
    }

  }

  export default CurrencyHelper
