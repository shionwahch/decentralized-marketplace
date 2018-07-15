import _ from 'lodash'

class Product {

  constructor(id, name, price, quantity) {
    this.id = id
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
    const products = _.map(await Promise.all(productList), results => new Product(results[0].toNumber(), results[1], results[2].toNumber(), results[3].toNumber()))
    return products;
  }

}

export default Product;