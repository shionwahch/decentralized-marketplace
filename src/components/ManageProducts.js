import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'
import getWeb3 from '../utils/getWeb3'
import getMarketplace from '../utils/getMarketplace'
import AddProduct from './AddProduct'
import ProductTableEdit from './ProductTableEdit'
import Product from '../models/Product'
import Storefront from '../models/Storefront'
import EditProduct from './EditProduct'

class ManageProducts extends Component {
  constructor(props) {
    super(props)

    this.handleAdd = this.handleAdd.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleDelete = this.handleDelete.bind(this)

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
    console.log(products)
    this.setState({ 
      storefront: storefront,
      products: products,
      marketplace: marketplaceInstance
    })
  }

  handleAdd(newProduct) {
    this.setState({ products: this.state.products.concat([newProduct]) })
  }

  handleUpdate(updatedProduct) {
    const productIndex = _.findIndex(this.state.products, product => product.id === updatedProduct.id)
    if (productIndex === -1) return

    const currentProducts = this.state.products
    currentProducts[productIndex] = updatedProduct
    this.setState({
      products: currentProducts
    })
  }

  handleDelete(deletedProduct) {
    const currentProducts = this.state.products
    _.remove(currentProducts, product => product.id === deletedProduct.id)
    this.setState({
      products: currentProducts
    })
  }

  render() {
    return (
      <div className="pure-u-1-1">
        <h1>{this.state.storefront ? `${this.state.storefront.name} Product List` : '\u00A0'}</h1>
  
        <AddProduct marketplace={this.state.marketplace} storefrontId={this.state.storefrontId} handleAdd={this.handleAdd}/>
        <ProductTableEdit products={this.state.products} />
        {
          _.map(this.state.products, product => <EditProduct key={"edit-product-"+product.id} marketplace={this.state.marketplace} product={product} handleUpdate={this.handleUpdate} handleDelete={this.handleDelete}/>)
        }
      </div>
    )
  }

}


ManageProducts.propTypes = {
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

export default withRouter(ManageProducts)