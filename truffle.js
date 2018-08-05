require('dotenv').config();
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.REACT_APP_WALLET_MNEMONIC, "https://rinkeby.infura.io/" + process.env.REACT_APP_INFURA_API_KEY),
      network_id: 4,
      gas: 7000000,
      gasPrice: 1000000000
    }
  }
};
