/*
    Copyright (C) 2021 Brightunion.io

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/
*/

// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.7.4;
pragma experimental ABIEncoderV2;

interface Distributors{

    event BoughtCover(
        string indexed provider,
        IDistributor.Cover
        );
        
    event ErrorNotHandled(
        address indexed owner,
        bytes distributor,
        bytes reason
    );
    
    
    /// @dev Init the protocol with registry address
    /// @param _registry Address of the registry contract
    function initialize(address payable _registry);
    
    /// @dev Requires distributor address to implement the IDistributor interface OR "Bright Interface"
    modifier supportsIDistributor(string memory _distributorName);

   function getDistributorAddress(string memory _distributorName) public view returns(address);
    
    /// @dev Gets the cover count owned by spec address
    /// @param _distributorName String Distributor name on lower case ie: nexus, bridge etc...
    /// @param _owner The Owner ethereum address
    /// @param _isActive boolean value to get Active/Unactive covers
    /// @return integer count number
    function getCoversCount(string memory _distributorName, address _owner, bool _isActive) 
        public view supportsIDistributor(_distributorName) 
        returns(uint256);

    /// @dev Gets all the covers for spec address
    /// @param _owner Owner ethereum address
    /// @param _isActive boolean value to get Active/Unactive covers
    /// @param _limitLoop integer large number to avoid running out of gas
    /// @return IDistributor.Cover[] array of covers objects, refer to IDistributors interface
    function getCovers(
        string memory _distributorName,
        address _owner,
        bool _isActive,
        uint256 _limitLoop
        ) public supportsIDistributor(_distributorName)
          view returns (IDistributor.Cover[] memory);
    
    
    /// @dev Gets single cover quote
    /// @param _distributorName string name of the protocol/distributor to buy from
    /// @param _interfaceCompliant1 Param to comply with interface unused by some distributors
    /// @param _interfaceCompliant2 But used by others, keep the method signature
    /// @param _sumAssured Total Sum covered
    /// @param _coverPeriod Covered period of the risk coverage
    /// @param _contractAddress Cover's reference or contract address
    /// @param _coverAsset Asset address of currency to pay with
    /// @param _nexusCoverable cover ref Address
    /// @param _data encode data
    /// @return Distributor.Cover array of Cover objects, refer to IDistributors interface
    function getQuote(
        string memory _distributorName,
        uint256 _interfaceCompliant1,
        uint256 _interfaceCompliant2,
        uint256 _sumAssured,
        uint256 _coverPeriod,
        address _contractAddress,
        address _coverAsset,
        address _nexusCoverable,
        bytes calldata _data
        ) public supportsIDistributor(_distributorName) 
        view returns(IDistributor.CoverQuote memory);

    /// @dev Buy a ssingle cover
    /// @param _distributorName string name of the protocol/distributor to buy from
    /// @param _contractAddress Cover's reference or contract address
    /// @param _coverAsset Asset address of currency to pay with
    /// @param _sumAssured Total Sum covered
    /// @param _coverPeriod Covered period of the risk coverage
    /// @param _coverType Cover's specific protocol type
    /// @param _maxPriceWithFee Cover's total premium
    /// @param _data calldata encoded data params
    function buyCover(
        string memory _distributorName,
        address _contractAddress,
        address _coverAsset,
        uint256 _sumAssured,
        uint16 _coverPeriod,
        uint8 _coverType,
        uint256 _maxPriceWithFee,
        bytes calldata _data
    ) public supportsIDistributor(_distributorName);
    

    /// @dev  Buy Insurace Covers in bulk
    /// @param  _distributorName string name of the protocol/distributor to buy from
    /// @param  _products  Array Product Ids of covers
    /// @param  _durationInDays Array Cover periods
    /// @param  _amounts Array Covered sum amounts
    /// @param  _currency address of the asset to pay with
    /// @param  _premiumAmount uint256 Cover total price
    /// @param  _helperParameters Array security params provided by confirmCover Insurace http api call
    /// @param  _securityParameters Array security params provided by confirmCover Insurace http api call
    /// @param  _v Array Private key ECDSA signature msg param
    /// @param  _r Array Private key ECDSA signature msg param
    /// @param  _s Array Private key ECDSA signature msg param
    function buyCoverDecode(
        string memory _distributorName,
        uint16[] memory _products,
        uint16[] memory _durationInDays,
        uint256[] memory _amounts,
        address _currency,
        uint256 _premiumAmount,
        uint256[] memory _helperParameters,
        uint256[] memory _securityParameters,
        uint8[] memory _v,
        bytes32[] memory _r,
        bytes32[] memory _s
    ) public supportsIDistributor(_distributorName);
 
    fallback() external payable;
    
}