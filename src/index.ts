/* use strict */

import {getCoversCount , getCovers } from "./service/Covers";
import {getQuote} from "./service/Quotes";

class Distributors {
  web3: any;

  constructor(_web3 : any) {
    this.web3 = _web3;
    this.getCoverables();
  }

  getCoverables(){
    console.log('getCoverables')
  }

 getCovers() {
    return  getCovers;
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


}

export default Distributors;
