const BigNumber = require('bignumber.js');

module.exports = {
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  ZERO_BYTES32: '0x0000000000000000000000000000000000000000000000000000000000000000',
  MAX_UINT256: new BigNumber('2').pow(new BigNumber('256')).minus(new BigNumber('1')),
  MAX_INT256: new BigNumber('2').pow(new BigNumber('255')).minus(new BigNumber('1')),
  MIN_INT256: new BigNumber('2').pow(new BigNumber('255')).multipliedBy(new BigNumber('-1')),
};
