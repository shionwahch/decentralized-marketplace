pragma solidity ^0.4.24;

import "node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";


/**
 * @title Marketplace
 * @dev Marketplace dapp with single owner
 */
contract Marketplace is Ownable {
    
    struct StoreOwner {
        address owner;
        uint[] storefronts;
    }

    struct Storefront {
        string name;
    }

    StoreOwner[] private storeOwners;
    Storefront[] private storefronts;
    uint public storeOwnerCount;
    mapping(address => bool) private isStoreOwnerList;
    mapping(address => uint) private storeOwnerToIndex;
    
    modifier uniqueStoreOwner(address _storeOwner) {
        require(isStoreOwnerList[_storeOwner] == false);
        _;
    }

    function getStoreOwner(uint _index) public view returns (address, uint[]) {
        return (storeOwners[_index].owner, storeOwners[_index].storefronts);
    }

    function addStoreOwner(address _storeOwner) public onlyOwner uniqueStoreOwner(_storeOwner) returns (uint) {
        require(_storeOwner != address(0));
        
        StoreOwner memory storeOwner;
        storeOwner.owner = _storeOwner;
        storeOwners.push(storeOwner);

        storeOwnerCount += 1;
        storeOwnerToIndex[_storeOwner] = storeOwnerCount - 1;
        isStoreOwnerList[_storeOwner] = true;
        return storeOwnerCount - 1;
    }

    function isStoreOwner(address _storeOwner) public view returns (bool) {
        return isStoreOwnerList[_storeOwner];
    }

    function addStorefront(string _name) public returns (uint) {
        require(isStoreOwnerList[msg.sender]);
        
        Storefront memory storefront = Storefront(_name);
        storefronts.push(storefront);

        uint storefrontIndex = storefronts.length - 1;
        uint storeOwnerIndex = storeOwnerToIndex[msg.sender];
        storeOwners[storeOwnerIndex].storefronts.push(storefrontIndex);
        return storefrontIndex;
    }

    function getStorefront(uint _index) public view returns (string) {
        return (storefronts[_index].name);
    }

}
