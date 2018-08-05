import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import getWeb3 from '../utils/getWeb3'
import getMarketplace from '../utils/getMarketplace'
import getCurrentUser from '../utils/getCurrentUser'
import getWeb3Balance from '../utils/getWeb3Balance'
import getWeb3Block from '../utils/getWeb3Block'
import getProductPurchased from '../utils/getProductPurchased'
import { weiToEther } from '../utils/web3Utils'
import Product from '../models/Product'
import Storefront from '../models/Storefront'
import Role from '../constants/role'
import TransactionHistoryTable from './TransactionHistoryTable'

class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      currentUser: {
        account: '',
        balance: ''
      },
      transactions: [],
      marketplace: null
    }
  }

  async componentWillMount() {
    const web3 = await getWeb3
    
    this.setState({ web3: web3 })
    this.initializeData()
  }

  async initializeData() {
    const marketplaceInstance = await getMarketplace(this.state.web3)

    const currentUser = await getCurrentUser(marketplaceInstance, this.state.web3)
    const balance = await getWeb3Balance(this.state.web3, currentUser.account)
    let purchaseTransactions = currentUser.role === Role.ADMIN ? [] : await getProductPurchased(marketplaceInstance)
    
    if (currentUser.role === Role.SHOPPER) {
      purchaseTransactions = _.filter(purchaseTransactions, event => event.args.purchaser === currentUser.account)
    } else if (currentUser.role === Role.STORE_OWNER) {
      const storefronts = await Storefront.listStorefrontsByAddress(marketplaceInstance, currentUser.account)
      const productIds = _.map(_.flatten(_.map(storefronts, storefront => storefront.products)), id => id.toNumber())
      purchaseTransactions = _.filter(purchaseTransactions, event => _.includes(productIds, event.args.id.toNumber()))
    }

    const transactionHistory = _.sortBy(await this.mapPurchaseTransactionToTransactionHistory(marketplaceInstance, purchaseTransactions), [(trx) => -trx.timestamp])
    
    this.setState({ 
      currentUser: {
        account: currentUser.account,
        role: currentUser.role,
        balance: balance.toNumber()
      },
      transactions: transactionHistory,
      marketplace: marketplaceInstance
    })
  }

  mapPurchaseTransactionToTransactionHistory(marketplace, purchaseTransactions) {
    return Promise.all(_.map(purchaseTransactions, async transaction => {
      const product = await Product.getById(marketplace, transaction.args.id.toNumber())
      const storefront = await Storefront.getById(marketplace, product.storefrontId)
      const block = await getWeb3Block(this.state.web3, transaction.blockHash)
      return {
        timestamp: (new Date(block.timestamp * 1000)).toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric'}),
        storefront: storefront.name,
        storefrontId: storefront.id,
        name: product.name,
        quantity: transaction.args.quantity.toNumber(),
        cost: weiToEther(transaction.args.cost),
        image: product.image
      }
    }))
  }

  render() {
    return (
      <div className="pure-u-1-1">
        <h1>My Profile <span className="profile-balance">(Balance: {weiToEther(this.state.currentUser.balance)} ETH)</span></h1>
        Address: {this.state.currentUser.account} <br/>
        Role: {_.startCase(_.replace(_.lowerCase(this.state.currentUser.role), '_', ' ').toString())}
        
        <h3>Transaction History</h3>
        <TransactionHistoryTable transactions={this.state.transactions} />
      </div>
    )
  }

}


Profile.propTypes = {
  currentUser: PropTypes.shape({
    account: PropTypes.string,
    role: PropTypes.string,
    balance: PropTypes.number
  }),
  transactions: PropTypes.shape({
    timestamp: PropTypes.string,
    storefront: PropTypes.string,
    storefrontId: PropTypes.number,
    name: PropTypes.string,
    quantity: PropTypes.number,
    cost: PropTypes.number,
  })
}

export default Profile