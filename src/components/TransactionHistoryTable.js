import React from 'react'
import _ from 'lodash'
import { NavLink } from 'react-router-dom';
import ipfs from '../utils/getIpfs'

const TransactionHistoryTable = ({ transactions }) => {
	return (
		<table className="pure-table pure-table-horizontal no-border store-owner-list">
      <thead className="no-background-color">
          <tr>
            <th>Time</th>
            <th>Storefront</th>
            <th></th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total Cost (ETH)</th>
          </tr>
      </thead>

      <tbody>
      { 
        _.map(transactions, (transaction, index) => {
          return (
            <tr key={index}>
              <td>{transaction.timestamp}</td>
              <td><NavLink to={`browse/storefronts/${transaction.storefrontId}`}>{transaction.storefront}</NavLink></td>
              <td><img className="transaction-product-image" src={ipfs.getUrl(transaction.image)} role="presentation"/></td>
              <td>{transaction.name}</td>
              <td>{transaction.quantity}</td>
              <td>{transaction.cost}</td>
            </tr>
          )
        })
      }
      </tbody>
    </table>
	)
}

export default TransactionHistoryTable