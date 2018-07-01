import React, { Component } from 'react'
import contract from 'truffle-contract'
import MarketplaceContract from '../build/contracts/Marketplace.json'
import getWeb3 from './utils/getWeb3'
import getWeb3Accounts from './utils/getWeb3Accounts'
import { Role } from './constants/role'

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

  async componentWillMount() {
    // Get web3 instance
    const web3 = await getWeb3
    
    this.setState({
      web3: web3,
    })

    this.getCurrentUser()
  }

  async getCurrentUser() {
    const marketplace = contract(MarketplaceContract)
    marketplace.setProvider(this.state.web3.currentProvider)

    const marketplaceInstance = await marketplace.deployed()
    const ownerAccount = await marketplaceInstance.owner.call()
    
    const accounts = await getWeb3Accounts(this.state.web3)
    const currentAccount = accounts[0]
    const role = currentAccount === ownerAccount ? Role.ADMIN : Role.SHOPPER

    this.setState({ 
      currentUser: {
        ...this.state.currentUser,
        account: currentAccount,
        role: role
      }
    })
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
