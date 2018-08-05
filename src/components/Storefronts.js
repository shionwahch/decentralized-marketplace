import React, { Component } from 'react'
import PropTypes from 'prop-types'
import getWeb3 from '../utils/getWeb3'
import getMarketplace from '../utils/getMarketplace'
import getCurrentUser from '../utils/getCurrentUser'
import StorefrontTable from './StorefrontTable'
import Storefront from '../models/Storefront'

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
    const marketplaceInstance = await getMarketplace(this.state.web3)

    const currentUser = await getCurrentUser(marketplaceInstance, this.state.web3)
    const storefronts = await Storefront.listStorefronts(marketplaceInstance, currentUser.account)
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
  
        <StorefrontTable storefronts={this.state.storefronts} />
      </div>
    )
  }

}


Storefronts.propTypes = {
  storefronts: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.number,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        price: PropTypes.number,
        quantity: PropTypes.number,
      })
    )
  })
}

export default Storefronts