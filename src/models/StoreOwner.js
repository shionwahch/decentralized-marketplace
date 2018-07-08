import _ from 'lodash'

class StoreOwner {

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