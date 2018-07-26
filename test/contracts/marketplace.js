const { assertRevert } = require('../helpers/assertRevert')
const Marketplace = artifacts.require('../../contracts/Marketplace.sol')

contract('Marketplace', (accounts) => {
  
  let marketplace
  const owner = accounts[0]
  const storeOwner1 = accounts[1]
  const storeOwner2 = accounts[2]
  const shopper1 = accounts[3]
  const shopper2 = accounts[4]
  const randomAccount = accounts[5]
  const storefront1 = 'Storefront 1'
  const storefront2 = 'Storefront 2'
  const product1 = { name: 'Product 1', price: 1, quantity: 100 }
  const product2 = { name: 'Product 2', price: 1.3, quantity: 100 }

  beforeEach(async () => {
    marketplace = await Marketplace.new({from: owner})
    await marketplace.addStoreOwner(storeOwner1, { from: owner })
    await marketplace.addStoreOwner(storeOwner2, { from: owner })
    await marketplace.addStorefront(storefront1, { from: storeOwner1 })
    await marketplace.addStorefront(storefront2, { from: storeOwner1 })
    await marketplace.addProduct(0, product1.name, product1.price, product1.quantity, { from: storeOwner1 })
    await marketplace.addProduct(0, product2.name, product2.price, product2.quantity, { from: storeOwner1 })
  })

  describe('Admin', () => {
    it('should return owner as the owner (admin) of the contract.', async () => {
      const contractOwner = await marketplace.owner.call()
      assert.equal(owner, contractOwner, `The contract owner should be ${contractOwner}`)
    })
  })

  describe('Store Owner', () => {
    describe('storeOwnerCount', () => {
      it('should return 2 as the store owner count when added 2 store owners.', async () => {
        const storeOwnerCount = await marketplace.storeOwnerCount.call()
        assert.equal(storeOwnerCount.toNumber(), 2, `The store owner count should be 2`)
      })
    })
    
    describe('getStoreOwner', () => {
      it('should return storeOwner1 when querying with index 0.', async () => {
        const storeOwner = await marketplace.getStoreOwner.call(0)
        const storeOwnerAddress = storeOwner[0]
        assert.equal(storeOwnerAddress, storeOwner1, `The store owner should be ${storeOwner1}`)
      })
    
      it('should return error when retrieving a store owner with negative index number.', async () => {
        const getStoreOwnerCall = marketplace.getStoreOwner.call(-1)
        await assertRevert(getStoreOwnerCall)
      })
    
      it('should return error when retrieving a store owner with index out of bounds.', async () => {
        const getStoreOwnerCall = marketplace.getStoreOwner.call(99)
        await assertRevert(getStoreOwnerCall)
      })
    })
    
    describe('getStoreOwnerByAddress', () => {
      it('should return storeOwner1 when querying with storeOwner1 address.', async () => {
        const storeOwner = await marketplace.getStoreOwnerByAddress.call(storeOwner1)
        const storeOwnerAddress = storeOwner[0]
        assert.equal(storeOwnerAddress, storeOwner1, `The store owner should be ${storeOwner1}`)
      })
    })

    describe('addStoreOwner', () => {
      it('should add a store owner.', async () => {
        await  marketplace.addStoreOwner(randomAccount, { from: owner })
        const storeOwnerCount = await marketplace.storeOwnerCount.call()
        const storeOwner = await marketplace.getStoreOwner.call(storeOwnerCount - 1)
        const storeOwnerAddress = storeOwner[0]
        assert.equal(storeOwnerAddress, randomAccount, `The store owner should be ${randomAccount}`)
        assert.equal(storeOwnerCount.toNumber(), 3, `The store owner count should be 3`)
      })

      it('should not allow adding of same store owner.', async () => {
        const addStoreOwnerCall = marketplace.addStoreOwner(storeOwner1, { from: owner })
        await assertRevert(addStoreOwnerCall)

        const storeOwnerCount = await marketplace.storeOwnerCount.call()
        assert.equal(storeOwnerCount.toNumber(), 2, `The store owner count should be 2`)
      })

      it('should not allow adding of null address as store owner.', async () => {
        const nullAddress = '0x0000000000000000000000000000000000000000'
        const addStoreOwnerCall = marketplace.addStoreOwner(nullAddress, { from: owner })
        await assertRevert(addStoreOwnerCall)

        const storeOwnerCount = await marketplace.storeOwnerCount.call()
        assert.equal(storeOwnerCount.toNumber(), 2, `The store owner count should be 2`)
      })
      
      it('should return error adding store owner with non-admin account.', async () => {
        const addStoreOwnerCall = marketplace.addStoreOwner(shopper1, {from: shopper2})
        await assertRevert(addStoreOwnerCall)

        const storeOwnerCount = await marketplace.storeOwnerCount.call()
        assert.equal(storeOwnerCount.toNumber(), 2, `The store owner count should be 2`)
      })
    })

    describe('isStoreOwner', () => {
      it('should return true when passed an account who is a Store Owner.', async () => {
        const isStoreOwner = await  marketplace.isStoreOwner(storeOwner1)
        assert.equal(isStoreOwner, true, `Should return true`)
      })

      it('should return false when passed an account who is not a Store Owner.', async () => {
        const isStoreOwner = await  marketplace.isStoreOwner(shopper1)
        assert.equal(isStoreOwner, false, `Should return false`)
      })
    })

    describe('storefronts', () => {
      it('should return [0, 1] (index of storefronts).', async () => {
        const storeOwner = await marketplace.getStoreOwner.call(0)
        const storefronts = storeOwner[1].map(s => s.toNumber())
        assert.equal(storefronts[0], 0, `The storefront index should be 0`)
        assert.equal(storefronts[1], 1, `The storefront index should be 1`)
      })
    })
  })

  describe('Storefront', () => {
    describe('getStorefront', () => {
      it('should return Store 1 details.', async () => {
        const storefrontResults = await marketplace.getStorefront.call(0)
        const id = storefrontResults[0]
        const name = storefrontResults[1]
        const products = storefrontResults[2].map(s => s.toNumber())
        const wallet = storefrontResults[3]
        const storeOwnerId = storefrontResults[4]
        assert.equal(id, 0, `The storefront id should be 0`)
        assert.equal(name, storefront1, `The storefront name should be ${storefront1}`)
        assert.deepEqual(products, [1, 2], `The product id should be [1, 2]`)
        assert.equal(wallet.toNumber(), 0, `The storefront wallet should be 0`)
        assert.equal(storeOwnerId, 0, `The store owner id should be 0`)
      })
    })

    describe('addStorefront', () => {
      it('should add a storefront.', async () => {
        const newStorefront = 'New Storefront'
        await marketplace.addStorefront(newStorefront, { from: storeOwner1 })
        
        const storefrontResults = await marketplace.getStorefront.call(2)
        const id = storefrontResults[0]
        const name = storefrontResults[1]
        assert.equal(name, newStorefront, `The storefront name should be ${newStorefront}`)

        const storeOwner = await marketplace.getStoreOwnerByAddress.call(storeOwner1)
        const storefronts = storeOwner[1].map(s => s.toNumber())
        assert.equal(storefronts[0], 0, `The storefront index should be 0`)
        assert.equal(storefronts[1], 1, `The storefront index should be 1`)
        assert.equal(storefronts[2], id, `The storefront index should be ${id}`)
      })

      it('should not add a storefront if sender is not a Store Owner.', async () => {
        const newStorefront = 'New Storefront'
        const addStorefrontCall = marketplace.addStorefront(newStorefront, { from: shopper1 })
        await assertRevert(addStorefrontCall)
      })
    })

    describe('withdrawFromStorefront', () => {
    })
  })
})
