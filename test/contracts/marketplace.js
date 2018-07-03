const Marketplace = artifacts.require("../../contracts/Marketplace.sol")

contract('Marketplace', (accounts) => {
  
  let marketplace
  const owner = accounts[0]
  const storeOwner1 = accounts[1]
  const storeOwner2 = accounts[2]
  const shopper1 = accounts[3]
  const shopper2 = accounts[4]

  beforeEach(async () => {
    marketplace = await Marketplace.new({from: owner})
    await marketplace.addStoreOwner(storeOwner1, { from: owner })
    await marketplace.addStoreOwner(storeOwner2, { from: owner })
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
    assert.equal(storeOwner, storeOwner1, `The store owner should be ${storeOwner1}`);
  });

  // TODO Unable to import and use open-zeppelin packages
  it.skip("should return error when retreiving store owner with index -1.", async () => {
    const storeOwner = marketplace.getStoreOwner.call(-1)
    await assertRevert(await storeOwner);
  });

  // TODO Unable to import and use open-zeppelin packages
  it.skip("should return error when retreiving store owner with index out of bounds.", async () => {
    const storeOwnerCount = await marketplace.storeOwnerCount.call()
    const storeOwner = await marketplace.getStoreOwner.call(storeOwnerCount)
    await assertRevert(await storeOwner);
  });

});
