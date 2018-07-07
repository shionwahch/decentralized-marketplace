import React from 'react'
import { NavLink } from 'react-router-dom';
import Role from '../constants/role'
import { getShortAddress } from '../utils/getCurrentUser'

const NavigationBar = ({ user }) => {
  return (
    <nav className="navbar pure-menu pure-menu-horizontal">
      <NavLink exact to="/" className="pure-menu-heading pure-menu-link" activeClassName="pure-menu-link">Decentralized Marketplace</NavLink>
      <ul className="pure-menu-list">
        {user.role === Role.ADMIN ? (<NavLink to="/store-owners" className="pure-menu-item pure-menu-link" activeClassName="pure-menu-link"><li>Manage Store Owners</li></NavLink>) : null}
        {user.role === Role.STORE_OWNER ? (<NavLink to="/storefronts" className="pure-menu-item pure-menu-link" activeClassName="pure-menu-link"><li>Manage Storefronts</li></NavLink>) : null}
        {user.role === Role.SHOPPER ? (<NavLink to="/browse" className="pure-menu-item pure-menu-link" activeClassName="pure-menu-link"><li>Browse Storefronts</li></NavLink>) : null}
        <NavLink to="/profile" className="pure-menu-item pure-menu-link" activeClassName="pure-menu-link"><li>{getShortAddress(user.account)} ({user.role})</li></NavLink>
      </ul>
    </nav>
  )
}

export default NavigationBar