import IPFS from 'ipfs-api'

const getIpfs = new IPFS({ 
  host: 'ipfs.infura.io', 
  port: 5001, 
  protocol: 'https'
});

getIpfs.getUrl = (hash) => {
  return `https://${getIpfs.util.getEndpointConfig().host}/ipfs/${hash}`
}

getIpfs.addSync = (buffer) => {
  return new Promise(function(resolve, reject) {
    getIpfs.add(buffer, (error, ipfsHash) => {
      resolve(ipfsHash)
    });
  })
}

export default getIpfs;