import React, { Component } from 'react'
import $ from 'jquery'
import Product from '../models/Product'

class EditProduct extends Component {
  constructor(props) {
    super(props)

    const { marketplace, product } = this.props
    this.state = { 
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      marketplace: marketplace
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }
  
  handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const updatedProduct = await Product.updateProduct(this.state.marketplace, this.state.id, this.state.name, parseInt(this.state.price, 10), parseInt(this.state.quantity, 10))
      this.props.handleUpdate(updatedProduct)
    } catch (e) {
      alert('Error: Only Store Owner is able to edit a Product')
    }
  }

  handleDelete = async (event) => {
    event.preventDefault();
    try {
      const removedProduct = await Product.removeProduct(this.state.marketplace, this.state.id)
      this.props.handleDelete(removedProduct)
    } catch (e) {
      alert('Error: Only Store Owner is able to delete a Product')
    }
  }

  render() {
    const productKey = `edit-product-${this.state.id}`

    return (
      <div className="modal fade" id={productKey} tabIndex="-1" role="dialog" aria-labelledby={`${productKey}-label`} aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">

            <div className="modal-header">
              <h3 className="modal-title" id={`${productKey}-label`}>Edit {this.state.name}</h3>
              <button type="button" className="close no-border" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <form className="pure-form pure-form-aligned">
                <fieldset>
                  <div className="pure-control-group">
                    <label htmlFor="name">Name</label>
                    <input name="name" type="text" placeholder="Name" value={this.state.name} onChange={this.handleChange}/>
                  </div>

                  <div className="pure-control-group">
                    <label htmlFor="price">Price</label>
                    <input name="price" type="text" placeholder="Price (ETH)" value={this.state.price} onChange={this.handleChange}/>
                  </div>

                  <div className="pure-control-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input name="quantity" type="text" placeholder="Quantity" value={this.state.quantity} onChange={this.handleChange}/>
                  </div>
                </fieldset>

                <button type="submit" className="pure-button pure-button-primary hidden" id={`${productKey}-submit`} onClick={this.handleUpdate}>Save</button>
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="pure-button pure-button-primary" data-dismiss="modal" onClick={() => $(`#${productKey}-submit`).click()}>Save</button>
              <button type="button" className="pure-button pure-button-secondary" data-dismiss="modal" onClick={this.handleDelete}>Delete</button>
              <button type="button" className="pure-button pure-button-secondary" data-dismiss="modal">Close</button>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default EditProduct;