import axios from 'axios';
import NetConfig from '../config/NetConfig'
import RiskCarriers from '../config/RiskCarriers'
import CatalogHelper from '../helpers/catalogHelper'
import BigNumber from 'bignumber.js'
import {toBN, toWei, fromWei} from 'web3-utils'
import {
    _getNexusDistributorsContract, _getNexusV2CoverContract, _getNexusV2CoverNFT,
} from '../helpers/getContract'
import {getCoverMin} from "../helpers/cover_minimums"
import UniswapV3Api from '../helpers/UniswapV3Api';


export default class NexusApi {

    static fetchCoverables() {

        return axios.get(`${NetConfig.netById(global.user.ethNet.networkId).nexusAPI}/coverables/contracts.json`)
            .then((response) => {
                return response.data;
            }).catch(error => {
                return [];
            });
    }

    static async setNXMBasedquotePrice(priceInNXM: any, quoteCurrency: string, fee: any) {
        //add 17.65% that Nexus adds to the 'base quotation', we do same
        priceInNXM = priceInNXM.mul(toBN(1765)).div(toBN(10000)).add(priceInNXM);
        let priceInNXMWithFee: any = fromWei(priceInNXM.mul(fee).div(toBN(10000)).add(priceInNXM));

        priceInNXMWithFee = Number(priceInNXMWithFee);

        let [priceInCurrencyFromNXM, routeData]: any = await UniswapV3Api.getNXMPriceFor(quoteCurrency, priceInNXMWithFee);
        const BrightFeeCoef: any = toBN(140); // Margin added - 40%
        let [finalPrice, priceWithSlippage]: any = [null, null];
        if (priceInCurrencyFromNXM) {
            finalPrice = toBN(priceInCurrencyFromNXM).mul(BrightFeeCoef).div(toBN(100));
            priceWithSlippage = toBN(priceInCurrencyFromNXM).mul(toBN(101)).div(toBN(100)) //max 1% slippage
        }

        return [
            finalPrice,
            priceWithSlippage,
            priceInCurrencyFromNXM ? toBN(priceInCurrencyFromNXM) : null,
            toWei(priceInNXMWithFee.toString()),
            routeData
        ];
    }

