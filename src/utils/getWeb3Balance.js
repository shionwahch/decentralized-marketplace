
const getWeb3Balance = (web3, account) => {
  return new Promise(function(resolve, reject) {
    web3.eth.getBalance(account, (error, balance) => {
      resolve(balance)
    });
  })
} 

export default getWeb3Balance
