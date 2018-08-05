import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import getWeb3 from './utils/getWeb3'
import getCurrentUser from './utils/getCurrentUser'
import getMarketplace from './utils/getMarketplace'
import NavigationBar from './components/NavigationBar'
import Home from './components/Home'
import ManageStoreOwners from './components/StoreOwners'
import ManageStorefronts from './components/ManageStorefronts'
import ManageProducts from './components/ManageProducts'
import Storefronts from './components/Storefronts'
import Products from './components/Products'
import Profile from './components/Profile'
import { isAdmin, isStoreOwner } from './constants/role'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './css/grids-responsive-min.css'
import './App.css'
import './css/modal.css'
import 'jquery/dist/jquery.min'
import 'bootstrap/dist/js/bootstrap.min';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      currentUser: {
        account: '',
        role: ''
      },
    }
  }

  async componentWillMount() {
    // Get web3 instance
    const web3 = await getWeb3
    
    this.setState({ web3: web3 })
    this.initializeData()
  }

  async initializeData() {
    const marketplaceInstance = await getMarketplace(this.state.web3)

    const currentUser = await getCurrentUser(marketplaceInstance, this.state.web3)
    this.setState({ currentUser: currentUser })
  }

  render() {
    return (
      <div className="App">
        <NavigationBar user={this.state.currentUser} />

        <main className="container">
          <div className="pure-g">
            <Route path="/" exact render={() => <Home user={this.state.currentUser}/>} />
            <Route path="/manage/store-owners" render={() => isAdmin(this.state.currentUser.role) ? <ManageStoreOwners /> : <Redirect to="/" />} />
            <Route path="/manage/storefronts" exact render={() => isStoreOwner(this.state.currentUser.role) ? <ManageStorefronts user={this.state.currentUser}/> : <Redirect to="/" />} />
            <Route path="/manage/storefronts/:id(\d+)" render={() => isStoreOwner(this.state.currentUser.role) ? <ManageProducts /> : <Redirect to="/" />} />
            <Route path="/browse/storefronts" exact render={() => <Storefronts />} />
            <Route path="/browse/storefronts/:id(\d+)" render={() => <Products />} />
            <Route path="/profile" render={() => <Profile />} />
          </div>
        </main>
      </div>
    );
  }
}

export default App