    static async fetchQuote(amount: number, currency: string, period: number, protocol: any): Promise<any> {

        let capacityETH: any = null;
        let capacityDAI: any = null;

        let quoteCapacity: any = null;
        const productId = protocol.nexusProductId;

        await this.fetchCapacity(productId).then((capacity: any) => {
            capacityETH = capacity.find((obj: any) => {
                return obj.assetId == RiskCarriers.NEXUS.assetsIds.ETH
            }).amount;
            capacityDAI = capacity.find((obj: any) => {
                return obj.assetId == RiskCarriers.NEXUS.assetsIds.DAI
            }).amount;
            quoteCapacity = currency === 'ETH' ? capacityETH : capacityDAI;
        }, () => {
            quoteCapacity = false;
        });

        const amountInWei: any = toBN(toWei(amount.toString(), 'ether'));

        if (currency === 'USD') {
            currency = RiskCarriers.NEXUS.fallbackQuotation;
        }

        const minimumAmount = getCoverMin("nexus", global.user.ethNet.symbol, currency);

        let quote: any = CatalogHelper.quoteFromCoverable(
            'nexus',
            protocol,
            {
                status: "INITIAL_DATA",
                amount: amountInWei,
                currency: currency,
                period: period,
                chain: 'ETH',
                chainId: global.user.ethNet.networkId,
                minimumAmount: minimumAmount,
                capacity: quoteCapacity,
            },
            {}
        );

        const currencyId = RiskCarriers.NEXUS.assetsIds[currency];
        return axios.get(
            `${NetConfig.netById(global.user.ethNet.networkId).nexusAPI}/v2/quote?productId=${productId}&amount=${amountInWei}&coverAsset=${currencyId}&paymentAsset=255&period=${period}&contractAddress=${protocol.nexusCoverable}`,
            {
                headers: {}
            }
        )
            .then(async (response: any) => {
                if (Number(period) < 28 || Number(period) > 365) {
                    //API doesn't fall for wrong params
                    return NexusApi.emptyErrorQuote(quote, {message: "Minimum duration is 28 days. Maximum is 365", errorType: "period"});
                }

                let basePrice = toBN(response.data.quote.premiumInAsset);
                //add 17.65% that Nexus adds to the 'base quotation', we do same
                basePrice = basePrice.mul(toBN(1765)).div(toBN(10000)).add(basePrice);

                const distributor = await _getNexusDistributorsContract(NetConfig.netById(global.user.ethNet.networkId).nexusDistributor);
                // hardcoded address, as Bright Distributors contract cannot be called by passive net - fix for Nexus Multichain Quotation
                let fee: any = await distributor.methods.feePercentage().call();
                fee = toBN(fee);

                let priceWithFee: any = basePrice.mul(fee).div(toBN(10000)).add(basePrice);

                let pricePercentNXM: any = null;
                let pricePercent: any = 0;
                let [nxmBasedPrice, priceWithSlippage, nxmBasedPriceNoMargin, nxmNexusExpects, routeData] = await NexusApi.setNXMBasedquotePrice(toBN(response.data.quote.premiumInNXM), currency, fee);
                pricePercent = new BigNumber(priceWithFee).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000);
                if (nxmBasedPrice && nxmBasedPrice > 0) {
                    pricePercentNXM = new BigNumber(nxmBasedPrice).times(1000).dividedBy(amountInWei).dividedBy(new BigNumber(period)).times(365).times(100).dividedBy(1000);
                }
                quote.rawData = response.data;
                quote.uniSwapRouteData = routeData;
                quote.priceOrigin = priceWithFee.toString();
                quote.price = nxmBasedPrice ? nxmBasedPrice : priceWithFee;
                quote.priceWithSlippage = priceWithSlippage ? priceWithSlippage : priceWithFee;
                quote.priceNoMargin = nxmBasedPriceNoMargin;
                quote.pricePercentOrigin = pricePercent;
                quote.pricePercent = pricePercentNXM ? pricePercentNXM : pricePercent;
                quote.priceInNXM = nxmNexusExpects;

                global.events.emit("quote", quote);

                const nexusV2CoverAddr = NetConfig.netById(global.user.ethNet.networkId).nexusV2Cover;
                const NexusV2CoverContract = await _getNexusV2CoverContract(nexusV2CoverAddr, global.user.ethNet.web3Instance);
                const totalActiveCoversETH = fromWei(await NexusV2CoverContract.methods.totalActiveCoverInAsset(RiskCarriers.NEXUS.assetsIds.ETH).call());
                const totalActiveCoversDAI = fromWei(await NexusV2CoverContract.methods.totalActiveCoverInAsset(RiskCarriers.NEXUS.assetsIds.DAI).call());
                const coverNFT = await _getNexusV2CoverNFT(NetConfig.netById(global.user.ethNet.networkId).nexusV2CoverNFT);
                const totalCovers = await coverNFT.methods.totalSupply().call();

                quote.stats = {
                    capacityETH: capacityETH,
                    capacityDAI: capacityDAI,
                    totalCovers: totalCovers,
                    totalActiveCoversDAI: totalActiveCoversDAI,
                    totalActiveCoversETH: totalActiveCoversETH,
                }
                quote.status = "FINAL_DATA";
                return quote;

            }).catch(function (error) {
                if ((error.response && error.response.status === 400) || (error.response && error.response.status === 409)) {
                    //wrong parameters
                    if (error.response.data.error || error.response.data.message.details || error.response.data.message) {
                        let errorMsg: any = null;
                        if (error.response.data.error) {
                            errorMsg = {message: error.response.data.error, errorType: "capacity"};
                        } else {
                            errorMsg = {message: error.response.data.message.details[0].message}
                        }
                        if (errorMsg.message.includes("coverAmount") && errorMsg.message.includes("required pattern")) {
                            errorMsg = {message: "Nexus supports only whole amounts to cover (e.g. 1999)", errorType: "amount"};
                        }
                        if (errorMsg.message.includes("only allows ETH as a currency")) {
                            errorMsg = {message: "Nexus supports only ETH currency for this cover"};
                        }
                        return NexusApi.emptyErrorQuote(quote, errorMsg);
                    }
                } else {
                    quote.error = error;
                    return quote;
                }
            });
    }

    static emptyErrorQuote(quote:any, errorMsg:any) {
        quote.priceOrigin = 0,
            quote.price = 0,
            quote.pricePercentOrigin = 0,
            quote.pricePercent = 0,
            quote.errorMsg = errorMsg,
            quote.status = "FINAL_DATA";
        return quote;
    }

    static fetchCapacity(_productId: any) {
        return axios.get(`https://api.nexusmutual.io/v2/capacity/${_productId}`)
            .then((response: any) => {
                return response.data.capacity;
            });
    }

}
