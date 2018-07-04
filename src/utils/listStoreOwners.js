import _ from 'lodash'

const listStoreOwners = async (marketplaceInstance) => {
  const storeOwnerCount = await marketplaceInstance.storeOwnerCount.call()
  const storeOwnerList = _.map(_.range(storeOwnerCount).map(async index => await marketplaceInstance.getStoreOwner.call(index)))
  return Promise.all(storeOwnerList)
}

export default listStoreOwners
