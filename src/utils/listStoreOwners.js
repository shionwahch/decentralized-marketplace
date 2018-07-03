
const listStoreOwners = async (marketplaceInstance) => {
  const storeOwnerCount = (await marketplaceInstance.storeOwnerCount.call()).toNumber()
  const storeOwnerList = [...Array(storeOwnerCount)].map(async index => await marketplaceInstance.getStoreOwner.call(index))
  return storeOwnerList
}

export default listStoreOwners
