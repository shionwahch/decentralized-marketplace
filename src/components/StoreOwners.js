import React from 'react'
import PropTypes from 'prop-types';

const StoreOwners = ({ storeOwners }) => {
  return (
    <div className="pure-u-1-1">
      <h1>Store Owner List</h1>
      {storeOwners.map(storeOwner => <div key={`so-${storeOwner}`} className="pure-u-1-1">{storeOwner}</div>)}
    </div>
  )
}

StoreOwners.propTypes = {
  storeOwners: PropTypes.arrayOf(PropTypes.string)
}

export default StoreOwners