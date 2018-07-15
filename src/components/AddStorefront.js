import React, { Component } from 'react'
import Storefront from '../models/Storefront'

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
      const newStorefront = await Storefront.addStorefront(marketplace, this.state.name)
      this.props.handleUpdate(newStorefront)
    } catch (e) {
      alert('Error: Only Store Owner is able to add a Storefront')
    }
  }

  render() {
    const { marketplace } = this.props

    return (
      <form className="pure-form add-form" onSubmit={(event) => this.handleSubmit(event, marketplace)}>
        <input className="pure-u-3-4" type="text" placeholder="Storefront name" value={this.state.name} onChange={this.handleChange}/>
        <div className="pure-u-1-4"><button type="submit" className="pure-button pure-button-primary">+ Storefont</button></div>
      </form>
    )
  }

}

export default AddStorefront