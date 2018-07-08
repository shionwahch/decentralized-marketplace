import _ from 'lodash'

class StoreOwner {

  static listStoreOwners = async (marketplace) => {
    const storeOwnerCount = await marketplace.storeOwnerCount.call()
    const storeOwnerList = _.map(_.range(storeOwnerCount).map(async index => await marketplace.getStoreOwner.call(index)))
    return Promise.all(storeOwnerList)
  }

  static addStoreOwner = async (marketplace, address) => {
    return await marketplace.addStoreOwner(address)
  }

  static listStorefronts = async (marketplace, storeOwner) => {
    const results = await marketplace.getStoreOwnerByAddress(storeOwner)
    const storefronts = _.map(results[1], async index => await marketplace.getStorefront.call(index))
    return Promise.all(storefronts);
  }

  static addStorefront = async (marketplace, name) => {
    const storefront = await marketplace.addStorefront(name)
    return Promise.resolve(storefront)
  }

}

export default StoreOwner;