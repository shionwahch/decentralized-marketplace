module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: `https://rinkeby.infura.io/${process.env.REACT_APP_INFURA_API_KEY}`,
      network_id: 4
    }
  }
};
