import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import BuyProductCard from './BuyProductCard'

const ProductTable = ({ products }) => {
	return (
    <div className="pure-u-1-1">
    { 
      _.map(products, product => {
          return <BuyProductCard key={"product-card-"+product.id} product={product} />
      })
    }
    </div>
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