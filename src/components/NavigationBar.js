import React from 'react'
import { Link } from 'react-router-dom';
import Role from '../constants/role'
import { getShortAddress } from '../utils/getCurrentUser'

const NavigationBar = ({ user }) => {
  return (
    <nav className="navbar pure-menu pure-menu-horizontal">
      <Link to="/"><div href="#" className="pure-menu-heading pure-menu-link">Decentralized Marketplace</div></Link>
      <ul className="pure-menu-list">
        {user.role === Role.ADMIN ? (<Link to="/store-owners"><li className="pure-menu-item pure-menu-link">Manage Store Owners</li></Link>) : null}
        {user.role === Role.STORE_OWNER ? (<Link to="/storefronts"><li className="pure-menu-item pure-menu-link">Manage Storefronts</li></Link>) : null}
        <Link to="/profile"><li className="pure-menu-item pure-menu-link">{getShortAddress(user.account)} ({user.role})</li></Link>
      </ul>
    </nav>
  )
}

export default NavigationBar