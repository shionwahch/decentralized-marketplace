import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'
import Web3 from 'web3'
import WithdrawWallet from './WithdrawWallet'

class StorefrontTableWithdraw extends Component {
  constructor(props) {
    super(props)

    this.handleWithdraw = this.handleWithdraw.bind(this)
	}

	handleWithdraw = (storefrontId) => {
		event.preventDefault();
		console.log('withdrew from', storefrontId, 'set wallet to 0')
  }

	render() {
		const { marketplace, storefronts } = this.props

		return (
			<div className="pure-u-1-1">
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
									<td><NavLink to={`#withdraw-storefront-${storefront.id}`} data-toggle="modal" data-target={`#withdraw-storefront-${storefront.id}`}>Withdraw</NavLink></td>
									{/* <td><NavLink to={`#withdraw-storefront-${storefront.id}`} data-toggle="modal" data-target={`#withdraw-storefront-${storefront.id}`} onClick={(event) => this.handleWithdraw(event, marketplace, storefront.id)}>Withdraw</NavLink></td> */}
								</tr>
							)
						})
					}
					</tbody>
				</table>
				{
					_.map(storefronts, storefront => <WithdrawWallet key={"withdraw-storefront-"+storefront.id} marketplace={marketplace} storefront={storefront} handleWithdraw={this.handleWithdraw} />)
				}
			</div>
		)
	}

}

export default StorefrontTableWithdraw