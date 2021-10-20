// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts-upgradeable/introspection/IERC165Upgradeable.sol";

interface IDistributor is IERC165Upgradeable {
    
    struct Cover {
        bytes32 coverType;
        uint256 productId;
        bytes32 contractName;
        uint256 coverAmount;
        uint256 premium;
        address currency;
        address contractAddress;
        uint256 expiration;
        uint256 status;
        address refAddress;
    }

    struct CoverQuote {
        uint256 prop1;
        uint256 prop2;
        uint256 prop3;
        uint256 prop4;
        uint256 prop5;
        uint256 prop6;
        uint256 prop7;
    }
    
    function getCoverCount(address _userAddr, bool _isActive) external view returns (uint256);
    
    function getCover(address _owner, uint256 _coverId,bool _isActive, uint256 _loopLimit) external view 
        returns(IDistributor.Cover memory);
    
    function getQuote(
        uint256 _interfaceCompliant1,
        uint256 _interfaceCompliant2,
        uint256 _sumAssured,
        uint256 _coverPeriod,
        address _contractAddress,
        address _coverAsset,
        address _nexusCoverable,
        bytes calldata _data
    )external view returns(
        IDistributor.CoverQuote memory
    );

    function buyCover(
        address contractAddress,
        address coverAsset,
        uint256 sumAssured,
        uint16 coverPeriod,
        uint8 coverType,
        uint256 maxPriceWithFee,
        bytes calldata data
    ) external payable;
    
    function buyCoverDecode(
        uint16[] memory products,
        uint16[] memory durationInDays,
        uint256[] memory amounts,
        address currency,
        uint256 premiumAmount,
        uint256[] memory helperParameters,
        uint256[] memory securityParameters,
        uint8[] memory v,
        bytes32[] memory r,
        bytes32[] memory s
    ) external payable;
 
                    
    function supportsInterface(bytes4 interfaceId) external view virtual override returns (bool);

}