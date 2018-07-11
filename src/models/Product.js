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

  static listProducts = async (marketplace, storefrontId) => {
    const storefront = await marketplace.getStorefront(storefrontId)
    const productIds = storefront[1]
    const productList = _.map(productIds, async index => await marketplace.getProduct.call(index))
    const products = _.map(await Promise.all(productList), results => new Product(results[0], results[1].toNumber(), results[2].toNumber()))
    return products;
  }

}

export default Product;