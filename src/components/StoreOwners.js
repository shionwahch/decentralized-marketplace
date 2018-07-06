import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import AddStoreOwner from './AddStoreOwner'

const StoreOwners = ({ storeOwners }) => {
  return (
    <div className="pure-u-1-1">
      <h1>Store Owner List</h1>

      <AddStoreOwner />

      <table className="pure-table pure-table-horizontal no-border store-owner-list">
        <thead className="no-background-color">
            <tr>
              <th>#</th>
              <th>Address</th>
            </tr>
        </thead>

        <tbody>
        { 
          _.map(storeOwners, (storeOwner, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{storeOwner}</td>
              </tr>
            )
          })
        }
        </tbody>
      </table>
    </div>
  )
}

StoreOwners.propTypes = {
  storeOwners: PropTypes.arrayOf(PropTypes.string)
}

export default StoreOwners