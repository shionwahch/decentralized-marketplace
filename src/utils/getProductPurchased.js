
const getProductPurchased = (marketplace) => {
	return new Promise(function(resolve, reject) {
			marketplace.ProductPurchased({}, { fromBlock: 0, toBlock: 'latest' }).get((err, results) => {
			resolve(results)
		})
	})
}

export default getProductPurchased