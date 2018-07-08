import React, { Component } from 'react'
import StoreOwner from '../models/StoreOwner'

class AddStorefront extends Component {
  constructor(props) {
    super(props)

    this.state = { name: '' }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange = (event) => {
    this.setState({ name: event.target.value })
  }
  
  handleSubmit = async (event, marketplace) => {
    event.preventDefault();
    try {
      await StoreOwner.addStorefront(marketplace, this.state.name)
      this.props.handleUpdate(this.state.name)
    } catch (e) {
      alert('Error: Only Store Owner is able to add a Storefront')
    }
  }

  render() {
    const { marketplace } = this.props

    return (
      <form className="pure-form" onSubmit={(event) => this.handleSubmit(event, marketplace)}>
        <input type="text" placeholder="Storefront name" value={this.state.name} onChange={this.handleChange}/>
        <button type="submit" className="pure-button pure-button-primary">+ Storefont</button>
      </form>
    )
  }


}

export default AddStorefront