import React, { Component } from 'react'
import PropTypes from 'prop-types';
import _ from 'lodash'
import contract from 'truffle-contract'
import MarketplaceContract from '../../build/contracts/Marketplace.json'
import getWeb3 from '../utils/getWeb3'
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
    const marketplace = contract(MarketplaceContract)
    marketplace.setProvider(this.state.web3.currentProvider)
    const marketplaceInstance = await marketplace.deployed()
    marketplaceInstance.contract._eth.defaultAccount = marketplaceInstance.contract._eth.coinbase

    const products = await Product.listProducts(marketplaceInstance)
    this.setState({
      products: products,
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
        <h1>Welcome, {_.startCase(_.lowerCase(this.state.user.role))}!</h1>
        <p>Ready to shop!</p>
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