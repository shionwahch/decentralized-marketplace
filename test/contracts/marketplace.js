const Marketplace = artifacts.require("../../contracts/Marketplace.sol")

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

  it("should return owner as the owner of the contract.", async () => {
    const contractOwner = await marketplace.owner.call()
    assert.equal(owner, contractOwner, `The contract owner should be ${contractOwner}`);
  });

  it("should return 2 as the store owner count when added 2 store owners.", async () => {
    const storeOwnerCount = await marketplace.storeOwnerCount.call()
    assert.equal(storeOwnerCount.toNumber(), 2, `The store owner count should be 2`);
  });

  // TODO Unable to import and use open-zeppelin packages
  it.skip("should not allow adding of same store owner.", async () => {
    await marketplace.addStoreOwner(storeOwner1, { from: owner })
    await assertRevert(await marketplace.addStoreOwner(storeOwner1, { from: owner }))
  });
  
  // TODO Unable to import and use open-zeppelin packages
  it.skip("should return error adding store owner with non-admin account.", async () => {
    const addStoreOwner = marketplace.addStoreOwner(shopper1, {from: shopper2})
    await assertRevert(await addStoreOwner);
  });

  it("should return storeOwner1.", async () => {
    const storeOwner = await marketplace.getStoreOwner.call(0)
    const owner = storeOwner[0]
    assert.equal(owner, storeOwner1, `The store owner should be ${storeOwner1}`);
  });

  // TODO Unable to import and use open-zeppelin packages
  it.skip("should return error when retrieving a store owner with index -1.", async () => {
    const storeOwner = marketplace.getStoreOwner.call(-1)
    await assertRevert(await storeOwner);
  });

  // TODO Unable to import and use open-zeppelin packages
  it.skip("should return error when retrieving a store owner with index out of bounds.", async () => {
    const storeOwnerCount = await marketplace.storeOwnerCount.call()
    const storeOwner = await marketplace.getStoreOwner.call(storeOwnerCount)
    await assertRevert(await storeOwner);
  });

  it("should return Store 1 details.", async () => {
    const storefront = await marketplace.getStorefront.call(0)
    const name = storefront
    assert.equal(name, 'Store 1', `The store owner count should be Store 1`);
  });

  it("should return [0, 1] (index of storefront).", async () => {
    const storeOwner = await marketplace.getStoreOwner.call(0)
    const storefronts = storeOwner[1].map(s => s.toNumber())
    assert.equal(storefronts[0], 0, `The storefront index should be 0`);
    assert.equal(storefronts[1], 1, `The storefront index should be 1`);
  });

});
