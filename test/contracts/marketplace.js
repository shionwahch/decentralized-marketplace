// import { assertRevert } from '../helpers/assertRevert'
const { assertRevert } = require('../helpers/assertRevert');
const Marketplace = artifacts.require('../../contracts/Marketplace.sol')

contract('Marketplace', (accounts) => {
  
  let marketplace
  const owner = accounts[0]
  const storeOwner1 = accounts[1]
  const storeOwner2 = accounts[2]
  const shopper1 = accounts[3]
  const shopper2 = accounts[4]

  before(async () => {
    marketplace = await Marketplace.new({from: owner})
    await marketplace.addStoreOwner(storeOwner1, { from: owner })
    await marketplace.addStoreOwner(storeOwner2, { from: owner })
    await marketplace.addStorefront('Store 1', { from: storeOwner1 })
    await marketplace.addStorefront('Store 2', { from: storeOwner1 })
  });

  describe('Admin', () => {
    it('should return owner as the owner (admin) of the contract.', async () => {
      const contractOwner = await marketplace.owner.call()
      assert.equal(owner, contractOwner, `The contract owner should be ${contractOwner}`);
    });
  })

  describe('Store Owner', () => {
    describe('storeOwnerCount', () => {
      it('should return 2 as the store owner count when added 2 store owners.', async () => {
        const storeOwnerCount = await marketplace.storeOwnerCount.call()
        assert.equal(storeOwnerCount.toNumber(), 2, `The store owner count should be 2`);
      });
    })
    
    describe('getStoreOwner', () => {
      it('should return storeOwner1 when querying with index 0.', async () => {
        const storeOwner = await marketplace.getStoreOwner.call(0)
        const storeOwnerAddress = storeOwner[0]
        assert.equal(storeOwnerAddress, storeOwner1, `The store owner should be ${storeOwner1}`);
      });
    
      it('should return error when retrieving a store owner with negative index number.', async () => {
        const getStoreOwnerCall = marketplace.getStoreOwner.call(-1)
        await assertRevert(getStoreOwnerCall);
      });
    
      it('should return error when retrieving a store owner with index out of bounds.', async () => {
        const getStoreOwnerCall = marketplace.getStoreOwner.call(99)
        await assertRevert(getStoreOwnerCall);
      });
    })
    
    describe('getStoreOwnerByAddress', () => {
      it('should return storeOwner1 when querying with storeOwner1 address.', async () => {
        const storeOwner = await marketplace.getStoreOwnerByAddress.call(storeOwner1)
        const storeOwnerAddress = storeOwner[0]
        assert.equal(storeOwnerAddress, storeOwner1, `The store owner should be ${storeOwner1}`);
      });
    })

    describe('addStoreOwner', () => {
      it('should not allow adding of same store owner.', async () => {
        const addStoreOwnerCall = marketplace.addStoreOwner(storeOwner1, { from: owner })
        await assertRevert(addStoreOwnerCall)
      });
      
      it('should return error adding store owner with non-admin account.', async () => {
        const addStoreOwnerCall = marketplace.addStoreOwner(shopper1, {from: shopper2})
        await assertRevert(addStoreOwnerCall);
      });
    })
  });

  describe('Storefront', () => {
    it('should return Store 1 details.', async () => {
      const storefrontResults = await marketplace.getStorefront.call(0)
      const name = storefrontResults[1]
      assert.equal(name, 'Store 1', `The store owner count should be Store 1`);
    });
  
    it('should return [0, 1] (index of storefront).', async () => {
      const storeOwner = await marketplace.getStoreOwner.call(0)
      const storefronts = storeOwner[1].map(s => s.toNumber())
      assert.equal(storefronts[0], 0, `The storefront index should be 0`);
      assert.equal(storefronts[1], 1, `The storefront index should be 1`);
    });
  });
});
