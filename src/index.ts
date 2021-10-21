/* eslint-disable */

import {getCoversCount, getCovers} from "./service/covers";
import getDistributorAddress from "./service/helpers/getContract";

class BrightUnion{
  hash: string
  constructor(hash:string) {
    this.hash = hash;

  }

  covers = {

    getCoversCount() {

      console.log(this.hash);
      // do something with service functions and return the final object

      return this.hash;
    },
    getCovers() {


      return
    },
  }

  // staking = {
  //   staking: 'staking fun'
  // }

}

export default BrightUnion
