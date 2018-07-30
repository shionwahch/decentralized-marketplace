# Decentralized Marketplace

## Description

The application is a decentralized marketplace. Users of the application is able to create Storefronts, list Products, and purchase Products. There are three roles: Admin, Store Owner and Shopper.

### Admin

The deployer of the contract is the Admin (and owner) of the decentralized marketplace. An Admin is able to add Ethereum addresses as Store Owners.

### Store Owner

A Store Owner is able create Storefronts and list Products on their Storefronts. They are able to withdraw Ethers (ETH) earned from the sale of their Products. All Store Owners have to be added by the Admin.

### Shopper

Shoppers are Ethereum addresses which are not Admin or Store Owner. A Shopper is able to view all the Storefronts and purchase any Products.


## Pre-requisitions

Node ([https://nodejs.org](https://nodejs.org)) <br>
Yarn ([https://yarnpkg.com](https://yarnpkg.com)) or NPM<br>
Truffle (`yarn global add truffle`) <br>
Ganache-CLI (`yarn global add ganache-cli`) <br>
Application is built with React and Truffle framework


## Running the Application in Development

### Start the Ethereum RPC Client
```
ganache-cli
```
The default port number for Ganache is `8545`

### Configure the Application

Check on the file `truffle.js`. Make sure that the port number matches the one that Ganache uses. 
```
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
```

### Install the Dependencies
```
yarn install
truffle install
truffle compile
truffle migrate
```

### Start the Application
```
yarn start
```

Visit http://localhost:3000.


## Notes

### Account Switching with MetaMask

The User Interface does not refresh automatically when you switch between accounts with MetaMask. To maintain display consistency, do refresh the browser every time when you switch an account with MetaMask.

### EthPM Packages
Packages in EthPM are outdated. Zeppelin is added to this codebase via EthPM due to specific requirements. One is advised to add this dependency module through Yarn instead.