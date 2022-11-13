const { network } = require('hardhat')
const { networkConfig, developmentChains } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')
const { storeImages } = require('../utils/uploadToPinata')

const imagesLocation = './images/randomNft'

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  let tokenUris
  // get the IPFS hashes of our images
  if (process.env.UPLOAD_TO_PINATA == 'true') {
    tokenUris = await handleTokenUris()
  }

  // 1.  With our own IPFS node.  https://docs.ipfs.io/
  // 2.  Pinata https://www.pinata.cloud/
  // 3.  NFT.storage https://nft.storage/

  let vrfCoordinatorV2Address, subscriptionId

  if (!developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getcontract('VRFCoordinatorV2Mock')
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
    const tx = await vrfCoordinatorV2Mock.createSubscription()
    const txReceipt = await tx.wait(1)
    subscriptionId = txReceipt.event[0].args.subId
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
    subscriptionId = networkConfig[chainId].subscriptionId
  }
  log('------------------------------------------------------------------')
  await storeImages(imagesLocation)

  //   const args = [
  //     vrfCoordinatorV2Address,
  //     subscriptionId,
  //     networkConfig[chainId].gasLane,
  //     networkConfig[chainId].mintFee,
  //     networkConfig[chainId].callbackGasLimit,
  //     // tokenUris,
  //     networkConfig[chainId].mintFee,
  //   ]
}

async function handleTokenUris() {
  tokenUris = []
  // Store the image in IPFS
  // Store the metadata in IPFS

  return tokenUris
}

module.exports.tags = ['all', 'randomipfs', 'main']