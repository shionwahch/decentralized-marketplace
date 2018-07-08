import React, { Component } from 'react'
import StoreOwner from '../models/StoreOwner'

class AddStoreOwner extends Component {
  constructor(props) {
    super(props)

    this.state = { address: '' }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange = (event) => {
    this.setState({ address: event.target.value })
  }
  
  handleSubmit = async (event, marketplace) => {
    event.preventDefault();
    try {
      await StoreOwner.addStoreOwner(marketplace, this.state.address)
      this.props.handleUpdate(new StoreOwner(this.state.address))
    } catch (e) {
      alert('Error: Duplicated or invalid store owner address')
    }
  }

  render() {
    const { marketplace } = this.props

    return (
      <form className="pure-form" onSubmit={(event) => this.handleSubmit(event, marketplace)}>
        <input type="text" placeholder="Store Owner address" value={this.state.address} onChange={this.handleChange}/>
        <button type="submit" className="pure-button pure-button-primary">+ Store Owner</button>
      </form>
    )
  }


}

export default AddStoreOwner