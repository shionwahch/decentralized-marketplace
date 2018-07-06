import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import contract from 'truffle-contract'
import MarketplaceContract from '../../build/contracts/Marketplace.json'
import getWeb3 from '../utils/getWeb3'
import listStoreOwners from '../utils/listStoreOwners'
import AddStoreOwner from './AddStoreOwner'

class StoreOwners extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      storeOwners: []
    }
  }

  async componentWillMount() {
    const web3 = await getWeb3
    
    this.setState({ web3: web3 })
    this.initializeData()
  }

  async initializeData() {
    const marketplace = contract(MarketplaceContract)
    marketplace.setProvider(this.state.web3.currentProvider)
    const marketplaceInstance = await marketplace.deployed()

    const storeOwners = await listStoreOwners(marketplaceInstance)
    this.setState({ storeOwners: storeOwners })
  }

  render() {
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
            _.map(this.state.storeOwners, (storeOwner, index) => {
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

}


StoreOwners.propTypes = {
  storeOwners: PropTypes.arrayOf(PropTypes.string)
}

export default StoreOwners