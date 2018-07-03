pragma solidity ^0.4.24;

import "node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title Marketplace
 * @dev Marketplace dapp with single owner
 */
contract Marketplace is Ownable {
    
    address[] public storeOwners;
    uint public storeOwnerCount;
    mapping(address => bool) isStoreOwner;

    modifier uniqueStoreOwner(address _storeOwner) {
        require(isStoreOwner[_storeOwner] == false);
        _;
    }

    function getStoreOwner(uint _index) public view returns (address) {
        require(_index >= 0 && _index < storeOwnerCount);
        return storeOwners[_index];
    }

    function addStoreOwner(address _storeOwner) public onlyOwner uniqueStoreOwner(_storeOwner) returns (uint) {
        require(_storeOwner != address(0));
        storeOwners.push(_storeOwner);
        storeOwnerCount += 1;
        isStoreOwner[_storeOwner] = true;
        return storeOwnerCount - 1;
    }
}
