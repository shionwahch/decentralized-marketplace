import React from 'react'
import { getAddress } from '../constants/blockExplorer'

const Footer = () => {
  return (
    <nav className="navbar pure-menu pure-menu-horizontal footer">
      <ul className="pure-menu-list navbar-right">
        <a href={getAddress(process.env.REACT_APP_DEPLOYED_ADDRESS)} target="_blank">Deployed on Rinkeby</a>
      </ul>
    </nav>
  )
}


export default Footer