import _ from 'lodash'
import Event from '../constants/event'

class Storefront {

  constructor(id, name, products = [], wallet = 0, storeOwnerId = null) {
    this.id = id
    this.name = name
    this.products = products
    this.wallet = wallet
    this.storeOwnerId = storeOwnerId
  }

  static listStorefronts = async (marketplace, owner) => {
    const storeOwner = await marketplace.getStoreOwnerByAddress(owner)
    const storefrontIds = storeOwner[1];
    const storefrontList = _.map(storefrontIds, async index => await marketplace.getStorefront.call(index))
    const storefronts = _.map(await Promise.all(storefrontList), results => {
      return new Storefront(results[0].toNumber(), results[1], results[2], results[3].toNumber(), results[4].toNumber())
    })
    return storefronts;
  }

  static addStorefront = async (marketplace, name) => {
    const results = await marketplace.addStorefront(name)
    const newStorefront = results.logs[0].event === Event.StorefrontAdded ? 
      Storefront.mapStorefrontAddedEventToStorefront(results.logs[0].args) : null
    return newStorefront
  }

  static withdrawFromStorefront = async (marketplace, storefrontId) => {
    const results = await marketplace.withdrawFromStorefront(storefrontId, { gas: 50000 })
    // const newStorefront = results.logs[0].event === Event.StorefrontAdded ? 
    //   Storefront.mapStorefrontAddedEventToStorefront(results.logs[0].args) : null
    return results
  }

  static mapStorefrontAddedEventToStorefront = (event) => {
    return new Storefront(event.id.toNumber(), event.name, event.products)
  }

}

export default Storefront;