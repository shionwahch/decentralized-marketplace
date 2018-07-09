import React, { Component } from 'react'

class AddProduct extends Component {
  constructor(props) {
    super(props)

    this.state = { 
      name: '',
      price: 0,
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
      // await Storefront.addStorefront(marketplace, this.state.name)
      // this.props.handleUpdate(new Storefront(this.state.name))
    } catch (e) {
      alert('Error: Only Store Owner is able to add a Product')
    }
  }

  render() {
    const { marketplace } = this.props

    return (
      <form className="pure-form pure-g add-form" onSubmit={(event) => this.handleSubmit(event, marketplace)}>
        <input className="pure-u-1-2" type="text" name="name" placeholder="Product name" value={this.state.name} onChange={this.handleChange}/>
        <input className="pure-u-1-4" type="text" name="price" placeholder="Product price (ETH)" value={this.state.price} onChange={this.handleChange}/>
        <div className="pure-u-1-4"><button type="submit" className="pure-button pure-button-primary">+ Product</button></div>
      </form>
    )
  }

}

export default AddProduct