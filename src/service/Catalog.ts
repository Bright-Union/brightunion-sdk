const  CatalogFetch = require('@/service/helpers/CatalogService.js');

export function getCatalog (){

  CatalogFetch();

  return [1,2]
}


export default (getCatalog)
