import React, { Component } from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import { weiToEther } from '../utils/web3Utils'
import StoreOwner from '../models/StoreOwner'
import Storefront from '../models/Storefront'
import getWeb3ErrorMessage from '../utils/getWeb3ErrorMessage'

class WithdrawWallet extends Component {
  constructor(props) {
    super(props)
    const { marketplace, storefront } = this.props
    this.state = { 
      id: storefront.id,
      name: storefront.name,
      products: storefront.products,
      wallet: weiToEther(storefront.wallet),
      storeOwner: null,
      storeOwnerId: storefront.storeOwnerId,
      marketplace: marketplace
    }

    this.handleWithdraw = this.handleWithdraw.bind(this)
  }

  async componentWillMount() {
    this.initializeData()
  }

  async initializeData() {
    const storeOwner = await StoreOwner.getById(this.state.marketplace, this.state.storeOwnerId)
    this.setState({ 
      storeOwner: storeOwner
    })
  }
  
  handleWithdraw = async (event) => {
    event.preventDefault();
    try {
      await Storefront.withdrawFromStorefront(this.state.marketplace, this.state.id)
      this.props.handleWithdraw(this.state.id)
    } catch (e) {
      alert(getWeb3ErrorMessage(e))
    }
  }

  render() {
    const storefrontKey = `withdraw-storefront-${this.state.id}`
    const storeOwnerAddress = this.state.storeOwner ? this.state.storeOwner.owner : null

    return (
      <div className="modal fade" id={storefrontKey} tabIndex="-1" role="dialog" aria-labelledby={`${storefrontKey}-label`} aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">

            <div className="modal-header">
              <h3 className="modal-title" id={`${storefrontKey}-label`}>Withdraw from Storefront</h3>
              <button type="button" className="close no-border" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <form className="pure-form pure-form-aligned">
                <fieldset>
                  <div className="pure-control-group">
                    <label htmlFor="name">Name</label>
                    {this.state.name}
                  </div>

                  <div className="pure-control-group">
                    <label htmlFor="price">Wallet</label>
                    {this.state.wallet} ETH
                  </div>

                  <div className="pure-control-group">
                    <label htmlFor="withdraw-to">Withdraw To</label>
                    <span className="withdraw-wallet">{storeOwnerAddress}</span>
                  </div>
                </fieldset>

                <button type="submit" className="pure-button pure-button-primary hidden" id={`${storefrontKey}-submit`} onClick={this.handleWithdraw}>Withdraw</button>
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="pure-button pure-button-primary" data-dismiss="modal" onClick={() => $(`#${storefrontKey}-submit`).click()}>Withdraw ({this.state.wallet} ETH)</button>
              <button type="button" className="pure-button pure-button-secondary" data-dismiss="modal">Close</button>
            </div>

          </div>
        </div>
      </div>
    )
  }

}


WithdrawWallet.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  price: PropTypes.number,
  quantity: PropTypes.number,
}

export default WithdrawWallet;