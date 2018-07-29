import _ from 'lodash'

class StoreOwner {

  constructor(owner, storefronts = []) {
    this.owner = owner
    this.storefronts = storefronts
  }

  static getById = async (marketplace, storeOwnerId) => {
    const results = await marketplace.getStoreOwner.call(storeOwnerId)
    return new StoreOwner(results[0], results[1])
  }

  static listStoreOwners = async (marketplace) => {
    const storeOwnerCount = await marketplace.storeOwnerCount.call()
    const storeOwnerList = _.map(_.range(1, Number(storeOwnerCount) + 1).map(async index => await marketplace.getStoreOwner.call(index)))
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