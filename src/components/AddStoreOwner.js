import React, { Component } from 'react'

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
  
  handleSubmit = (event) => {
    event.preventDefault();
    alert(this.state.address)
  }

  render() {
    return (
      <form className="pure-form" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Store Owner address" value={this.state.address} onChange={this.handleChange}/>
        <button type="submit" className="pure-button pure-button-primary">+ Store Owner</button>
      </form>
    )
  }


}

export default AddStoreOwner