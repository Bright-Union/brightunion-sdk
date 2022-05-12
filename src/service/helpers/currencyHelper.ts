import NetConfig from '../config/NetConfig';
import CatalogHelper from './catalogHelper';
import UniswapV2Api from './UniswapV2Api';
import {toBN, fromWei} from 'web3-utils'
// import * as Sentry from "@sentry/browser";

class CurrencyHelper {

  public static eth_dai = '2000' //fallback to testnet ratio
  public static insur_usdc:any = '0.2'; //fallback
  public static eth_nxm:any = '0.2'; //fallback
  public static dai_nxm:any = '0.2'; //fallback


  public static getInsureUSDCPrice(_networkId:any){
    if (CatalogHelper.availableOnNetwork(_networkId, 'UNISWAP')) {

      return new Promise( async (resolve) => {

        UniswapV2Api.priceTokenAtoTokenB(
          _networkId,
          NetConfig.netById(_networkId).USDC,
          NetConfig.netById(_networkId).INSUR
        ).then((price:any) => {
          this.insur_usdc = price;
          localStorage.setItem('InsureUSDCPrice' , price);
          resolve(price);
        })

        const InsureUSDCPrice:any = localStorage.getItem('InsureUSDCPrice');
        if(InsureUSDCPrice){
          this.insur_usdc = InsureUSDCPrice;
          resolve(InsureUSDCPrice)
        }

      })

    }
  }

  public static getETHDAIPrice (_networkId:any) {
    if (CatalogHelper.availableOnNetwork(_networkId, 'UNISWAP')) {

      return new Promise( async (resolve) => {

        UniswapV2Api.priceTokenAtoETH(_networkId, NetConfig.netById(_networkId).DAI).then((price:any) => {
          this.eth_dai =  price;
          localStorage.setItem('ETHDAIPrice' , price);
          resolve(price)
        })

        const ETHDAIPrice:any = localStorage.getItem('ETHDAIPrice');
        if(ETHDAIPrice){
          new Promise( async (resolve) => {
            this.eth_dai = ETHDAIPrice;
            resolve(ETHDAIPrice)
          })
        }
      })

    }

  }

  public static getETHNXMPrice (_networkId:any) {
    if (CatalogHelper.availableOnNetwork(_networkId, 'UNISWAP')) {

      return new Promise( async (resolve) => {

        UniswapV2Api.priceTokenAtoETH(
          _networkId,
          // NetConfig.netById(_networkId).ETH,
          NetConfig.netById(_networkId).WNXM
        ).then((price:any) => {
          this.eth_nxm =  price;
          localStorage.setItem('ETHNXMPrice' , price);
          resolve(price);
        })

        const ETHNXMPrice:any = localStorage.getItem('ETHNXMPrice');
        if(ETHNXMPrice){
          new Promise( async (resolve) => {
            this.eth_nxm = ETHNXMPrice;
            resolve(ETHNXMPrice)
          })
        }
      })

    }

  }

  public static getDAINXMPrice (_networkId:any) {
    if (CatalogHelper.availableOnNetwork(_networkId, 'UNISWAP')) {

      console.log("getDAINXMPrice - 1 - ",  NetConfig.netById(_networkId).DAI,  NetConfig.netById(_networkId).WNXM );

      return new Promise( async (resolve) => {

        UniswapV2Api.priceTokenAtoTokenB(
          _networkId,
          NetConfig.netById(_networkId).WNXM,
          NetConfig.netById(_networkId).ETH,
        ).then((price:any) => {
          console.log("getDAINXMPrice - x - " , price);
          this.dai_nxm =  price;
          localStorage.setItem('DAINXMPrice' , price);
          resolve(price);

        })

        const DAINXMPrice:any = localStorage.getItem('DAINXMPrice');
        if(DAINXMPrice){
          new Promise( async (resolve) => {
            this.dai_nxm = DAINXMPrice;
            resolve(DAINXMPrice)
          })
        }
      })

    }

  }

    public static  eth2nxm(eth:any) {
      return toBN(eth.toString().split('.')[0]).mul(toBN(this.eth_nxm.toString().split('.')[0])).toString();
    }

    public static  dai2nxm(eth:any) {
      return toBN(eth.toString().split('.')[0]).mul(toBN(this.dai_nxm.toString().split('.')[0])).toString();
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
