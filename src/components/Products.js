import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'
import contract from 'truffle-contract'
import MarketplaceContract from '../../build/contracts/Marketplace.json'
import getWeb3 from '../utils/getWeb3'
import AddProduct from './AddProduct'
import Product from '../models/Product'
import EditProduct from './EditProduct'

class Products extends Component {
  constructor(props) {
    super(props)

    this.handleUpdate = this.handleUpdate.bind(this)
    this.state = {
      web3: null,
      products: [],
      storefrontId: this.props.match.params.id,
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

    const products = await Product.listProducts(marketplaceInstance, this.state.storefrontId)
    this.setState({ 
      products: products,
      marketplace: marketplaceInstance
    })
  }

  handleUpdate(newProduct) {
    this.setState({ products: this.state.products.concat([newProduct]) })
  }

  render() {
    return (
      <div className="pure-u-1-1">
        <h1>Product List</h1>
  
        <AddProduct marketplace={this.state.marketplace} storefrontId={this.state.storefrontId} handleUpdate={this.handleUpdate}/>
  
        <table className="pure-table pure-table-horizontal no-border store-owner-list">
          <thead className="no-background-color">
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Price (ETH)</th>
                <th>Quantity</th>
                <th></th>
              </tr>
          </thead>
  
          <tbody>
          { 
            _.map(this.state.products, (product, index) => {
              return (
                <tr key={`product-${product.id}`}>
                  <td>{index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td><NavLink to={`#edit-product-${product.id}`} data-toggle="modal" data-target={`#edit-product-${product.id}`}>Edit</NavLink></td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
        {
          _.map(this.state.products, product => <EditProduct key={"edit-product-"+product.id} product={product}/>)
        }
      </div>
    )
  }

}

Products.propTypes = {
  products: PropTypes.arrayOf(PropTypes.string)
}

export default withRouter(Products)