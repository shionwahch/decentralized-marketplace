import React from 'react'
import Role from '../constants/role'
import { getShortAddress } from '../utils/getCurrentUser'

const NavigationBar = ({ user }) => {
  return (
    <nav className="navbar pure-menu pure-menu-horizontal">
      <a href="#" className="pure-menu-heading pure-menu-link">Decentralized Marketplace</a>
      <ul className="pure-menu-list">
        <li className="pure-menu-item"><a href="#" className="pure-menu-link">{getShortAddress(user.account)} ({user.role})</a></li>
      </ul>
    </nav>
  )
}

export default NavigationBar