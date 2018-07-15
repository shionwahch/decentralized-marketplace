import _ from 'lodash'

class Storefront {

  constructor(id, name, products = []) {
    this.id = id
    this.name = name
    this.products = products
  }

  static listStorefronts = async (marketplace, owner) => {
    const storeOwner = await marketplace.getStoreOwnerByAddress(owner)
    const storefrontIds = storeOwner[1];
    const storefrontList = _.map(storefrontIds, async index => await marketplace.getStorefront.call(index))
    const storefronts = _.map(await Promise.all(storefrontList), results => new Storefront(results[0].toNumber(), results[1], results[2]))
    return storefronts;
  }

  static addStorefront = async (marketplace, name) => {
    await marketplace.addStorefront(name)
    return new Storefront(name)
  }

}

export default Storefront;