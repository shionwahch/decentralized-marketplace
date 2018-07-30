import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom';
import _ from 'lodash'
import contract from 'truffle-contract'
import MarketplaceContract from '../../build/contracts/Marketplace.json'
import getWeb3 from '../utils/getWeb3'
import getCurrentUser from '../utils/getCurrentUser'
import getWeb3Balance from '../utils/getWeb3Balance'
import getWeb3Block from '../utils/getWeb3Block'
import getProductPurchased from '../utils/getProductPurchased'
import { weiToEther } from '../utils/web3Utils'
import Product from '../models/Product'
import Storefront from '../models/Storefront'

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
    const marketplace = contract(MarketplaceContract)
    marketplace.setProvider(this.state.web3.currentProvider)
    const marketplaceInstance = await marketplace.deployed()
    marketplaceInstance.contract._eth.defaultAccount = marketplaceInstance.contract._eth.coinbase

    const currentUser = await getCurrentUser(marketplaceInstance, this.state.web3)
    const balance = await getWeb3Balance(this.state.web3, currentUser.account)
    const purchaseTransactions = _.filter(await getProductPurchased(marketplaceInstance), event => event.args.purchaser === currentUser.account)
    const transactionHistory = _.sortBy(await this.mapPurchaseTransactionToTransactionHistory(marketplaceInstance, purchaseTransactions), [(trx) => -trx.timestamp])
    
    this.setState({ 
      currentUser: {
        account: currentUser.account,
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
      }
    }))
  }

  render() {
    return (
      <div className="pure-u-1-1">
        <h1>My Profile <span className="profile-balance">(Balance: {weiToEther(this.state.currentUser.balance)} ETH)</span></h1>
        Address: {this.state.currentUser.account}
        <h3>Transaction History</h3>
        <table className="pure-table pure-table-horizontal no-border store-owner-list">
          <thead className="no-background-color">
              <tr>
                <th>Time</th>
                <th>Storefront</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total Cost (ETH)</th>
              </tr>
          </thead>
  
          <tbody>
          { 
            _.map(this.state.transactions, (transaction, index) => {
              return (
                <tr key={index}>
                  <td>{transaction.timestamp}</td>
                  <td><NavLink to={`browse/storefronts/${transaction.storefrontId}`}>{transaction.storefront}</NavLink></td>
                  <td>{transaction.name}</td>
                  <td>{transaction.quantity}</td>
                  <td>{transaction.cost}</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    )
  }

}


Profile.propTypes = {
  storeOwners: PropTypes.shape({
    owner: PropTypes.string,
    storefronts: PropTypes.arrayOf(PropTypes.number)
  })
}

export default Profile