import React from 'react'
import PropTypes from 'prop-types';
import { getShortAddress } from '../utils/getCurrentUser'

const Home = ({ user }) => {
  return (
    <div className="pure-u-1-1">
      <h1>Hi {getShortAddress(user.account)} ({user.role})</h1>
      <p>Ready to shop!</p>
    </div>
  )
}

Home.propTypes = {
  user: PropTypes.shape({
    account: PropTypes.string,
    role: PropTypes.string
  })
}

export default Home