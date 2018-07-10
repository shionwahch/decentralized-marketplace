import _ from 'lodash'

class Product {

  constructor(name, price, quantity) {
    this.name = name
    this.price = price
    this.quantity = quantity
  }

  static addProduct = async (marketplace, storefrontId, name, price, quantity) => {
    await marketplace.addProduct(storefrontId, name, price, quantity)
    return new Product(name, price, quantity)
  }

  // static listProducts = async (marketplace, owner) => {
  //   const storeOwner = await marketplace.getStoreOwnerByAddress(owner)
  //   const storefrontList = _.map(storeOwner[1], async index => await marketplace.getStorefront.call(index))
  //   const storefronts = _.map(await Promise.all(storefrontList), results => new Storefront(results))
  //   return storefronts;
  // }

}

export default Product;