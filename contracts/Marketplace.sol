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
        uint id;
        string name;
        uint[] products;
        uint wallet;
    }

    struct Product {
        uint id;
        string name;
        uint price;
        uint quantity;
        uint storefrontId;
    }

    StoreOwner[] private storeOwners;
    Storefront[] private storefronts;
    Product[] private products;
    uint public storeOwnerCount;
    mapping(address => bool) private isStoreOwnerList;
    mapping(address => uint) private storeOwnerToIndex;

    event ProductAdded(uint id, string name, uint price, uint quantity);
    event ProductUpdated(uint id, string name, uint price, uint quantity);
    event ProductRemoved(uint id, string name, uint price, uint quantity);
    event ProductPurchased(uint id, uint quantity, uint cost, address purchaser);
    event StorefrontAdded(uint id, string name, uint[] products);
    
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
    * @dev Check if a product id is valid
    * @param _productId Index of the product
    */
    modifier validProductId(uint _productId) {
        require(_productId > 0);
        _;
    }

    /**
    * @dev Create invalid objects at index zero
    */
    constructor() public {
        Product memory product;
        products.push(product);
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
    function addStoreOwner(address _storeOwner) 
        public 
        onlyOwner 
        uniqueStoreOwner(_storeOwner) 
        returns (uint) 
    {
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
        storefront.id = storefrontIndex;
        storefront.name = _name;
        storefront.wallet = 0;
        storefronts.push(storefront);

        uint storeOwnerIndex = storeOwnerToIndex[msg.sender];
        storeOwners[storeOwnerIndex].storefronts.push(storefrontIndex);

        emit StorefrontAdded(storefrontIndex, _name, new uint[](0));

        return storefrontIndex;
    }
    
    /**
    * @dev Retrieves storefront
    * @param _index Index of the storefront
    */
    function getStorefront(uint _index) public view returns (uint, string, uint[], uint) {
        return (storefronts[_index].id, storefronts[_index].name, storefronts[_index].products, storefronts[_index].wallet);
    }

    /**
    * @dev Add a product
    * @param _storefrontId The index of the storefront to own the product
    * @param _name Name of the product
    * @param _price Price of the product in ETH
    * @param _quantity Quantity of the product
    */
    function addProduct(uint _storefrontId, string _name, uint _price, uint _quantity) 
        public 
        isStoreOwnerOfStorefront(msg.sender, _storefrontId) 
        returns (uint) 
    {
        require(_price >= 0);
        require(_quantity >= 0);

        uint productIndex = products.length;
        Product memory product = Product(productIndex, _name, _price * 1 ether, _quantity, _storefrontId);
        products.push(product);

        storefronts[_storefrontId].products.push(productIndex);

        emit ProductAdded(productIndex, _name, _price, _quantity);

        return productIndex;
    }

    /**
    * @dev Retrieves product
    * @param _index Index of the product
    */
    function getProduct(uint _index) 
        public 
        view 
        validProductId(_index)
        returns (uint, string, uint, uint) 
    {
        Product memory product = products[_index];
        return (product.id, product.name, product.price, product.quantity);
    }

    /**
    * @dev Updates product
    * @param _index Index of the product
    * @param _name Name of the product
    * @param _price Price of the product in ETH
    * @param _quantity Quantity of the product
    */
    function updateProduct(uint _index, string _name, uint _price, uint _quantity) 
        public 
        payable 
        isStoreOwnerOfStorefront(msg.sender, products[_index].storefrontId)
        validProductId(_index)
        returns (uint) 
    {
        Product storage product = products[_index];
        product.name = _name;
        product.price = _price * 1 ether;
        product.quantity = _quantity;

        emit ProductUpdated(_index, _name, _price, _quantity);

        return _index;
    }

    /**
    * @dev Removes product
    * @param _index Index of the product
    */
    function removeProduct(uint _index) 
        public 
        payable 
        isStoreOwnerOfStorefront(msg.sender, products[_index].storefrontId)
        validProductId(_index) 
        returns (uint) 
    {
        Product memory product = products[_index];
        delete products[_index];

        emit ProductRemoved(product.id, product.name, product.price, product.quantity);

        return _index;
    }

    /**
    * @dev Purchases product
    * @param _index Index of the product
    * @param _quantity Quantity of the product to purchase
    */
    function purchaseProduct(uint _index, uint _quantity) 
        public 
        payable 
        validProductId(_index) 
        returns (uint) 
    {
        require(products[_index].quantity >= _quantity);
        require(msg.value == products[_index].price * _quantity);

        products[_index].quantity -= _quantity;
        storefronts[products[_index].storefrontId].wallet += msg.value;

        emit ProductPurchased(_index, _quantity, msg.value, msg.sender);

        return _index;
    }

}
