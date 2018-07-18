import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'
import Web3 from 'web3'
import Storefront from '../models/Storefront'

class StorefrontTableWithdraw extends Component {
  constructor(props) {
    super(props)

    this.handleWithdraw = this.handleWithdraw.bind(this)
	}

	handleWithdraw = async (event, marketplace, storefrontId) => {
		event.preventDefault();
		console.log('withdrawing from', storefrontId)
    try {
      const amount = await Storefront.withdrawFromStorefront(marketplace, storefrontId)
      // this.props.handleUpdate(newStorefront)
    } catch (e) {
      alert('Error: Only Store Owner is able to withdraw from their Storefront')
    }
  }

	render() {
		const { marketplace, storefronts } = this.props

		return (
			<table className="pure-table pure-table-horizontal no-border store-owner-list">
				<thead className="no-background-color">
					<tr>
						<th>#</th>
						<th>Storefronts</th>
						<th>Wallet (ETH)</th>
						<th></th>
					</tr>
				</thead>
				
				<tbody>
				{ 
					_.map(storefronts, (storefront, index) => {
						return (
							<tr key={index}>
								<td>{index + 1}</td>
								<td><NavLink to={`storefronts/${storefront.id}`}>{storefront.name}</NavLink></td>
								<td>{(new Web3()).fromWei(storefront.wallet, 'ether')}</td>
								<td><NavLink to={`#withdraw-storefront-${storefront.id}`} onClick={(event) => this.handleWithdraw(event, marketplace, storefront.id)}>Withdraw</NavLink></td>
							</tr>
						)
					})
				}
				</tbody>
			</table>
		)
	}

}

export default StorefrontTableWithdraw