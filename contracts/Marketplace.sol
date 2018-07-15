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
        uint id;
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
    
    /**
    * @dev Throws exception if store owner exists
    * @param _storeOwner Address of the store owner
    */
    modifier uniqueStoreOwner(address _storeOwner) {
        require(isStoreOwnerList[_storeOwner] == false);
        _;
    }

    /**
    * @dev Check if a store owner owns a particular storefront
    * @param _storeOwner Address of the store owner
    * @param _storefrontId Index of the storefront
    */
    modifier isStoreOwnerOfStorefront(address _storeOwner, uint _storefrontId) {
        bool storefrontExist = false;
        uint storeOwnerIndex = storeOwnerToIndex[_storeOwner];
        uint[] memory storefrontIds = storeOwners[storeOwnerIndex].storefronts;
        for (uint i = 0 ; i < storefrontIds.length ; i++) {
            if (storefrontIds[i] == _storefrontId) {
                storefrontExist = true;
                break;
            }
        }
        require(storefrontExist == true);
        _;
    }

    /**
    * @dev Retrieves store owner
    * @param _index Index of the store owner
    */
    function getStoreOwner(uint _index) public view returns (address, uint[]) {
        require(_index >= 0 && _index < storeOwnerCount);
        return (storeOwners[_index].owner, storeOwners[_index].storefronts);
    }
    
    /**
    * @dev Retrieves store owner
    * @param _storeOwner Address of the store owner
    */
    function getStoreOwnerByAddress(address _storeOwner) public view returns (address, uint[]) {
        require(_storeOwner != address(0));

        uint storeOwnerIndex = storeOwnerToIndex[_storeOwner];
        return getStoreOwner(storeOwnerIndex);
    }

    /**
    * @dev Add a new store owner
    * @param _storeOwner Address of the new store owner
    */   
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

    /**
    * @dev Check if an address is a store owner
    * @param _storeOwner Address of the store owner
    */
    function isStoreOwner(address _storeOwner) public view returns (bool) {
        return isStoreOwnerList[_storeOwner];
    }

    /**
    * @dev Add a storefront
    * @param _name Name of the storefront
    */
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
    
    /**
    * @dev Retrieves storefront
    * @param _index Index of the storefront
    */
    function getStorefront(uint _index) public view returns (string, uint[]) {
        return (storefronts[_index].name, storefronts[_index].products);
    }

    /**
    * @dev Add a product
    * @param _storefrontId The index of the storefront to own the product
    * @param _name Name of the product
    * @param _price Price of the product in ETH
    * @param _quantity Quantity of the product
    */
    function addProduct(uint _storefrontId, string _name, uint _price, uint _quantity) 
        isStoreOwnerOfStorefront(msg.sender, _storefrontId) public returns (uint) {
        require(_price >= 0);
        require(_quantity >= 0);

        uint productIndex = products.length;
        Product memory product = Product(productIndex, _name, _price, _quantity);
        products.push(product);

        storefronts[_storefrontId].products.push(productIndex);
        return productIndex;
    }

    /**
    * @dev Retrieves product
    * @param _index Index of the product
    */
    function getProduct(uint _index) public view returns (uint, string, uint, uint) {
        Product memory product = products[_index];
        return (product.id, product.name, product.price, product.quantity);
    }

}
