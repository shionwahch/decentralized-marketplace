
const addStoreOwner = async (marketplaceInstance, address) => {
  return await marketplaceInstance.addStoreOwner(`${address}`)
}

export default addStoreOwner
