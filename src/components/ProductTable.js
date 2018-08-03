import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { NavLink } from 'react-router-dom';

const ProductTable = ({ products }) => {
	return (
		<table className="pure-table pure-table-horizontal no-border store-owner-list">
      <thead className="no-background-color">
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Price (ETH)</th>
            <th>Quantity</th>
            <th></th>
          </tr>
      </thead>

      <tbody>
      { 
        _.map(products, (product, index) => {
          return (
            <tr key={`product-${product.id}`} id={`product-${product.id}`}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td><NavLink to={`#buy-product-${product.id}`} data-toggle="modal" data-target={`#buy-product-${product.id}`}>Buy</NavLink></td>
            </tr>
          )
        })
      }
      </tbody>
    </table>
	)
}


ProductTable.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      price: PropTypes.number,
      quantity: PropTypes.number,
    })
  ),
  storefrontId: PropTypes.string
}

export default ProductTable