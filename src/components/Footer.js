import React from 'react'

const Footer = () => {
  return (
    <nav className="navbar pure-menu pure-menu-horizontal footer">
      <ul className="pure-menu-list navbar-right">
        <a href={`https://rinkeby.etherscan.io/address/${process.env.REACT_APP_DEPLOYED_ADDRESS}`} target="_blank">Deployed on Rinkeby</a>
      </ul>
    </nav>
  )
}


export default Footer