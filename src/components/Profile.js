import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import contract from 'truffle-contract'
import MarketplaceContract from '../../build/contracts/Marketplace.json'
import getWeb3 from '../utils/getWeb3'
import getCurrentUser from '../utils/getCurrentUser'
import getWeb3Balance from '../utils/getWeb3Balance'
import { weiToEther } from '../utils/web3Utils'

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
    this.setState({ 
      currentUser: {
        account: currentUser.account,
        balance: balance.toNumber()
      },
      marketplace: marketplaceInstance
    })

    const event = this.state.marketplace.ProductPurchased({purchaser: currentUser.account}, {fromBlock: 0, toBlock: 'latest'})
    event.get((err, results) => {
      // this.setState({ transactions: results })
      // console.log(results)
    })
  }

  render() {
    return (
      <div className="pure-u-1-1">
        <h1>My Profile <span className="profile-balance">(Balance: {weiToEther(this.state.currentUser.balance)} ETH)</span></h1>

        <h3>Transaction History</h3>
        <table className="pure-table pure-table-horizontal no-border store-owner-list">
          <thead className="no-background-color">
              <tr>
                <th>#</th>
                <th>Address</th>
              </tr>
          </thead>
  
          <tbody>
          { 
            _.map(this.state.transactions, (transaction, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{transaction}</td>
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