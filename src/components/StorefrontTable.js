import React from 'react'
import _ from 'lodash'
import { NavLink } from 'react-router-dom';

const StorefrontTable = ({ storefronts }) => {
	return (
		<table className="pure-table pure-table-horizontal no-border store-owner-list">
			<thead className="no-background-color">
				<tr>
					<th>#</th>
					<th>Storefronts</th>
				</tr>
			</thead>
			
			<tbody>
			{ 
				_.map(storefronts, (storefront, index) => {
					return (
						<tr key={index}>
							<td>{index + 1}</td>
							<td><NavLink to={`storefronts/${storefront.id}`}>{storefront.name}</NavLink></td>
						</tr>
					)
				})
			}
			</tbody>
		</table>
	)
}

export default StorefrontTable