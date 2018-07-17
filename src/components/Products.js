import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'
import contract from 'truffle-contract'
import MarketplaceContract from '../../build/contracts/Marketplace.json'
import getWeb3 from '../utils/getWeb3'
import Product from '../models/Product'
import ProductTable from './ProductTable'
import BuyProduct from './BuyProduct'

class Products extends Component {
  constructor(props) {
    super(props)

    this.handlePurchase = this.handlePurchase.bind(this)

    this.state = {
      web3: null,
      products: [],
      storefrontId: parseInt(this.props.match.params.id, 10),
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

  handlePurchase(updatedProduct) {
    // const productIndex = _.findIndex(this.state.products, product => product.id === updatedProduct.id)
    // if (productIndex === -1) return

    // const currentProducts = this.state.products
    // currentProducts[productIndex] = updatedProduct
    // this.setState({
    //   products: currentProducts
    // })
  }

  render() {
    return (
      <div className="pure-u-1-1">
        <h1>Product List</h1>
  
        <ProductTable products={this.state.products} />
        {
          _.map(this.state.products, product => <BuyProduct key={"buy-product-"+product.id} marketplace={this.state.marketplace} product={product} handlePurchase={this.handlePurchase} />)
        }
      </div>
    )
  }

}


Products.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.number,
      quantity: PropTypes.number,
    })
  ),
  storefrontId: PropTypes.string
}

export default withRouter(Products)