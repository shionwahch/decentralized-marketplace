import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Storefront from '../models/Storefront'
import getWeb3ErrorMessage from '../utils/getWeb3ErrorMessage'

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

    if (this.state.name === '') {
      alert('The storefront must have a name.')
      return
    }

    try {
      const newStorefront = await Storefront.addStorefront(marketplace, this.state.name)
      this.props.handleUpdate(newStorefront)
    } catch (e) {
      alert(getWeb3ErrorMessage(e))
    }
  }

  render() {
    const { marketplace } = this.props

    return (
      <form className="pure-form add-form" onSubmit={(event) => this.handleSubmit(event, marketplace)}>
        <input className="pure-u-3-4" type="text" placeholder="Storefront name" value={this.state.name} onChange={this.handleChange}/>
        <div className="pure-u-1-4"><button type="submit" className="pure-button pure-button-primary">+ Storefront</button></div>
      </form>
    )
  }

}


AddStorefront.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
}

export default AddStorefront