import React, { Component } from 'react'
import contract from 'truffle-contract'
import MarketplaceContract from '../build/contracts/Marketplace.json'
import getWeb3 from './utils/getWeb3'
import getCurrentUser, { getShortAddress } from './utils/getCurrentUser'
import NavigationBar from './components/NavigationBar'

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
        account: '',
        role: ''
      }
    }
  }

  async componentWillMount() {
    // Get web3 instance
    const web3 = await getWeb3
    
    this.setState({
      web3: web3,
    })

    this.initializeData()
  }

  async initializeData() {
    const marketplace = contract(MarketplaceContract)
    marketplace.setProvider(this.state.web3.currentProvider)
    const marketplaceInstance = await marketplace.deployed()

    const currentUser = await getCurrentUser(marketplaceInstance, this.state.web3)
    this.setState({ 
      currentUser: {
        ...currentUser,
      }
    })
  }

  render() {
    return (
      <div className="App">
        <NavigationBar user={this.state.currentUser} />

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Hi {getShortAddress(this.state.currentUser.account)} ({this.state.currentUser.role})</h1>
              <p>Ready to shop!</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
