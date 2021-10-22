

  // import {availableOnNetwork} from '@/service/helpers/QuotationService.js';

  function availableOnNetwork(networkId, module) {
    return netById(networkId).modules.find(mod => mod === module);
  }

 function CatalogFetch(){

   console.log('CatalogFetch');

    //combines promises to be resolved once all coverables and essential data is available
    let allCoverablesReadyPromises = [];

    let ethereum = [state.web3.web3Active, ...state.web3.web3Passive].find(net => {
      return net.symbol === 'ETH'
    });

    allCoverablesReadyPromises.push(dispatch('getETHDAIPrice', {web3: ethereum}));
    allCoverablesReadyPromises.push(dispatch('getInsureUSDCPrice', {web3: ethereum}));

    if (availableOnNetwork(ethereum.networkId, 'BRIGHT_TOKEN')) {
      //Bright Union
      getContractsRegistryContract(netById(ethereum.networkId).brightContractRegistry, ethereum.web3Instance).then((contractsRegistry) => {
        //token
        contractsRegistry.methods.getBrightContract().call().then(brightTokenAddress => {
          getIERC20Contract(brightTokenAddress, ethereum.web3Instance).then((brightTokenContract) => {
            commit('registerBrightToken', brightTokenContract);
            commit('registerContractsRegistry', contractsRegistry);
          })
          dispatch('getBrightEthPrice', {web3: ethereum, brightAddress: brightTokenAddress});
        })
        //LP token
        if (availableOnNetwork(ethereum.networkId, 'BRIGHT_TOKEN')) {
          contractsRegistry.methods.getUniswapBrightToETHPairContract().call().then(uniPairToken => {
            getUniPairContract(uniPairToken, ethereum.web3Instance).then((uniPairTokenContract) => {
              commit('registerUniPairToken', uniPairTokenContract);
            });
          });
        }

      });
    }

    if (availableOnNetwork(ethereum.networkId, 'BRIDGE_MUTUAL')) {
      //Bridge
      allCoverablesReadyPromises.push(getBridgeRegistryContract(netById(ethereum.networkId).bridgeRegistry, ethereum.web3Instance).then((registry) => {
        commit('registerBridgeRegistry', registry)
        try {
          registry.methods.getPolicyQuoteContract().call().then(policyQuoteAddr => {
            getBridgePolicyQuoteContract(policyQuoteAddr, ethereum.web3Instance).then((policyQuote) => {
              commit('registerBridgePolicyQuote', policyQuote);
            });
          })
          .catch(e => {
            console.log('error getting Bridge.getPolicyQuoteContract', e)
          })
          registry.methods.getBMICoverStakingContract().call().then(bmiCoverStaking => {
            getBridgeBMICoverStakingContract(bmiCoverStaking, ethereum.web3Instance).then((coverStaking) => {
              commit('registerBridgeBMICoverStaking', coverStaking);
            });
          })
          registry.methods.getUSDTContract().call().then(stableTokenAddr => {
            getIERC20Contract(stableTokenAddr, ethereum.web3Instance).then((stableToken) => {
              commit('registerBridgeStableToken', stableToken);
            });

          });

          return registry.methods.getPolicyBookRegistryContract().call().then(policyBookRegistryAddr => {
            return getBridgePolicyBookRegistryContract(policyBookRegistryAddr, ethereum.web3Instance).then((policyBookRegistry) => {
              commit('registerBridgePolicyBookRegistry', policyBookRegistry)

              return dispatch('getBridgeCoverables');
            })
          });
        } catch (e) {
          //no Bridge behind this provider
          console.log('Error, no Bridge behind this provider:', e)
        }
      }));
    }

    if (availableOnNetwork(ethereum.networkId, 'NEXUS_MUTUAL')) {
      //Nexus
      allCoverablesReadyPromises.push(getNexusDistributorContract(netById(ethereum.networkId).nexusDistributor, ethereum.web3Instance).then((distributor) => {
        commit('registerNexusDistributor', distributor);

        distributor.methods.master().call().then(masterAddress => {
          getNexusMasterContract(masterAddress, ethereum.web3Instance).then((masterContract) => {
            commit('registerNexusMaster', masterContract);

            //get PooledStaking
            masterContract.methods.getLatestAddress(ethereum.web3Instance.utils.asciiToHex('PS')).call().then((stakingAddress) => {
              getNexusStakingContract(stakingAddress, ethereum.web3Instance).then(stakingContract => {
                commit('registerNexusStaking', stakingContract);
              });
            })
            //get 'Gateway' contract
            distributor.methods.gateway().call().then(gatewayAddress => {
              getNexusGatewayContract(gatewayAddress, ethereum.web3Instance).then(async (gatewayContract) => {
                commit('registerNexusGateway', gatewayContract);

                // get 'ClaimData' contract
                const claimsDataAddress = await gatewayContract.methods.claimsData().call();
                getNexusClaimsDataContract(claimsDataAddress, ethereum.web3Instance).then(claimsDataContract => {
                  commit('registerNexusClaimsData', claimsDataContract);

                  //get QuotationData
                  masterContract.methods.getLatestAddress(ethereum.web3Instance.utils.asciiToHex('QD')).call().then((quotationAddress) => {
                    getNexusQuotationContract(quotationAddress, ethereum.web3Instance).then(async (quotationContract) => {
                      commit('registerNexusQuotation', quotationContract);
                    });
                  })
                });
              })
            });
          })
        })
        return dispatch('getNexusCoverables');
      }).catch((err) => {
        console.log(err);
      }));
    }
    if (availableOnNetwork( ethereum.networkId, 'INSURACE')) {
      allCoverablesReadyPromises.push(getInsurAceCoverContract(netById( state.web3.web3Active.networkId).insuraceCover, state.web3.web3Active.web3Instance).then(insuraceCoverInstance => {
        commit('registerInsuraceCover', insuraceCoverInstance);
        insuraceCoverInstance.methods.product().call().then(productAddress => {
          getInsurAceProductContract(productAddress, state.web3.web3Active.web3Instance).then(productInstance => {
            commit('registerInsuraceProduct', productInstance);
            insuraceCoverInstance.methods.data().call().then(coverDataAddress => {
              getInsurAceCoverDataContract(coverDataAddress, state.web3.web3Active.web3Instance).then(coverDataInstance => {
                commit('registerInsuraceCoverData', coverDataInstance);
              })
            });
          })
        })

        return dispatch('getInsuraceCoverables', {web3: state.web3.web3Active})
      }))
    }

    Promise.all(allCoverablesReadyPromises).then(() =>{
      //merge coverables from different providers here
      const mergedCoverables = state.nexusCoverables.concat(state.bridgePolicyBooks).concat(state.insuraceCoverables);
      commit('allNonMergedCoverablesLoaded' , mergedCoverables);
      let coverablesNoDuplicates = [];
      let duplicateIndexes = [];
      for (let i = 0; i < mergedCoverables.length; i++) { // compare every with every
        if (!duplicateIndexes.includes(i)) {
          let duplicates = 1;
          let mergedCoverableObject = {};
          for (let j = i + 1; j < mergedCoverables.length; j++) {
            const mergedName = coverableDuplicate(mergedCoverables[i], mergedCoverables[j]);
            if (mergedName) {
              //duplicate found. merge the fields
              const mergedPair = _.mergeWith({}, mergedCoverables[i], mergedCoverables[j], (o, s) => _.isNull(s) ? o : s);
              mergedCoverableObject = _.mergeWith({}, mergedCoverableObject, mergedPair, (o, s) => _.isNull(s) ? o : s);

              mergedCoverableObject.availableCounter = ++duplicates;
              mergedCoverableObject.name = mergedName;
              duplicateIndexes.push(j)
            }
          }
          if (duplicates > 1) {
            coverablesNoDuplicates.push(mergedCoverableObject);
          } else {
            //no duplicate for it, leave it as is
            coverablesNoDuplicates.push(mergedCoverables[i])
          }
        }
      }
      coverablesNoDuplicates = coverablesNoDuplicates.sort((first, second) => {
        var nameA = first.name.toUpperCase();
        var nameB = second.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      commit('allCoverablesLoaded', coverablesNoDuplicates);
    });



  }

  export default {CatalogFetch}
