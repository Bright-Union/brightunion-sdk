import NetConfig from "../config/NetConfig";
import Cover from "../domain/Cover";
import CatalogHelper from "../helpers/catalogHelper"
import {
  _getDistributorsContract,
  _getInsuraceDistributor,
  _getInsurAceCoverDataContract,
  _getInsurAceProductContract,

  _getBridgeV2RegistryContract,
  _getBridgeV2PolicyBookRegistryContract,
  _getBridgeV2PolicyBookContract,
  _getBridgeV2PolicyRegistry,

  _getNexusDistributorsContract,
  _getNexusQuotationContract,
  _getNexusGatewayContract,
  _getNexusClaimsDataContract,
  _getNexusDistributor,
  _getNexusMasterContract, _getIERC20Contract, _getEaseContract,
} from "../helpers/getContract";
import {hexToUtf8, asciiToHex, fromWei} from 'web3-utils';
import EaseApi from "@/service/distributorsApi/EaseApi";

/**
 * Returns the total cover count owned by an address
 *
 * @remarks
 * Function to get total number of owned covers from an address
 *
 * @param _distributorName - Name of distributor in lower case
 * @param _owner
 * @param _isActive
 * @returns Number of total covers
 */

export async function getCoversCount(
    _distributorName : string,
    _ownerAddress: string ,
    _isActive : boolean
): Promise<number>  {

  if(global.user.ethNet.networkId == 1){
    //ToDO - finish the logic of fetching Count from Distributors

  }else{

    return await _getDistributorsContract(global.user.web3)
    .methods
    .getCoversCount(
      _distributorName,
      _ownerAddress,
      _isActive)
      .call().then((_data:any) => {
        return _data;
      });
  }

}

/**
 * Return Covers  from owner's address of specified distributor.
 *
 * @remarks
 * Get active/inactive cover from user address
 *
 * @param distributorName
 * @param ownerAddress
 * @param activeCover
 * @param limit
 * @param web3
 * @returns Cover Object
 */
export async function getCovers(
  _web3 : any,
  _distributorName : string,
  _ownerAddress : string,
  _activeCover : boolean,
  _limit : number,
) : Promise<any[]>  {

  // if( _web3 || global.user.networkId ){ // global.user.networkId == 1

    if(_distributorName == "insurace"){
      return await getCoversInsurace(_web3);
    }else if(_distributorName == 'bridge'){
      return await getCoversBridgeV2();
    }else if(_distributorName == 'nexus'){
      return await getCoversNexus();
    }else if(_distributorName == 'ease'){
      return await getCoversEase();
    }

  // }else{
  //
  //   return await _getDistributorsContract(global.user.web3)
  //   .methods
  //   .getCovers(
  //     _distributorName,
  //     _ownerAddress,
  //     _activeCover,
  //     _limit,
  //   ).call().then((_data:any) => {
  //     console.log("getCovers SDK " , _distributorName ,  _data)
  //     return _data;
  //   });
  //
  // }

}

