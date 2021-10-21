/* eslint-disable */

import {getCoversCount, getCovers} from "./service/covers/CoversService";
import geDistributorContract from "./service/helpers/getContract";

class BrightUnion{
  web3: object

  constructor(web3:object) {
    this.web3 = web3;
  }

  covers: object = {
    owner: this,

    async getCovers() {
      return await getCovers(this.owner.web3.web3Instance);
    },

    getCoversCount() {
      // do something with service functions and return the final object

      return '';
    },

  }

  // staking = {
  //   staking: 'staking fun'
  // }

}

export default BrightUnion
