import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import blockies from 'blockies'
import { getShortAddress } from '../utils/getCurrentUser'
import { isAdmin, isStoreOwner, isShopper } from '../constants/role'

const NavigationBar = ({ user }) => {
  const icon = blockies({
    seed: user.account,
    bgcolor: '#fff',
  })

  return (
    <nav className="navbar pure-menu pure-menu-horizontal">
      <NavLink exact to="/" className="pure-menu-heading pure-menu-link" activeClassName="pure-menu-link">Marketplace</NavLink>
      <ul className="pure-menu-list">
        { isAdmin(user.role) ? (<NavLink to="/manage/store-owners" className="pure-menu-item pure-menu-link" activeClassName="pure-menu-link"><li>Manage Store Owners</li></NavLink>) : null }
        { isStoreOwner(user.role) ? (<NavLink to="/manage/storefronts" className="pure-menu-item pure-menu-link" activeClassName="pure-menu-link"><li>Manage Storefronts</li></NavLink>) : null }
        { isShopper(user.role) ? (<NavLink to="/browse/storefronts" className="pure-menu-item pure-menu-link" activeClassName="pure-menu-link"><li>Browse Storefronts</li></NavLink>) : null }
        { isShopper(user.role) ? (<NavLink to="#become-seller" className="pure-menu-item pure-menu-link" activeClassName="pure-menu-link" data-toggle="modal" data-target="#become-store-owner"><li>How to Sell?</li></NavLink>) : null }
      </ul>
      <ul className="pure-menu-list navbar-right">
        <NavLink to="/profile" className="pure-menu-item pure-menu-link" activeClassName="pure-menu-link">
          <img className="profile-icon" src={icon.toDataURL()} alt="profile-icon"/>
          Hi{ user.account ? `, ${getShortAddress(user.account)}` : ' there!'}
        </NavLink>
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