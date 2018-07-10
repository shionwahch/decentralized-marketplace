import _ from 'lodash'

class Storefront {

  constructor(name, products = []) {
    this.name = name
    this.products = products
  }

  static listStorefronts = async (marketplace, owner) => {
    const storeOwner = await marketplace.getStoreOwnerByAddress(owner)
    const storefrontList = _.map(storeOwner[1], async index => await marketplace.getStorefront.call(index))
    const storefronts = _.map(await Promise.all(storefrontList), results => new Storefront(results))
    return storefronts;
  }

  static addStorefront = async (marketplace, name) => {
    await marketplace.addStorefront(name)
    return new Storefront(name)
  }

}

export default Storefront;