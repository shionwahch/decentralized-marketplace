import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'
import getWeb3 from '../utils/getWeb3'
import getMarketplace from '../utils/getMarketplace'
import Product from '../models/Product'
import Storefront from '../models/Storefront'
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
    const marketplaceInstance = await getMarketplace(this.state.web3)

    const storefront = await Storefront.getById(marketplaceInstance, this.state.storefrontId)
    const products = await Product.listProductsByStorefrontId(marketplaceInstance, this.state.storefrontId)
    this.setState({
      storefront: storefront,
      products: products,
      marketplace: marketplaceInstance
    })
  }

  handlePurchase(purchasedProduct) {
    const productIndex = _.findIndex(this.state.products, product => product.id === purchasedProduct.id)
    if (productIndex === -1) return

    const currentProducts = this.state.products
    currentProducts[productIndex].quantity -= purchasedProduct.quantity
    this.setState({
      products: currentProducts
    })
  }

  render() {
    return (
      <div className="pure-u-1-1">
        <h1>Welcome to {this.state.storefront ? this.state.storefront.name : null}</h1>
  
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