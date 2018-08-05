
const getWeb3ContractExists = (web3, contractAddress) => {
  return new Promise(function(resolve, reject) {
    web3.eth.getCode(contractAddress, (error, data) => {
      resolve(data !== '0x0')
    });
  })
} 

export default getWeb3ContractExists
