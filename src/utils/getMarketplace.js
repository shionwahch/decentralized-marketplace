import contract from 'truffle-contract'
import MarketplaceContract from '../../build/contracts/Marketplace.json'
import getWeb3ContractExists from './getWeb3ContractExists'

const getMarketplace = async (web3) => {
  const marketplace = contract(MarketplaceContract)
  marketplace.setProvider(web3.currentProvider)
  
  const contractExists = await getWeb3ContractExists(web3, process.env.REACT_APP_DEPLOYED_ADDRESS)
  const marketplaceInstance = contractExists ? await marketplace.at(process.env.REACT_APP_DEPLOYED_ADDRESS) : await marketplace.deployed()
  marketplaceInstance.contract._eth.defaultAccount = marketplaceInstance.contract._eth.coinbase
  
  return marketplaceInstance
}

export default getMarketplace