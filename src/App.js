import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import contract from 'truffle-contract'
import MarketplaceContract from '../build/contracts/Marketplace.json'
import getWeb3 from './utils/getWeb3'
import getCurrentUser from './utils/getCurrentUser'
import NavigationBar from './components/NavigationBar'
import Home from './components/Home'
import StoreOwners from './components/StoreOwners'
import listStoreOwners from './utils/listStoreOwners'

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
      },
      storeOwners: []
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
    const storeOwners = await listStoreOwners(marketplaceInstance)
    this.setState({ 
      currentUser: {
        ...currentUser,
      },
      storeOwners: storeOwners
    })
  }

  render() {
    return (
      <div className="App">
        <NavigationBar user={this.state.currentUser} />

        <main className="container">
          <div className="pure-g">
            <Route path="/" exact render={() => <Home user={this.state.currentUser}/>} />
            <Route path="/store-owners" render={() => <StoreOwners storeOwners={this.state.storeOwners}/>} />
            <Route path="/profile" render={() => <div className="pure-u-1-1"><h1>My Profile</h1></div>} />
          </div>
        </main>
      </div>
    );
  }
}

export default App
