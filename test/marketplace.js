const Marketplace = artifacts.require("../contracts/Marketplace.sol");

contract('Marketplace', (accounts) => {
  
  let marketplace
  const owner = accounts[0]

  before(async () => {
    marketplace = await Marketplace.deployed()
  });

  it("owner should be the deployer of the contract.", async () => {
    const contractOwner = await marketplace.owner.call()
    assert.equal(owner, contractOwner, `The contract owner should be ${contractOwner}`);
  });

});
