import Web3 from 'web3';


/*********** Bright Union SDK ************/

import BrightClient from "../BrightClient"

/*************** Example *****************/

const example = () => {

    // Define blockchain node provider
    const _web3 = new Web3('https://rinkeby.infura.io/v3/98d7e501879243c5877bac07a57cde7e');

    /**
     *  Initialize SDK in specific chain
     */
    const brightClient = new BrightClient({ _web3 });
    brightClient.initialize();

    /**
     *  GetBright Union Catalog
     */
     brightClient.getCatalog();


     /**
      *  Verify if distributor is supported
      */
      brightClient.getDistributorAddress('<distributor-name>');
    
    /**
      *  Get all cover around all distributors an address has
      */
     brightClient.getAllCovers('<owner-address>');

     /**
      *  Get the total number of covers an account has with a distributor
      *  true/false for Active or Inactive covers
      */
      brightClient.getCoversCount(
                            '<distributor-name',
                            'owner-address',
                             true);
                             
    /**
     *  Get the Quote for a specified cover
     */
      brightClient.getQuoteFrom('<distributor-name>',
                                 '_amount',
                                 '_currency',
                                 '_period',
                                 '_protocol');
      
      /**
       *  Buy cover for supported distributor
       */
       brightClient.buyCover('<ownerAddress>',
                             '<distributorName>',
                             '<contractAddress>',
                             '<coverAsset>',
                             '<sumAssured>',
                             '<coverPeriod>',
                             '<coverType>',
                             '<maxPriceWithFee>',
                             '<data>',
                        );


     /**
      *  Buy Cover for Insurace
      */
      brightClient.buyCoverInsurace(
                            '<_ownerAddress>',
                            '<_distributorName>',
                            '<_products>',
                            '<_durationInDays>',
                            '<_amounts>',
                            '<_currency>',
                            '<_premiumAmount>',
                            '<_helperParameters>',
                            '<_securityParameters>',
                            '<_v>',
                            '<_r>',
                            '<_s>',
                        );



}
