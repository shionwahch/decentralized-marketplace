import React, { Component } from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import _ from 'lodash'
import Product from '../models/Product'
import { etherToWei } from '../utils/web3Utils'
import getWeb3ErrorMessage from '../utils/getWeb3ErrorMessage'
import ipfs from '../utils/getIpfs'

class EditProduct extends Component {
  constructor(props) {
    super(props)

    const { marketplace, product } = this.props
    this.state = { 
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      image: product.image,
      marketplace: marketplace
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleImageChange = this.handleImageChange.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleImageChange = (event) => {
    const files = event.target.files
    if (files && _.head(files)) {
      this.previewImage(_.head(files))
      this.uploadImage(_.head(files))
    }
  }

  previewImage(imageFile) {
    this.setState({ image: imageFile })
    const productKey = `edit-product-${this.state.id}`

    const reader = new FileReader();
    reader.onload = (e) => $(`#${productKey}-image`).attr('src', e.target.result);
    reader.readAsDataURL(imageFile);
  }

  uploadImage(imageFile) {
    const productKey = `edit-product-${this.state.id}`
    $(`#${productKey}-save`).addClass('pure-button-disabled')
    $(`#${productKey}-upload-status`).text('Uploading product image to IPFS...')

    const reader = new FileReader();
    reader.readAsArrayBuffer(imageFile)
    reader.onloadend = async () => {
      const buffer = await Buffer.from(reader.result);
      const ipfsHash = await ipfs.addSync(buffer)
      this.setState({ image: _.head(ipfsHash).hash })

      $(`#${productKey}-save`).removeClass('pure-button-disabled')
      $(`#${productKey}-upload-status`).text('Uploading complete')
    }
  }
  
  handleUpdate = async (event) => {
    event.preventDefault();

    if (this.state.name === '' || Number(this.state.price) <= 0 || Number(this.state.quantity) <= 0) {
      alert('The product must have a name. \nPrice and quantity must be greater than 0')
      return
    }

    try {
      const updatedProduct = await Product.updateProduct(this.state.marketplace, this.state.id, this.state.name, etherToWei(this.state.price), parseInt(this.state.quantity, 10), this.state.image)
      this.props.handleUpdate(updatedProduct)
    } catch (e) {
      alert(getWeb3ErrorMessage(e))
    }
  }

  handleDelete = async (event) => {
    event.preventDefault();
    try {
      const removedProduct = await Product.removeProduct(this.state.marketplace, this.state.id)
      this.props.handleDelete(removedProduct)
    } catch (e) {
      alert(getWeb3ErrorMessage(e))
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
                  <div className="pure-control-group product-image" onClick={() => $(`#${productKey}-image-input`).click()}>
                    {
                      this.state.image !== '' ?
                        <img name={`${productKey}-image`} id={`${productKey}-image`} role="presentation" src={ipfs.getUrl(this.state.image)} /> :
                        <div>+ Upload Product Image</div>
                    }
                    <input name={`${productKey}-image-input`} id={`${productKey}-image-input`} type="file" className="hidden" onChange={this.handleImageChange}/>
                  </div>

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
              <div className="product-upload-status" id={`${productKey}-upload-status`}></div>
              <button type="button" className="pure-button pure-button-primary" id={`${productKey}-save`} data-dismiss="modal" onClick={() => $(`#${productKey}-submit`).click()}>Save</button>
              <button type="button" className="pure-button pure-button-secondary" data-dismiss="modal" onClick={this.handleDelete}>Delete</button>
              <button type="button" className="pure-button pure-button-secondary" data-dismiss="modal">Close</button>
            </div>

          </div>
        </div>
      </div>
    )
  }

}


EditProduct.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  price: PropTypes.number,
  quantity: PropTypes.number,
}

export default EditProduct;