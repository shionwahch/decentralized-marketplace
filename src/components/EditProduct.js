
import React from 'react'

const EditProduct = ({ product }) => {
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
                  <input id="name" type="text" value={product.name} placeholder="Name"/>
                </div>
                <div className="pure-control-group">
                  <label htmlFor="price">Price</label>
                  <input id="price" type="text" value={product.price} placeholder="Price (ETH)"/>
                </div>
                <div className="pure-control-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input id="quantity" type="text" value={product.quantity} placeholder="Quantity"/>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="pure-button pure-button-secondary" data-dismiss="modal">Close</button>
            <button type="button" className="pure-button pure-button-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProduct;