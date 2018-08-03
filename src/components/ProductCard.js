import React from 'react'
import { NavLink } from 'react-router-dom';
import ipfs from '../utils/getIpfs'

const ProductCard = ({ product }) => {
  const storefrontPageLink = `/browse/storefronts/${product.storefrontId}`
  const productPageLink = `${storefrontPageLink}#product-${product.id}`

  return (
    <div className="card pure-u-1 pure-u-md-1-3">
      <div className="card-image">
        <a href={productPageLink}><img src={ipfs.getUrl(product.image)} role="presentation" /></a>
      </div>
      <div className="card-body">
        <NavLink className="card-title" to={productPageLink}>{product.name}</NavLink>
        <p className="card-price">{product.price} Ξ</p>
        <NavLink className="card-storefront" to={storefrontPageLink}>{product.storefront.name}</NavLink>
      </div>
    </div>
  )
}

export default ProductCard