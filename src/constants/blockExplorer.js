
const Url = Object.freeze({
    Rinkeby: 'https://rinkeby.etherscan.io'
})

const BlockExplorer = Object.freeze({
    Rinkeby: {
        Url: Url.Rinkeby,
        Transaction: `${Url.Rinkeby}/tx`,
        Address: `${Url.Rinkeby}/address`
    }
})

const getTransaction = (transactionHash) => `${BlockExplorer.Rinkeby.Transaction}/${transactionHash}`
const getAddress = (address) => `${BlockExplorer.Rinkeby.Address}/${address}`

export { getTransaction, getAddress }
export default BlockExplorer