export async function getCoversNexus():Promise<any>{

  const distributor = await _getNexusDistributor(NetConfig.netById(global.user.ethNet.networkId).nexusDistributor );
  const count = await distributor.methods.balanceOf(global.user.account).call();

  global.events.emit("covers" , { itemsCount: count } );

  let covers = [];
  //fetch covers bought from Nexus Distributor
  for (let i = 0; i < Number(count); i++) {
    const tokenId = await distributor.methods.tokenOfOwnerByIndex(global.user.account, i).call();
    const cover = await distributor.methods.getCover(tokenId).call();
    cover.id = tokenId;
    cover.source = 'distributor';
    cover.risk_protocol = 'nexus';
    cover.net = global.user.ethNet.networkId;
    global.events.emit("covers" , { coverItem: cover} );
    covers.push(cover)
  }


  const gatewayAddress = await  distributor.methods.gateway().call()
  const nexusGatewayContract = await _getNexusGatewayContract(gatewayAddress);
  const masterAddress = await distributor.methods.master().call();
  const masterContract = await _getNexusMasterContract(masterAddress);
  const quotationAddress = await masterContract.methods.getLatestAddress(asciiToHex('QD')).call()
  const nexusQuotationContract = await  _getNexusQuotationContract(quotationAddress);

  //fetch covers bought from Nexus directly
  const coverIds = await nexusQuotationContract.methods.getAllCoversOfUser(global.user.account).call();

  global.events.emit("covers" , { itemsCount: coverIds.length } );

  for (const coverId of coverIds) {
    try {
      const cover = await nexusGatewayContract.methods.getCover(coverId).call();
      cover.id = coverId;
      cover.source = 'nexus';
      cover.risk_protocol = 'nexus';
      cover.net = global.user.ethNet.networkId;
      global.events.emit("covers" , { coverItem: cover} );
      covers.push(cover)
    } catch (e) {
      //ignore this cover
    }
  }

  const claimsDataAddress = await nexusGatewayContract.methods.claimsData().call();
  const nexusClaimsDataContract = await _getNexusClaimsDataContract(claimsDataAddress);
  const coverToClaim:any = {};
  if (covers.length > 0) {
    //collect all claims for distributor AND user
    const claimsByDistributor = await nexusClaimsDataContract.methods.getAllClaimsByAddress(distributor.options.address).call();
    const claimsByUser = await nexusClaimsDataContract.methods.getAllClaimsByAddress(global.user.account).call();
    const claims = claimsByDistributor.concat(claimsByUser);
    for (let i = 0; i < claims.length; i++) {
      let coverId = await nexusGatewayContract.methods.getClaimCoverId(claims[i]).call();
      coverToClaim[coverId] = claims[i];
    }
  }

  //update each with own claim (if any)
  for (let i = 0; i < covers.length; i++) {
    if (coverToClaim[covers[i].id]) {
      covers[i].claimId = coverToClaim[covers[i].id];
    }
    covers[i].endTime = covers[i].validUntil;
  }

  return covers;

}

export async function getCoversInsurace(_web3:any):Promise<any>{

  let allCovers:any = [];
  const insuraceCoverInstance = await  _getInsuraceDistributor(NetConfig.netById(_web3.networkId).insuraceCover, _web3.web3Instance);
  const coverDataAddress = await insuraceCoverInstance.methods.data().call()
  const coverDataInstance = await _getInsurAceCoverDataContract(coverDataAddress, _web3.web3Instance);
  const count =  await coverDataInstance.methods.getCoverCount(_web3.account).call();

  global.events.emit("covers" , { itemsCount: count } );

  for (let coverId = 1; coverId <= Number(count); coverId++) {

    const expirationP = coverDataInstance.methods.getCoverEndTimestamp(_web3.account, coverId.toString()).call();
    const startTimeP = coverDataInstance.methods.getCoverBeginTimestamp(_web3.account, coverId.toString()).call();
    const amountP =  coverDataInstance.methods.getCoverAmount(_web3.account, coverId.toString()).call();
    const currencyP =   coverDataInstance.methods.getCoverCurrency(_web3.account, coverId.toString()).call();
    const statusP =  coverDataInstance.methods.getAdjustedCoverStatus(_web3.account, coverId.toString()).call();

    const productId = await coverDataInstance.methods.getCoverProductId(_web3.account, coverId.toString()).call();
    const productAddress =  await insuraceCoverInstance.methods.product().call();
    const product =  await  _getInsurAceProductContract(productAddress, _web3.web3Instance);
    const prodDetailsP =  product.methods.getProductDetails(productId).call();

    let coverDataPromises = [expirationP, amountP, currencyP, statusP, prodDetailsP, startTimeP];

    await  Promise.all(coverDataPromises).then((_data:any) => {

      const [expiration, amount, currency, status, prodDetails, startTime] = _data;
      let coverNameUnified = CatalogHelper.unifyCoverName(hexToUtf8(prodDetails['0']), 'insurace' );

      let cover = {
        risk_protocol: 'insurace',
        contractName: coverNameUnified,
        coverType: hexToUtf8(prodDetails['1']),
        coverAmount: amount,
        coverAsset: currency,
        startTime: startTime,
        validUntil: expiration,
        endTime: expiration,
        status: status,
        net: _web3.networkId,
        rawData: prodDetails,
      }

      global.events.emit("covers" , { coverItem: cover} );

      allCovers.push(cover);

    });

  }

  return allCovers;
}

