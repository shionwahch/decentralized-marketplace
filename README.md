# Decentralized Marketplace

Built with React and Truffle framework.

## Pre-requisitions

Node ([https://nodejs.org](https://nodejs.org)) <br>
Yarn ([https://yarnpkg.com](https://yarnpkg.com)) or NPM<br>
Truffle (`yarn global add truffle`) <br>
Ganache-CLI (`yarn global add ganache-cli`)

## Running the Application

### Start the Ethereum RPC Client
```
ganache-cli
```
Ganache default port number is `8545`

### Configure the Application
Check on the file `truffle.js`. Make sure that the port number matches the one that Ganache uses. 

### Start the Application
```
yarn install
truffle install
truffle compile
truffle migrate
yarn start
```

Visit http://localhost:3000.


## Notes

Packages in EthPM are outdated. Zeppelin is added to this codebase via EthPM due to specific business requirements, one is advised to add this dependency module through Yarn instead.