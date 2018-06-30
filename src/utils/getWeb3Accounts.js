
const getWeb3Accounts = (web3) => {
  return new Promise(function(resolve, reject) {
    web3.eth.getAccounts((error, accounts) => {
      resolve(accounts)
    });
  })
} 

export default getWeb3Accounts
