import React, { Component } from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import Product from '../models/Product'

class BuyProduct extends Component {
  constructor(props) {
    super(props)

    const { marketplace, product } = this.props
    this.state = { 
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      marketplace: marketplace,
      addedQuantity: 1,
      totalCost: product.price * 1
    }

    this.handleChange = this.handleChange.bind(this)
    this.handlePurchase = this.handlePurchase.bind(this)
  }

  handleChange = (event) => {
    this.setState({ 
      addedQuantity: event.target.value,
      totalCost: this.calculateTotalPrice(this.state.price, event.target.value)
    })
  }
  
  handlePurchase = async (event) => {
    event.preventDefault();
    try {
      const purchasedProduct = await Product.purchaseProduct(this.state.marketplace, this.state.id, parseInt(this.state.addedQuantity, 10), this.state.totalCost)
      this.props.handlePurchase(purchasedProduct)
    } catch (e) {
      alert('Error: Please check if you have enough ETH to purchase the Product')
    }
  }

  calculateTotalPrice = (price, quantity) => {
    return Number((price * quantity).toFixed(12))
  }

  render() {
    const productKey = `buy-product-${this.state.id}`

    return (
      <div className="modal fade" id={productKey} tabIndex="-1" role="dialog" aria-labelledby={`${productKey}-label`} aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">

            <div className="modal-header">
              <h3 className="modal-title" id={`${productKey}-label`}>{this.state.name}</h3>
              <button type="button" className="close no-border" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <form className="pure-form pure-form-aligned">
                <fieldset>
                  <div className="pure-control-group">
                    <label htmlFor="name">Name</label>
                    {this.state.name}
                  </div>

                  <div className="pure-control-group">
                    <label htmlFor="price">Price</label>
                    {this.state.price} ETH
                  </div>

                  <div className="pure-control-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input name="quantity" type="number" min="1" max={this.state.quantity} placeholder="Quantity" defaultValue="1" onChange={this.handleChange}/>
                  </div>

                  <div className="pure-control-group">
                    <label htmlFor="total-cost">Total Cost</label>
                    { this.state.addedQuantity === 0 ? this.state.price * 1 : this.calculateTotalPrice(this.state.price, this.state.addedQuantity)} ETH
                  </div>
                </fieldset>

                <button type="submit" className="pure-button pure-button-primary hidden" id={`${productKey}-submit`} onClick={this.handlePurchase}>Buy</button>
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="pure-button pure-button-primary" data-dismiss="modal" onClick={() => $(`#${productKey}-submit`).click()}>Buy</button>
              <button type="button" className="pure-button pure-button-secondary" data-dismiss="modal">Close</button>
            </div>

          </div>
        </div>
      </div>
    )
  }

}


BuyProduct.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  price: PropTypes.number,
  quantity: PropTypes.number,
}

export default BuyProduct;