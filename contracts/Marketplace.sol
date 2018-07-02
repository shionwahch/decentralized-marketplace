pragma solidity ^0.4.24;

import "node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title Marketplace
 * @dev Marketplace dapp with single owner
 */
contract Marketplace is Ownable {
    
    address[] public storeOwners;
    uint public storeOwnerCount;

    function addStoreOwner(address _storeOwner) public onlyOwner returns (uint) {
        require(_storeOwner != address(0));
        storeOwners.push(_storeOwner);
        storeOwnerCount += 1;
        return storeOwnerCount - 1;
    }
}
