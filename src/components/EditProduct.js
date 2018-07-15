import React, { Component } from 'react'

class EditProduct extends Component {
  constructor(props) {
    super(props)
    this.state = { 
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
      // const newProduct = await Product.addProduct(marketplace, this.state.storefrontId, this.state.name, parseInt(this.state.price, 10), parseInt(this.state.quantity, 10))
      // this.props.handleUpdate(newProduct)
    } catch (e) {
      alert('Error: Only Store Owner is able to edit a Product')
    }
  }

  render() {
    const { product } = this.props
    const productKey = `edit-product-${product.id}`

    return (
      <div className="modal fade" id={productKey} tabIndex="-1" role="dialog" aria-labelledby={`${productKey}-label`} aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">

            <div className="modal-header">
              <h3 className="modal-title" id={`${productKey}-label`}>Edit {product.name}</h3>
              <button type="button" className="close no-border" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <form className="pure-form pure-form-aligned">
                <fieldset>
                  <div className="pure-control-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" placeholder="Name" value={product.name} onChange={this.handleChange}/>
                  </div>

                  <div className="pure-control-group">
                    <label htmlFor="price">Price</label>
                    <input id="price" type="text" placeholder="Price (ETH)" value={product.price} onChange={this.handleChange}/>
                  </div>

                  <div className="pure-control-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input id="quantity" type="text" placeholder="Quantity" value={product.quantity} onChange={this.handleChange}/>
                  </div>
                </fieldset>
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="pure-button pure-button-primary">Save</button>
              <button type="button" className="pure-button pure-button-secondary" data-dismiss="modal">Close</button>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default EditProduct;