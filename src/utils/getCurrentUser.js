import getWeb3Accounts from '../utils/getWeb3Accounts'
import { Role } from '../constants/role'

const getCurrentUser = async (marketplaceInstance, web3) => {
  const ownerAccount = await marketplaceInstance.owner.call()
  const accounts = await getWeb3Accounts(web3)
  const currentAccount = accounts[0]
  const role = currentAccount === ownerAccount ? Role.ADMIN : Role.SHOPPER

  return {
    account: currentAccount,
    role: role
  }
}

export default getCurrentUser
