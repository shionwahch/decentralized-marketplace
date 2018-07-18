import React from 'react'
import _ from 'lodash'
import { NavLink } from 'react-router-dom';

const StorefrontTableWithdraw = ({ storefronts }) => {
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
							<td>{storefront.wallet}</td>
							<td><NavLink to={`#withdraw-storefront-${storefront.id}`}>Withdraw</NavLink></td>
						</tr>
					)
				})
			}
			</tbody>
		</table>
	)
}

export default StorefrontTableWithdraw