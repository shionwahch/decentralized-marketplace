import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import _ from 'lodash'
import $ from 'jquery'
import { weiToEther } from '../utils/web3Utils'
import WithdrawWallet from './WithdrawWallet'
import WithdrawWalletAll from './WithdrawWalletAll'

class StorefrontTableWithdraw extends Component {
  constructor(props) {
    super(props)

    this.handleWithdraw = this.handleWithdraw.bind(this)
    this.handleWithdrawAll = this.handleWithdrawAll.bind(this)
	}

	handleWithdraw = (storefrontId) => {
		$(`#storefront-${storefrontId}-wallet`).text(0)
	}
	
	handleWithdrawAll = () => {
		$(`td[id$='-wallet']`).text(0)
  }

	render() {
		const { marketplace, storefronts, user } = this.props

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
									<td id={`storefront-${storefront.id}-wallet`}>{weiToEther(storefront.wallet)}</td>
									<td><NavLink to={`#withdraw-storefront-${storefront.id}`} data-toggle="modal" data-target={`#withdraw-storefront-${storefront.id}`}>Withdraw</NavLink></td>
								</tr>
							)
						})
					}
					{
						storefronts.length === 0 ? null :
							(
								<tr>
									<td></td>
									<td></td>
									<td></td>
									<td><NavLink to={`#withdraw-storefront-all`} data-toggle="modal" data-target={`#withdraw-storefront-all`}>Withdraw All</NavLink></td>
								</tr>
							)
					}
					</tbody>
				</table>
				{
					_.map(storefronts, storefront => <WithdrawWallet key={"withdraw-storefront-"+storefront.id} marketplace={marketplace} storefront={storefront} handleWithdraw={this.handleWithdraw} />)
				}
				<WithdrawWalletAll key={"withdraw-storefront-all"} marketplace={marketplace} user={user} storefronts={storefronts} handleWithdrawAll={this.handleWithdrawAll} />
			</div>
		)
	}

}

export default StorefrontTableWithdraw