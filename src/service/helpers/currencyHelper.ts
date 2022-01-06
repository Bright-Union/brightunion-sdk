import NetConfig from '../config/NetConfig';
import CatalogHelper from './catalogHelper';
import UniswapV2Api from './UniswapV2Api';
import {toBN, fromWei} from 'web3-utils'


class CurrencyHelper {

  public static eth_dai = '2000' //fallback to testnet ratio
  public static insur_usdc:any = '0.2'; //fallback

  public static getInsureUSDCPrice(){
    if (CatalogHelper.availableOnNetwork(global.user.ethNet.networkId, 'UNISWAP')) {
      try {
        UniswapV2Api.priceTokenAtoTokenB(global.user.ethNet.networkId, NetConfig.netById(global.user.ethNet.networkId).USDC,
        NetConfig.netById(global.user.ethNet.networkId).INSUR).then(price => {
          this.insur_usdc = price
        })}catch(e) {
          console.error(e)
        }


      }
    }

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
      return toBN(eth.toString().split('.')[0]).mul(toBN(this.eth_dai.toString().split('.')[0])).toString();
    }

    public static usd2eth(dai:any) {
      return toBN(dai.toString().split('.')[0]).div(toBN(this.eth_dai.toString().split('.')[0])).toString();
    }

    public static  insurPrice () {
      // let insurPrice = parseFloat(this.insur_usdc.split('.')[1]) / 100000;
      let insurPrice = this.insur_usdc * 1000000000000;
      return insurPrice;
    }


  }

  export default CurrencyHelper
