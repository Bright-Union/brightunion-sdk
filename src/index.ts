/* use strict */

import {getCoversCount, getCovers} from "./service/Covers";

class Distributors {
  web3: any;

  constructor(_web3 : any) {
    this.web3 = _web3;
  }

    async getCovers() {
      return await getCovers;
    }

    async getCoversCount(
      _distributorName : string,
      _owner: string ,
      _isActive : boolean
    ) {
      return await getCoversCount(
        this.web3,
        _distributorName,
        _owner,
        _isActive
      )
    }

  // staking = {
  //   staking: 'staking fun'
  // }

}

export default Distributors;
