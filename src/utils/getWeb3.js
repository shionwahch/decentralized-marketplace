import Web3 from 'web3'

const localProvider = {
  url: 'http://127.0.0.1',
  port: 8545
}

const getWeb3 = new Promise((resolve, reject) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', () => {
    let web3 = window.web3
    let provider

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      provider = web3.currentProvider

      console.log('Injected web3 detected.');
    } else {
      // Fallback to localhost if no web3 injection. 
      provider = new Web3.providers.HttpProvider(`http://${localProvider.url}:${localProvider.port}`)

      console.log('No web3 instance injected, using Local web3.');
    }

    web3 = new Web3(provider)

    resolve(web3)
  })
})

export default getWeb3
