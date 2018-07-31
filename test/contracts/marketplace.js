const { assertRevert } = require('../helpers/assertRevert')
const { ethGetBalance, ethGetTransaction } = require('../helpers/web3')
const Marketplace = artifacts.require('../../contracts/Marketplace.sol')

contract('Marketplace', (accounts) => {
  
  let marketplace
  const owner = accounts[0]
  const storeOwner1 = accounts[1]
  const storeOwner2 = accounts[2]
  const shopper1 = accounts[3]
  const shopper2 = accounts[4]
  const randomAccount = accounts[5]
  const storefront1 = { id: 1, name: 'Storefront 1' }
  const storefront2 = { id: 2, name: 'Storefront 2' }
  const product1 = { id: 1, name: 'Product 1', price: 10000000000000000, quantity: 100 } // 0.01 ETH
  const product2 = { id: 2, name: 'Product 2', price: 13000000000000000, quantity: 100 } // 0.013 ETH

  beforeEach(async () => {
    marketplace = await Marketplace.new({from: owner})
    await marketplace.addStoreOwner(storeOwner1, { from: owner })
    await marketplace.addStoreOwner(storeOwner2, { from: owner })
    await marketplace.addStorefront(storefront1.name, { from: storeOwner1 })
    await marketplace.addStorefront(storefront2.name, { from: storeOwner1 })
    await marketplace.addProduct(storefront1.id, product1.name, product1.price, product1.quantity, { from: storeOwner1 })
    await marketplace.addProduct(storefront1.id, product2.name, product2.price, product2.quantity, { from: storeOwner1 })
  })

  describe('Fallback', () => {
    it('should allow admin (owner of the contract) to send to fallback.', async () => {
      const balanceBefore = (await ethGetBalance(marketplace.address)).toNumber()
      await marketplace.sendTransaction({ from: owner, value: 1 })
      const balanceAfter = (await ethGetBalance(marketplace.address)).toNumber()
      assert.equal(balanceAfter - balanceBefore, 1, `The contract balance should be 1`)
    })

    it('should allow non-admin to send to fallback.', async () => {
      const sendTransactionCall = marketplace.sendTransaction({ from: randomAccount, value: 1 })
      await assertRevert(sendTransactionCall)
    })
  })

  describe('Self-Destruct', () => {
    it('should allow admin (owner of the contract) to trigger self-destruct.', async () => {
      const contractBalance = (await ethGetBalance(marketplace.address)).toNumber()
      const balanceBefore = (await ethGetBalance(owner)).toNumber()
      await marketplace.destroy({ from: owner })
      const balanceAfter = (await ethGetBalance(owner)).toNumber()
      const estimatedGasCost = 1500000000000000
      assert.closeTo(balanceAfter - balanceBefore, contractBalance, estimatedGasCost, `The contract balance should be around ${contractBalance}`)
    })

    it('should allow non-admin to send to trigger self-destruct.', async () => {
      const destroyCall = marketplace.destroy({ from: randomAccount })
      await assertRevert(destroyCall)
    })
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
        const storeOwnerCount = await marketplace.getStoreOwnerCount.call()
        assert.equal(storeOwnerCount.toNumber(), 2, `The store owner count should be 2`)
      })
    })
    
    describe('getStoreOwner', () => {
      it('should return storeOwner1 when querying with index 1.', async () => {
        const storeOwner = await marketplace.getStoreOwner.call(1)
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
        const storeOwnerCount = await marketplace.getStoreOwnerCount.call()
        const storeOwner = await marketplace.getStoreOwner.call(storeOwnerCount)
        const storeOwnerAddress = storeOwner[0]
        assert.equal(storeOwnerAddress, randomAccount, `The store owner should be ${randomAccount}`)
        assert.equal(storeOwnerCount.toNumber(), 3, `The store owner count should be 3`)
      })

      it('should not allow adding of same store owner.', async () => {
        const addStoreOwnerCall = marketplace.addStoreOwner(storeOwner1, { from: owner })
        await assertRevert(addStoreOwnerCall)

        const storeOwnerCount = await marketplace.getStoreOwnerCount.call()
        assert.equal(storeOwnerCount.toNumber(), 2, `The store owner count should be 2`)
      })

      it('should not allow adding of null address as store owner.', async () => {
        const nullAddress = '0x0000000000000000000000000000000000000000'
        const addStoreOwnerCall = marketplace.addStoreOwner(nullAddress, { from: owner })
        await assertRevert(addStoreOwnerCall)

        const storeOwnerCount = await marketplace.getStoreOwnerCount.call()
        assert.equal(storeOwnerCount.toNumber(), 2, `The store owner count should be 2`)
      })
      
      it('should return error adding store owner with non-admin account.', async () => {
        const addStoreOwnerCall = marketplace.addStoreOwner(shopper1, {from: shopper2})
        await assertRevert(addStoreOwnerCall)

        const storeOwnerCount = await marketplace.getStoreOwnerCount.call()
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
        const storeOwner = await marketplace.getStoreOwner.call(1)
        const storefronts = storeOwner[1].map(s => s.toNumber())
        assert.equal(storefronts[0], 1, `The storefront index should be 1`)
        assert.equal(storefronts[1], 2, `The storefront index should be 2`)
      })
    })
  })

  describe('Storefront', () => {
    describe('getStorefront', () => {
      it('should return Store 1 details.', async () => {
        const storefrontResults = await marketplace.getStorefront.call(1)
        const id = storefrontResults[0]
        const name = storefrontResults[1]
        const products = storefrontResults[2].map(s => s.toNumber())
        const wallet = storefrontResults[3].toNumber()
        const storeOwnerId = storefrontResults[4]
        assert.equal(id, 1, `The storefront id should be 1`)
        assert.equal(name, storefront1.name, `The storefront name should be ${storefront1.name}`)
        assert.deepEqual(products, [1, 2], `The product id should be [1, 2]`)
        assert.equal(wallet, 0, `The storefront wallet should be 0`)
        assert.equal(storeOwnerId, 1, `The store owner id should be 1`)
      })
    })

    describe('addStorefront', () => {
      it('should add a storefront.', async () => {
        const newStorefront = 'New Storefront'
        await marketplace.addStorefront(newStorefront, { from: storeOwner1 })
        
        const storefrontResults = await marketplace.getStorefront.call(3)
        const id = storefrontResults[0]
        const name = storefrontResults[1]
        assert.equal(name, newStorefront, `The storefront name should be ${newStorefront}`)

        const storeOwner = await marketplace.getStoreOwnerByAddress.call(storeOwner1)
        const storefronts = storeOwner[1].map(s => s.toNumber())
        assert.equal(storefronts[0], 1, `The storefront index should be 1`)
        assert.equal(storefronts[1], 2, `The storefront index should be 2`)
        assert.equal(storefronts[2], id, `The storefront index should be ${id}`)
      })

      it('should not add a storefront if sender is not a Store Owner.', async () => {
        const newStorefront = 'New Storefront'
        const addStorefrontCall = marketplace.addStorefront(newStorefront, { from: shopper1 })
        await assertRevert(addStorefrontCall)
      })
    })

    describe('withdrawFromStorefront', () => {

      const product3 = { id: 3, name: 'Product 3', price: 20000000000000000, quantity: 100 } // 0.02 ETH

      beforeEach(async () => {
        await marketplace.addProduct(2, product3.name, product3.price, product3.quantity, { from: storeOwner1 })
        await marketplace.purchaseProduct(product1.id, 10, { from: shopper1, value: product1.price * 10 })
        await marketplace.purchaseProduct(product2.id, 3, { from: shopper1, value: product2.price * 3 })
        await marketplace.purchaseProduct(product3.id, 10, { from: shopper1, value: product3.price * 10 })
      })

      it('should withdraw from single storefront', async () => {
        const balanceBefore = (await ethGetBalance(storeOwner1)).toNumber()
        const transactionReceipt = await marketplace.withdrawFromStorefront(1, { from: storeOwner1 })

        const gasUsed = transactionReceipt.receipt.gasUsed
        const transactionHash = transactionReceipt.receipt.transactionHash
        const transaction = await ethGetTransaction(transactionHash)
        const totalGasCost = gasUsed * transaction.gasPrice.toNumber()
        const totalProductCost = product1.price * 10 + product2.price * 3
        
        const balanceAfter = (await ethGetBalance(storeOwner1)).toNumber()
        const storeOwnerProfit = balanceAfter - balanceBefore
        const expectedProfit = totalProductCost - totalGasCost

        assert.closeTo(storeOwnerProfit, expectedProfit, 50000, `StoreOwner withdrawal profit should be ${expectedProfit}`)
      })

      it('should not withdraw from single storefront when not triggered by the StoreOwner of a Storefront', async () => {
        const withdrawFromStorefrontCall = marketplace.withdrawFromStorefront(0, { from: storeOwner2 })
        await assertRevert(withdrawFromStorefrontCall)
      })

      it('should withdraw from all storefronts (2 storefronts)', async () => {
        const balanceBefore = (await ethGetBalance(storeOwner1)).toNumber()
        const transactionReceipt = await marketplace.withdrawFromAllStorefronts({ from: storeOwner1 })

        const gasUsed = transactionReceipt.receipt.gasUsed
        const transactionHash = transactionReceipt.receipt.transactionHash
        const transaction = await ethGetTransaction(transactionHash)
        const totalGasCost = gasUsed * transaction.gasPrice.toNumber()
        const totalProductCost = product1.price * 10 + product2.price * 3 + product3.price * 10
        
        const balanceAfter = (await ethGetBalance(storeOwner1)).toNumber()
        const storeOwnerProfit = balanceAfter - balanceBefore
        const expectedProfit = totalProductCost - totalGasCost

        assert.closeTo(storeOwnerProfit, expectedProfit, 50000, `StoreOwner withdrawal profit should be ${expectedProfit}`)
      })

      it('should not withdraw from all storefronts when not triggered by a StoreOwner', async () => {
        const withdrawFromAllStorefrontsCall = marketplace.withdrawFromAllStorefronts({ from: shopper1 })
        await assertRevert(withdrawFromAllStorefrontsCall)
      })
    })
  })

  describe('Product', () => {
    describe('getProduct', () => {
      it('should return product1 when querying with index 1.', async () => {
        const product = await marketplace.getProduct.call(1)
        const productName = product[1]
        assert.equal(productName, product1.name, `The product name should be ${product1.name}`)
      })

      it('should return error when retrieving a product with invalid id (or index number).', async () => {
        const getProductCall1 = marketplace.getProduct.call(0)
        const getProductCall2 = marketplace.getProduct.call(-1)
        const getProductCall3 = marketplace.getProduct.call(99)
        await assertRevert(getProductCall1)
        await assertRevert(getProductCall2)
        await assertRevert(getProductCall3)
      })
    })

    describe('addProduct', () => {
      it('should add a product to storefront.', async () => {
        const newProduct = { name: 'New Product', price: 1, quantity: 1 }
        await marketplace.addProduct(storefront1.id, newProduct.name, newProduct.price, newProduct.quantity, { from: storeOwner1 })

        const addedProduct = await marketplace.getProduct.call(3)
        const addedProductName = addedProduct[1]
        assert.equal(addedProductName, newProduct.name, `The product name should be ${product1.name}`)

      })

      it('should not add a product to storefront when price is 0.', async () => {
        const newProduct = { name: 'New Product', price: 0, quantity: 1 }
        const addProductCall = marketplace.addProduct(storefront1.id, newProduct.name, newProduct.price, newProduct.quantity, { from: storeOwner1 })
        await assertRevert(addProductCall)
      })

      it.skip('should not add a product to storefront when price is lesser than 0.', async () => {
        const newProduct = { name: 'New Product', price: -1, quantity: 1 }
        const addProductCall = marketplace.addProduct(storefront1.id, newProduct.name, newProduct.price, newProduct.quantity, { from: storeOwner1 })
        await assertRevert(addProductCall)
      })

      it('should not add a product to storefront when quantity is 0.', async () => {
        const newProduct = { name: 'New Product', price: 1, quantity: 0 }
        const addProductCall = marketplace.addProduct(storefront1.id, newProduct.name, newProduct.price, newProduct.quantity, { from: storeOwner1 })
        await assertRevert(addProductCall)
      })

      it.skip('should not add a product to storefront when quantity is lesser than 0.', async () => {
        const newProduct = { name: 'New Product', price: 1, quantity: -1 }
        const addProductCall = marketplace.addProduct(storefront1.id, newProduct.name, newProduct.price, newProduct.quantity, { from: storeOwner1 })
        await assertRevert(addProductCall)
      })
  
      it('should not add a product to storefront when storefrontId is invalid.', async () => {
        const newProduct = { name: 'New Product', price: 1, quantity: 1 }
        const addProductCall1 = marketplace.addProduct(0, newProduct.name, newProduct.price, newProduct.quantity, { from: storeOwner1 })
        const addProductCall2 = marketplace.addProduct(-1, newProduct.name, newProduct.price, newProduct.quantity, { from: storeOwner1 })
        const addProductCall3 = marketplace.addProduct(99, newProduct.name, newProduct.price, newProduct.quantity, { from: storeOwner1 })
        await assertRevert(addProductCall1)
        await assertRevert(addProductCall2)
        await assertRevert(addProductCall3)
      })
  
      it('should not add a product to storefront when sender is not the store owner of the storefront.', async () => {
        const newProduct = { name: 'New Product', price: 1, quantity: 1 }
        const addProductCall = marketplace.addProduct(storefront1.id, newProduct.name, newProduct.price, newProduct.quantity, { from: storeOwner2 })
        await assertRevert(addProductCall)
      })
    })

    describe('updateProduct', () => {
      it('should update a product.', async () => {
        const updatedProduct = { id: 1, name: 'Updated Product', price: 1, quantity: 1 }
        await marketplace.updateProduct(updatedProduct.id, updatedProduct.name, updatedProduct.price, updatedProduct.quantity, { from: storeOwner1 })

        const product = await marketplace.getProduct.call(1)
        const productName = product[1]
        const productPrice = product[2]
        const productQuantity = product[3]
        assert.equal(productName, updatedProduct.name, `The product name should be ${updatedProduct.name}`)
        assert.equal(productPrice, updatedProduct.price, `The product price should be ${updatedProduct.price}`)
        assert.equal(productQuantity, updatedProduct.quantity, `The product quantity should be ${updatedProduct.quantity}`)
      })
  
      it('should not update a product of storefront when productId is invalid.', async () => {
        const updatedProduct = { id: 1, name: 'Updated Product', price: 1, quantity: 1 }
        const updateProductCall1 = marketplace.updateProduct(0, updatedProduct.name, updatedProduct.price, updatedProduct.quantity, { from: storeOwner1 })
        const updateProductCall2 = marketplace.updateProduct(-1, updatedProduct.name, updatedProduct.price, updatedProduct.quantity, { from: storeOwner1 })
        const updateProductCall3 = marketplace.updateProduct(99, updatedProduct.name, updatedProduct.price, updatedProduct.quantity, { from: storeOwner1 })
        await assertRevert(updateProductCall1)
        await assertRevert(updateProductCall2)
        await assertRevert(updateProductCall3)
      })
  
      it('should not update a product of storefront when sender is not the store owner of the storefront.', async () => {
        const updatedProduct = { id: 1, name: 'Updated Product', price: 1, quantity: 1 }
        const updateProductCall = marketplace.updateProduct(storefront1.id, updatedProduct.name, updatedProduct.price, updatedProduct.quantity, { from: storeOwner2 })
        await assertRevert(updateProductCall)
      })
    })

    describe('removeProduct', () => {
      it('should remove a product.', async () => {
        const removedProduct = { id: 1 }
        await marketplace.removeProduct(removedProduct.id, { from: storeOwner1 })

        const product = await marketplace.getProduct.call(removedProduct.id)
        const productName = product[1]
        const productPrice = product[2]
        const productQuantity = product[3]
        assert.equal(productName, '', `The product name should be empty`)
        assert.equal(productPrice, 0, `The product price should be 0`)
        assert.equal(productQuantity, 0, `The product quantity should be 0`)
      })
  
      it('should not remove a product from storefront when productId is invalid.', async () => {
        const removeProductCall1 = marketplace.removeProduct(0, { from: storeOwner1 })
        const removeProductCall2 = marketplace.removeProduct(-1, { from: storeOwner1 })
        const removeProductCall3 = marketplace.removeProduct(99, { from: storeOwner1 })
        await assertRevert(removeProductCall1)
        await assertRevert(removeProductCall2)
        await assertRevert(removeProductCall3)
      })
  
      it('should not remove a product from storefront when sender is not the store owner of the storefront.', async () => {
        const removedProduct = { id: 1 }
        const removeProductCall = marketplace.removeProduct(removedProduct.id, { from: storeOwner2 })
        await assertRevert(removeProductCall)
      })
    })

    describe('purchaseProduct', () => {
      it('should purchase a product.', async () => {
        const purchasedProduct = { id: product1.id, quantity: 10 }
        const quantityBefore = product1.quantity
        await marketplace.purchaseProduct(purchasedProduct.id, purchasedProduct.quantity, { from: shopper1, value: product1.price * 10  })

        const product = await marketplace.getProduct.call(purchasedProduct.id)
        const quantityAfter = product[3]
        assert.equal(quantityAfter, quantityBefore - purchasedProduct.quantity, `The product quantity should be ${quantityBefore - purchasedProduct.quantity}`)
      })
  
      it('should not purchase a product from storefront when productId is invalid.', async () => {
        const purchasedProduct = { quantity: 10 }
        const purchaseProductCall1 = marketplace.purchaseProduct(0, purchasedProduct.quantity, { from: shopper1, value: product1.price * 10  })
        const purchaseProductCall2 = marketplace.purchaseProduct(-1, purchasedProduct.quantity, { from: shopper1, value: product1.price * 10  })
        const purchaseProductCall3 = marketplace.purchaseProduct(99, purchasedProduct.quantity, { from: shopper1, value: product1.price * 10  })
        await assertRevert(purchaseProductCall1)
        await assertRevert(purchaseProductCall2)
        await assertRevert(purchaseProductCall3)
      })

      it('should not purchase a product from storefront when purchase quantity exceeds product quantity.', async () => {
        const purchasedProduct = { id: product1.id, quantity: 999 }
        const purchaseProductCall = marketplace.purchaseProduct(purchasedProduct.id, purchasedProduct.quantity, { from: shopper1, value: product1.price * 10  })
        await assertRevert(purchaseProductCall)
      })

      it('should not purchase a product from storefront when sent value is not the same as the product price.', async () => {
        const purchasedProduct = { id: product1.id, quantity: 10 }
        const purchaseProductCall = marketplace.purchaseProduct(purchasedProduct.id, purchasedProduct.quantity, { from: shopper1, value: 99  })
        await assertRevert(purchaseProductCall)
      })
    })
  })
})
