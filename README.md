# Decentralized Marketplace

## Description

The application is a decentralized marketplace. Users of the application is able to create Storefronts, list Products, and purchase Products. There are three roles: Admin, Store Owner and Shopper.

A release is deployed to https://dmarketplace.herokuapp.com. Please be connected to [Rinkeby](https://rinkeby.etherscan.io) network via [MetaMask](https://metamask.io) before visiting the webpage.


## User Roles

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

Application is built with React and Truffle framework.


## Running the Application in Development

### Start the Ethereum RPC Client
```
ganache-cli
```
The default port number for Ganache is `8545`

### Configure the Application

Check on the file `truffle.js`. Make sure that the port number matches the one that Ganache uses (or other RPC client port number). 
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

### Run Tests for the Contract
```
truffle test
```

### Install the Dependencies
```
yarn install
truffle install
truffle compile
```

### Deploy the Contract
```
truffle migrate
```

### Start the Application
```
yarn start
```

Visit http://localhost:3000.


## Deploying to Production

### Install the Dependencies
```
yarn install
truffle install
truffle compile
```

### Deploy the Contract
The application uses [dotenv](https://github.com/motdotla/dotenv) to manage environmental variables. Create a `.env` file with values for the following variables.
```
REACT_APP_INFURA_API_KEY=
REACT_APP_WALLET_MNEMONIC=
```
Then deploy the contract to the network (`rinkeby`).
```
truffle migrate --network rinkeby
```

### Build for Production
Set the deployed address (from the step before) in the `.env` file.
```
REACT_APP_DEPLOYED_ADDRESS=
```
Then build the application with webpack.
```
yarn build
```
A minified bundle `build_webpack` will be created. Simply serve this folder.


## Feature and Issue Tracking

All user stories (features) and issues are tracked and managed in this [Trello Board](https://trello.com/b/7UhQQrn0).


## Notes

### Account Switching with MetaMask

The User Interface does not refresh automatically when you switch between accounts with MetaMask. To maintain display consistency, do refresh the browser every time when you switch an account with MetaMask.

### Slow Network Speed

It takes several seconds to get a response from the network hence the user interface feedback might be slow. Please be patient and wait for the network to response.

### EthPM Packages
Packages in EthPM are outdated. Zeppelin is added to this codebase via EthPM due to specific requirements. It is advised to add this dependency module through Yarn instead.