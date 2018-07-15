
import React from 'react'

const EditProduct = ({ product }) => {
  return (
    <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title" id="exampleModalLabel">Edit {product.name}</h3>
            <button type="button" className="close no-border" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form className="pure-form pure-form-aligned">
              <fieldset>
                <div className="pure-control-group">
                  <label for="name">Name</label>
                  <input id="name" type="text" placeholder="Name"/>
                </div>
                <div className="pure-control-group">
                  <label for="price">Price</label>
                  <input id="price" type="text" placeholder="Price (ETH)"/>
                </div>
                <div className="pure-control-group">
                  <label for="quantity">Quantity</label>
                  <input id="quantity" type="text" placeholder="Quantity"/>
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