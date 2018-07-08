import _ from 'lodash'

class StoreOwner {

  constructor(owner, storefronts = []) {
    this.owner = owner
    this.storefronts = storefronts
  }

  static listStoreOwners = async (marketplace) => {
    const storeOwnerCount = await marketplace.storeOwnerCount.call()
    const storeOwnerList = _.map(_.range(storeOwnerCount).map(async index => await marketplace.getStoreOwner.call(index)))
    const storeOwners = _.map(await Promise.all(storeOwnerList), results => new StoreOwner(results[0], results[1]))
    return storeOwners
  }

  static addStoreOwner = async (marketplace, owner) => {
    await marketplace.addStoreOwner(owner)
    return new StoreOwner(owner)
  }

  static addStorefront = async (marketplace, name) => {
    const storefront = await marketplace.addStorefront(name)
    return Promise.resolve(storefront)
  }

}

export default StoreOwner;