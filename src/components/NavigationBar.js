import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom';
import { isAdmin, isStoreOwner, isShopper } from '../constants/role'
import { getShortAddress } from '../utils/getCurrentUser'

const NavigationBar = ({ user }) => {
  return (
    <nav className="navbar pure-menu pure-menu-horizontal">
      <NavLink exact to="/" className="pure-menu-heading pure-menu-link" activeClassName="pure-menu-link">Decentralized Marketplace</NavLink>
      <ul className="pure-menu-list">
        {isAdmin(user.role) ? (<NavLink to="/manage/store-owners" className="pure-menu-item pure-menu-link" activeClassName="pure-menu-link"><li>Manage Store Owners</li></NavLink>) : null}
        {isStoreOwner(user.role) ? (<NavLink to="/manage/storefronts" className="pure-menu-item pure-menu-link" activeClassName="pure-menu-link"><li>Manage Storefronts</li></NavLink>) : null}
        {isShopper(user.role) ? (<NavLink to="/browse/storefronts" className="pure-menu-item pure-menu-link" activeClassName="pure-menu-link"><li>Browse Storefronts</li></NavLink>) : null}
        <NavLink to="/profile" className="pure-menu-item pure-menu-link" activeClassName="pure-menu-link"><li>{getShortAddress(user.account)} ({user.role})</li></NavLink>
      </ul>
    </nav>
  )
}


NavigationBar.propTypes = {
  user: PropTypes.shape({
    account: PropTypes.string,
    role: PropTypes.string
  })
}

export default NavigationBar