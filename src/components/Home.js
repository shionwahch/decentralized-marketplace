import React, { Component } from 'react'
import PropTypes from 'prop-types';
import _ from 'lodash'
import getWeb3 from '../utils/getWeb3'
import getMarketplace from '../utils/getMarketplace'
import Product from '../models/Product'
import ProductCard from './ProductCard'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      user: this.props.user,
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
    const marketplaceInstance = await getMarketplace(this.state.web3)

    const products = await Product.listProducts(marketplaceInstance)
    const productsWithStorefront = await Promise.all(_.map(products, async product => await Product.attachStorefront(marketplaceInstance, product)))
    this.setState({
      products: productsWithStorefront,
      marketplace: marketplaceInstance
    })
  }

  componentDidUpdate(prevProps) {
    if(this.props.user.account !== prevProps.user.account) {
      this.setState({ user: this.props.user })
    }
  }

  render() {
    return (
      <div className="pure-u-1-1">
        <h1>Welcome{ this.state.user.role ? `, ${_.startCase(_.lowerCase(this.state.user.role))}` : ''}!</h1>
        {
          _.map(this.state.products, product => <ProductCard key={"product-card-"+product.id} product={product} />)
        }
      </div>
    )
  }
}


Home.propTypes = {
  user: PropTypes.shape({
    account: PropTypes.string,
    role: PropTypes.string
  })
}

export default Home