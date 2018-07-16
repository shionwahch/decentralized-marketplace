import _ from 'lodash'
import Event from '../constants/event'

class Product {
  
  constructor(id, name, price, quantity) {
    this.id = id
    this.name = name
    this.price = price
    this.quantity = quantity
  }

  static addProduct = async (marketplace, storefrontId, name, price, quantity) => {
    const results = await marketplace.addProduct(storefrontId, name, price, quantity)
    const newProduct = results.logs[0].event === Event.ProductAdded ? Product.mapEventToProduct(results.logs[0].args) : null
    return newProduct
  }

  static listProducts = async (marketplace, storefrontId) => {
    const storefront = await marketplace.getStorefront(storefrontId)
    const productIds = storefront[2]
    const productList = _.map(productIds, async index => await marketplace.getProduct.call(index))
    const products = _.map(await Promise.all(productList), results => new Product(results[0].toNumber(), results[1], results[2].toNumber(), results[3].toNumber()))
    return products;
  }

  static updateProduct = async (marketplace, id, name, price, quantity) => {
    const results = await marketplace.updateProduct(id, name, price, quantity)
    const updatedProduct = results.logs[0].event === Event.ProductUpdated ? Product.mapEventToProduct(results.logs[0].args) : null
    return updatedProduct
  }
  
  static mapEventToProduct = (event) => {
    return new Product(event.id.toNumber(), event.name, event.price.toNumber(), event.quantity.toNumber())
  }

}

export default Product;