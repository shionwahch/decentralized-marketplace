import Web3 from 'web3'
import { networks } from '../../truffle'

const localProvider = {
  url: networks.development.host,
  port: networks.development.port
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
      provider = new Web3.providers.HttpProvider(`${localProvider.url}:${localProvider.port}`)

      console.log('No web3 instance injected, using Local web3.');
    }

    web3 = new Web3(provider)

    resolve(web3)
  })
})

export default getWeb3
