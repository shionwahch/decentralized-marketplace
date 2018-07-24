import _ from 'lodash'
import Event from '../constants/event'
import { weiToEther, etherToWei } from '../utils/web3Utils'

class Product {
  
  constructor(id, name, price, quantity) {
    this.id = id
    this.name = name
    this.price = price
    this.quantity = quantity
  }

  static addProduct = async (marketplace, storefrontId, name, price, quantity) => {
    const results = await marketplace.addProduct(storefrontId, name, price, quantity)
    const newProduct = Product.getProductFromTransaction(results, Event.ProductAdded)
    return newProduct
  }

  static listProducts = async (marketplace, storefrontId) => {
    const storefront = await marketplace.getStorefront(storefrontId)
    const productIds = storefront[2]
    const productList = _.map(productIds, async index => await marketplace.getProduct.call(index))
    const products = _.map(await Promise.all(productList), results => {
      return new Product(results[0].toNumber(), results[1], weiToEther(results[2].toNumber()), results[3].toNumber())
    })
    const validProducts = _.filter(products, product => product.id !== 0)
    return validProducts;
  }

  static updateProduct = async (marketplace, id, name, price, quantity) => {
    const results = await marketplace.updateProduct(id, name, price, quantity)
    const updatedProduct = Product.getProductFromTransaction(results, Event.ProductUpdated)
    return updatedProduct
  }
  
  static removeProduct =  async (marketplace, id) => {
    const results = await marketplace.removeProduct(id, { gas: 50000 })
    const removedProduct = Product.getProductFromTransaction(results, Event.ProductRemoved)
    return removedProduct
  }

  static purchaseProduct = async (marketplace, id, addedQuantity, totalCost) => {
    const results = await marketplace.purchaseProduct(id, addedQuantity, { value: etherToWei(totalCost) })
    const transaction = results.logs[0]
    const purchasedProduct = transaction.event === Event.ProductPurchased ? 
      new Product(transaction.args.id.toNumber(), null, null, transaction.args.quantity.toNumber()) : null
    return purchasedProduct
  }

  static getProductFromTransaction = (transaction, event) => {
    return transaction.logs[0].event === event ? Product.mapEventToProduct(transaction.logs[0].args) : null
  }
  
  static mapEventToProduct = (event) => {
    return new Product(event.id.toNumber(), event.name, weiToEther(event.price.toNumber()), event.quantity.toNumber())
  }
  
}

export default Product;