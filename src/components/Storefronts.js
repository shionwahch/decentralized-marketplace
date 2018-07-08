import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import contract from 'truffle-contract'
import MarketplaceContract from '../../build/contracts/Marketplace.json'
import getWeb3 from '../utils/getWeb3'
import getCurrentUser from '../utils/getCurrentUser'
import AddStorefront from './AddStorefront'
import StoreOwner from '../models/StoreOwner'

class Storefronts extends Component {
  constructor(props) {
    super(props)

    this.handleUpdate = this.handleUpdate.bind(this)

    this.state = {
      web3: null,
      storefronts: [],
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
    const storefronts = await StoreOwner.listStorefronts(marketplaceInstance, currentUser.account)
    this.setState({ 
      storefronts: storefronts,
      marketplace: marketplaceInstance
    })
  }

  handleUpdate(newStorefront) {
    this.setState({ storefronts: this.state.storefronts.concat([newStorefront]) })
  }

  render() {
    return (
      <div className="pure-u-1-1">
        <h1>Storefront List</h1>
  
        <AddStorefront marketplace={this.state.marketplace} handleUpdate={this.handleUpdate}/>
  
        <table className="pure-table pure-table-horizontal no-border store-owner-list">
          <thead className="no-background-color">
              <tr>
                <th>#</th>
                <th>Storefronts</th>
              </tr>
          </thead>
  
          <tbody>
          { 
            _.map(this.state.storefronts, (storefront, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{storefront}</td>
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


Storefronts.propTypes = {
  storefronts: PropTypes.arrayOf(PropTypes.string)
}

export default Storefronts