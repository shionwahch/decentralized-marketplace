import Web3 from 'web3'

const weiToEther = (value) => {
  return Number((new Web3()).fromWei(value, 'ether'))
}

const etherToWei = (value) => {
  return Number((new Web3()).toWei(value, 'ether'))
}

export { weiToEther, etherToWei }