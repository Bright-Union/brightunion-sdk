import DISTRIBUTORS from "../../service/distributors_config";
import getDistributorContract from "../../service/helpers/getContract";
import Cover from "../../service/domain/Cover";


export function getQuoteFrom(web3: object, distributorName:string) : Promise<object>  {

  console.log(distributorName);
  return;
}


export function getAllQuotes(web3: object) : Promise<object>  {
  console.log(web3);
  return;
}


export default {
  getQuoteFrom,
  getAllQuotes
}
