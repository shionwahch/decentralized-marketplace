const Marketplace = artifacts.require("../../contracts/Marketplace.sol")

contract('Marketplace', (accounts) => {
  
  let marketplace
  const owner = accounts[0]
  const storeOwner1 = accounts[1]
  const storeOwner2 = accounts[2]
  const shopper = accounts[3]

  before(async () => {
    marketplace = await Marketplace.new({from: owner})
  });

  it("should return owner as the owner of the contract.", async () => {
    const contractOwner = await marketplace.owner.call()
    assert.equal(owner, contractOwner, `The contract owner should be ${contractOwner}`);
  });

  it("should return 2 as the store owner count when added 2 store owners.", async () => {
    await marketplace.addStoreOwner(storeOwner1, { from: owner })
    await marketplace.addStoreOwner(storeOwner2, { from: owner })
    const storeOwnerCount = await marketplace.storeOwnerCount.call()
    assert.equal(storeOwnerCount.toNumber(), 2, `The store owner count should be 2`);
  });

  // Unable to import and use open-zeppelin packages
  it.skip("should not allow adding of same store owner.", async () => {
    await marketplace.addStoreOwner(storeOwner1, { from: owner })
    await assertRevert(await marketplace.addStoreOwner(storeOwner1, { from: owner }))
  });
  
  // Unable to import and use open-zeppelin packages
  it.skip("should return error adding store owner with non-admin account.", async () => {
    const addStoreOwner = marketplace.addStoreOwner(storeOwner1, {from: shopper})
    await assertRevert(addStoreOwner);
  });

});
