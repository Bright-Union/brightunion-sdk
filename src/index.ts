/* eslint-disable */

import {getCoversCount, getCovers} from "./service/covers";
import geDistributorContract from "./service/helpers/getContract";

class BrightUnion{
  hash: string
  constructor(hash:string) {
    this.hash = hash;

  }

  covers = {

    async getCovers() {
      return await getCovers;
    },

    getCoversCount() {
      console.log(this.hash);
      // do something with service functions and return the final object

      return this.hash;
    },

  }

  // staking = {
  //   staking: 'staking fun'
  // }

}

export default BrightUnion
