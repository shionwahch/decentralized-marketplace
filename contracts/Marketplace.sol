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
        uint[] products;
    }

    struct Product {
        string name;
        uint price;
        uint quantity;
    }

    StoreOwner[] private storeOwners;
    Storefront[] private storefronts;
    Product[] private products;
    uint public storeOwnerCount;
    mapping(address => bool) private isStoreOwnerList;
    mapping(address => uint) private storeOwnerToIndex;
    
    modifier uniqueStoreOwner(address _storeOwner) {
        require(isStoreOwnerList[_storeOwner] == false);
        _;
    }

    function getStoreOwner(uint _index) public view returns (address, uint[]) {
        require(_index >= 0 && _index < storeOwnerCount);
        return (storeOwners[_index].owner, storeOwners[_index].storefronts);
    }

    function getStoreOwnerByAddress(address _storeOwner) public view returns (address, uint[]) {
        require(_storeOwner != address(0));

        uint storeOwnerIndex = storeOwnerToIndex[_storeOwner];
        return getStoreOwner(storeOwnerIndex);
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
        
        uint storefrontIndex = storefronts.length;
        Storefront memory storefront;
        storefront.name = _name;
        storefronts.push(storefront);

        uint storeOwnerIndex = storeOwnerToIndex[msg.sender];
        storeOwners[storeOwnerIndex].storefronts.push(storefrontIndex);
        return storefrontIndex;
    }

    function getStorefront(uint _index) public view returns (string) {
        return (storefronts[_index].name);
    }

    function addProduct(uint _storefrontIndex, string _name, uint _price, uint _quantity) public returns (uint) {
        require(_price >= 0);
        require(_quantity >= 0);

        uint productIndex = products.length;
        Product memory product = Product(_name, _price, _quantity);
        products.push(product);

        storefronts[_storefrontIndex].products.push(productIndex);
        return productIndex;
    }

    function getProduct(uint _index) public view returns (string, uint, uint) {
        return (products[_index].name, products[_index].price, products[_index].quantity);
    }

}
