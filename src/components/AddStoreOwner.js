import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StoreOwner from '../models/StoreOwner'
import getWeb3ErrorMessage from '../utils/getWeb3ErrorMessage'
import getWeb3 from '../utils/getWeb3'

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

    if (!(await getWeb3).isAddress(this.state.address)) {
      alert('The store owner address is invalid.')
      return
    }

    try {
      await StoreOwner.addStoreOwner(marketplace, this.state.address)
      this.props.handleUpdate(new StoreOwner(this.state.address))
    } catch (e) {
      alert(getWeb3ErrorMessage(e))
    }
  }

  render() {
    const { marketplace } = this.props

    return (
      <form className="pure-form add-form" onSubmit={(event) => this.handleSubmit(event, marketplace)}>
        <input className="pure-u-3-4" type="text" placeholder="Store Owner address" value={this.state.address} onChange={this.handleChange}/>
        <div className="pure-u-1-4"><button className="pure-button pure-button-primary" type="submit">+ Store Owner</button></div>
      </form>
    )
  }

}


AddStoreOwner.propTypes = {
  address: PropTypes.string
}

export default AddStoreOwner