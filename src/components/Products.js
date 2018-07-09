import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import contract from 'truffle-contract'
import MarketplaceContract from '../../build/contracts/Marketplace.json'
import getWeb3 from '../utils/getWeb3'
// import getCurrentUser from '../utils/getCurrentUser'
import AddProduct from './AddProduct';

class Storefronts extends Component {
  constructor(props) {
    super(props)

    this.handleUpdate = this.handleUpdate.bind(this)

    this.state = {
      web3: null,
      products: [],
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

    // const currentUser = await getCurrentUser(marketplaceInstance, this.state.web3)
    // const storefronts = await Storefront.listStorefronts(marketplaceInstance, currentUser.account)
    this.setState({ 
      // products: products,
      marketplace: marketplaceInstance
    })
  }

  handleUpdate(newProduct) {
    this.setState({ storefronts: this.state.products.concat([newProduct]) })
  }

  render() {
    return (
      <div className="pure-u-1-1">
        <h1>Product List</h1>
  
        <AddProduct marketplace={this.state.marketplace} handleUpdate={this.handleUpdate}/>
  
        <table className="pure-table pure-table-horizontal no-border store-owner-list">
          <thead className="no-background-color">
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Price</th>
              </tr>
          </thead>
  
          <tbody>
          { 
            _.map(this.state.products, (product, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
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