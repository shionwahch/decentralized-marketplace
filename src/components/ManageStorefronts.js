import React, { Component } from 'react'
import PropTypes from 'prop-types'
import getWeb3 from '../utils/getWeb3'
import getCurrentUser from '../utils/getCurrentUser'
import getMarketplace from '../utils/getMarketplace'
import AddStorefront from './AddStorefront'
import StorefrontTableWithdraw from './StorefrontTableWithdraw'
import Storefront from '../models/Storefront'

class ManageStorefronts extends Component {
  constructor(props) {
    super(props)

    this.handleUpdate = this.handleUpdate.bind(this)

    this.state = {
      web3: null,
      storefronts: [],
      marketplace: null,
      currentUser: null
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
    const storefronts = await Storefront.listStorefrontsByAddress(marketplaceInstance, currentUser.account)
    this.setState({ 
      storefronts: storefronts,
      marketplace: marketplaceInstance,
      currentUser: currentUser
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
        <StorefrontTableWithdraw marketplace={this.state.marketplace} storefronts={this.state.storefronts} user={this.state.currentUser} />
        <h6>* All withdrawals will incur a transaction fee</h6>
      </div>
    )
  }

}


ManageStorefronts.propTypes = {
  storefronts: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        price: PropTypes.number,
        quantity: PropTypes.number,
      })
    )
  }),
  wallet: PropTypes.number,
}

export default ManageStorefronts