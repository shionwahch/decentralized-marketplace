import getWeb3Accounts from '../utils/getWeb3Accounts'
import Role from '../constants/role'

const getCurrentUser = async (marketplaceInstance, web3) => {
  const accounts = await getWeb3Accounts(web3)
  const currentAccount = accounts[0]
  const ownerAccount = await marketplaceInstance.owner.call()
  const isStoreOwner = await marketplaceInstance.isStoreOwner.call(currentAccount)
  
  let role = Role.SHOPPER
  if (isStoreOwner) role = Role.STORE_OWNER
  if (currentAccount === ownerAccount) role = Role.ADMIN

  return {
    account: currentAccount,
    role: role
  }
}

const getShortAddress = (address) => address.substr(0,6)

export { getShortAddress }
export default getCurrentUser
