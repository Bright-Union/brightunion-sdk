


export async function buyQuote(_distributorName: string, _quoteProtocol: any): Promise<any[]> {

  if(_distributorName == 'bridge'){

  }else if(_distributorName == 'nexus'){


  }else if(_distributorName == 'insurace'){

    // return await buyCoverInsurace(
    //   _ownerAddress,
    //   _distributorName,
    //   _products,
    //   _durationInDays,
    //   _amounts,
    //   _currency,
    //   _premiumAmount,
    //   _helperParameters,
    //   _securityParameters,
    //   _v,
    //   _r,
    //   _s
    // );

  }

  return [];

}


export default buyQuote
