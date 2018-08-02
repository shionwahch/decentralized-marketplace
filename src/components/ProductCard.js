import React from 'react'
import ipfs from '../utils/getIpfs'

const ProductCard = ({ product }) => {
  return (
    <div className="pure-u-1 pure-u-md-1-3">
      <div className="product-image">
        <img src={ipfs.getUrl(product.image)} role="presentation" />
      </div>
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.name}</p>
        <a href="#" className="btn btn-primary">Visit Shop!</a>
      </div>
    </div>
  )
}

export default ProductCard