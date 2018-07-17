import React, { Component } from 'react'
import Product from '../models/Product'

class AddProduct extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      id: '',
      name: '',
      price: '',
      quantity: '',
      storefrontId: this.props.storefrontId,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }
  
  handleSubmit = async (event, marketplace) => {
    event.preventDefault();
    try {
      const newProduct = await Product.addProduct(marketplace, this.state.storefrontId, this.state.name, parseInt(this.state.price, 10), parseInt(this.state.quantity, 10))
      this.props.handleAdd(newProduct)
    } catch (e) {
      alert('Error: Only Store Owner is able to add a Product')
    }
  }

  render() {
    const { marketplace } = this.props

    return (
      <form className="pure-form pure-g add-form" onSubmit={(event) => this.handleSubmit(event, marketplace)}>
        <input className="pure-u-1-2" type="text" name="name" placeholder="Product Name" value={this.state.name} onChange={this.handleChange}/>
        <input className="pure-u-1-8" type="text" name="price" placeholder="Price (ETH)" value={this.state.price} onChange={this.handleChange}/>
        <input className="pure-u-1-8" type="text" name="quantity" placeholder="Quantity" value={this.state.quantity} onChange={this.handleChange}/>
        <div className="pure-u-1-4"><button type="submit" className="pure-button pure-button-primary">+ Product</button></div>
      </form>
    )
  }

}

export default AddProduct