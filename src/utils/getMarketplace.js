import contract from 'truffle-contract'
import MarketplaceContract from '../../build/contracts/Marketplace.json'

const getMarketplace = async (web3) => {
  const marketplace = contract(MarketplaceContract)
  marketplace.setProvider(web3.currentProvider)
  
  const marketplaceInstance = await marketplace.at(process.env.REACT_APP_DEPLOYED_ADDRESS)
  marketplaceInstance.contract._eth.defaultAccount = marketplaceInstance.contract._eth.coinbase
  
  return marketplaceInstance
}

export default getMarketplace