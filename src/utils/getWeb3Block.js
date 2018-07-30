
const getWeb3Block = (web3, blockHash) => {
  return new Promise(function(resolve, reject) {
    web3.eth.getBlock(blockHash, (error, results) => {
      resolve(results)
    });
  })
}

export default getWeb3Block
