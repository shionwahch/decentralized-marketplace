import React, { Component } from 'react'
import MarketplaceContract from '../build/contracts/Marketplace.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      currentUser: {
        account: null,
        role: null
      }
    }
  }

  componentWillMount() {
    // Get network provider, web3 instance and current active account
    getWeb3.then(results => {
      this.setState({
        web3: results.web3,
      })

      // Instantiate contract once web3 provided.
      this.getCurrentUser()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  async getCurrentUser() {
    const contract = require('truffle-contract')
    const marketplace = contract(MarketplaceContract)
    marketplace.setProvider(this.state.web3.currentProvider)

    const marketplaceInstance = await marketplace.deployed()
    const ownerAccount = await marketplaceInstance.owner.call()
    const role = this.state.currentUser.account === ownerAccount ? 'Admin' : 'Shopper'

    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({ 
        currentUser: {
          ...this.state.currentUser,
          account: accounts[0],
          role: role
        }
      })      
    });
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Decentralized Marketplace</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Hi {this.state.currentUser.account ? this.state.currentUser.account.substr(0,6) : 'User'} ({this.state.currentUser.role})</h1>
              <p>Ready to shop!</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
