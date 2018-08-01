import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import $ from 'jquery'
import { weiToEther } from '../utils/web3Utils'
import Storefront from '../models/Storefront'
import getWeb3ErrorMessage from '../utils/getWeb3ErrorMessage'

class WithdrawWalletAll extends Component {
  constructor(props) {
    super(props)

    this.handleWithdrawAll = this.handleWithdrawAll.bind(this)
  }

  handleWithdrawAll = async (event, marketplace) => {
    event.preventDefault();
    try {
      await Storefront.withdrawFromAllStorefronts(marketplace)
      this.props.handleWithdrawAll()
    } catch (e) {
      alert(getWeb3ErrorMessage(e))
    }
  }

  render() {
    const storefrontKey = `withdraw-storefront-all`
    const { marketplace, user, storefronts } = this.props
    const walletTotal = _.reduce(_.map(storefronts, s => s.wallet), (sum, wallet) => sum + wallet, 0)
    const walletDisplay = weiToEther(walletTotal)

    return (
      <div className="modal fade" id={storefrontKey} tabIndex="-1" role="dialog" aria-labelledby={`${storefrontKey}-label`} aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">

            <div className="modal-header">
              <h3 className="modal-title" id={`${storefrontKey}-label`}>Withdraw from all Storefronts</h3>
              <button type="button" className="close no-border" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <form className="pure-form pure-form-aligned">
                <fieldset>
                  <div className="pure-control-group">
                    <label htmlFor="price">Wallet Total</label>
                    {walletDisplay} ETH
                  </div>

                  <div className="pure-control-group">
                    <label htmlFor="withdraw-to">Withdraw To</label>
                    <span className="withdraw-wallet">{user ? user.account : null}</span>
                  </div>
                </fieldset>

                <button type="submit" className="pure-button pure-button-primary hidden" id={`${storefrontKey}-submit`} onClick={(event) => this.handleWithdrawAll(event, marketplace)}>Withdraw</button>
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="pure-button pure-button-primary" data-dismiss="modal" onClick={() => $(`#${storefrontKey}-submit`).click()}>Withdraw ({walletDisplay} ETH)</button>
              <button type="button" className="pure-button pure-button-secondary" data-dismiss="modal">Close</button>
            </div>

          </div>
        </div>
      </div>
    )
  }

}


WithdrawWalletAll.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  price: PropTypes.number,
  quantity: PropTypes.number,
}

export default WithdrawWalletAll;