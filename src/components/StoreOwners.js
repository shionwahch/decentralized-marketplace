import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import getWeb3 from '../utils/getWeb3'
import getMarketplace from '../utils/getMarketplace'
import StoreOwner from '../models/StoreOwner'
import AddStoreOwner from './AddStoreOwner'
import { getAddress } from '../constants/blockExplorer'

class ManageStoreOwners extends Component {
  constructor(props) {
    super(props)

    this.handleUpdate = this.handleUpdate.bind(this)

    this.state = {
      web3: null,
      storeOwners: [],
      marketplace: null
    }
  }

  async componentWillMount() {
    const web3 = await getWeb3
    
    this.setState({ web3: web3 })
    this.initializeData()
  }

  async initializeData() {
    const marketplaceInstance = await getMarketplace(this.state.web3)

    const storeOwners = await StoreOwner.listStoreOwners(marketplaceInstance)
    this.setState({ 
      storeOwners: storeOwners,
      marketplace: marketplaceInstance
    })
  }

  handleUpdate(newAddress) {
    this.setState({ storeOwners: this.state.storeOwners.concat([newAddress]) })
  }

  render() {
    return (
      <div className="pure-u-1-1">
        <h1>Store Owner List</h1>
  
        <AddStoreOwner marketplace={this.state.marketplace} handleUpdate={this.handleUpdate}/>
  
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
                  <td><a href={getAddress(storeOwner.owner)} target="_blank">{storeOwner.owner}</a></td>
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


ManageStoreOwners.propTypes = {
  storeOwners: PropTypes.shape({
    owner: PropTypes.string,
    storefronts: PropTypes.arrayOf(PropTypes.number)
  })
}

export default ManageStoreOwners