export async function getCoversBridgeV2():Promise<any>{

  const policyRegistryAddr = await _getBridgeV2RegistryContract( NetConfig.netById(global.user.ethNet.networkId).bridgeV2Registry , global.user.ethNet.web3Instance).methods.getPolicyRegistryContract().call();
  const policyRegistry = await  _getBridgeV2PolicyRegistry(policyRegistryAddr, global.user.ethNet.web3Instance)

  let trustWalletAssets: { [key: string]: any } = {};
  trustWalletAssets = await CatalogHelper.getTrustWalletAssets();

  const nPolicies = await  policyRegistry.methods.getPoliciesLength(global.user.account).call();
  const activeInfos = await  policyRegistry.methods.getPoliciesInfo(global.user.account, true, 0, nPolicies).call();
  const expiredInfos = await  policyRegistry.methods.getPoliciesInfo(global.user.account, false, 0, nPolicies).call();
  // merge the arrays from both sets
  let mergedPolicyInfos = activeInfos._policiesArr.concat(expiredInfos._policies);
  let mergedPolicyBooks = activeInfos._policyBooksArr.concat(expiredInfos._policyBooksArr);
  let mergedPolicyStatuses = activeInfos._policyStatuses.concat(expiredInfos._policyStatuses);
  let policies = []

  let limit = parseInt(nPolicies);

  global.events.emit("covers" , { itemsCount: limit } );

  for (let i = 0; i < limit; i++) {
    if (mergedPolicyBooks[i] === '0x0000000000000000000000000000000000000000') {
      //Bridge BUG, means no actual policy info
      limit++;
      continue;
    }
    let policyBook = await _getBridgeV2PolicyBookContract(mergedPolicyBooks[i], global.user.ethNet.web3Instance);
    let policyBookinfo = await policyBook.methods.info().call();
    let claimStatus = mergedPolicyStatuses[i];

    let asset = trustWalletAssets[Object.keys(trustWalletAssets)
      .find(key => key.toLowerCase() === policyBookinfo._insuredContract.toLowerCase())];

      let coverNameUnified = CatalogHelper.unifyCoverName( asset ? asset.name : policyBookinfo._symbol , 'bridge' );

      let cover = {
        risk_protocol: 'bridge',
        policyBookAddr: mergedPolicyBooks[i],
        status: claimStatus,
        coverAmount: mergedPolicyInfos[i].coverAmount,
        validUntil: mergedPolicyInfos[i].endTime,
        endTime: mergedPolicyInfos[i].endTime,
        premium: mergedPolicyInfos[i].premium,
        startTime: mergedPolicyInfos[i].startTime,
        name: coverNameUnified,
        net: global.user.ethNet.networkId
      }

      global.events.emit("covers" , { coverItem: cover} );

      policies.push(cover)
    }
  return policies;
}

export async function getCoversCountBridge():Promise<any>{


  return [];
}

export async function getCoversEase():Promise<any>{
  return await EaseApi.fetchCoverables()
      .then((data:any) => {
        let policies: any = []
        data.forEach(async(vault: any) => {
          let protocol = await _getIERC20Contract(vault.address);
          let instance = await _getEaseContract(vault.address);
          protocol.methods.balanceOf(global.user.account).call().then((balance: any) => {
            if (balance > 0) {
              vault.tokenBalance = fromWei(balance);
              let cover = {
                risk_protocol: 'ease',
                status: 0,
                coverAmount: balance,
                vaultCurrency: vault.symbol,
                coverAsset: vault.symbol,
                validUntil: Date.now(),
                endTime: Date.now(),
                startTime: Date.now(),
                name: CatalogHelper.unifyCoverName(vault.top_protocol, 'ease'),
                net: global.user.ethNet.networkId,
                instance: instance
              }
              global.events.emit("covers", {coverItem: cover});
              policies.push(cover)
            }
          })
        });
        return policies;
      })
}

export default {
   getCovers,
   getCoversCount,
}
