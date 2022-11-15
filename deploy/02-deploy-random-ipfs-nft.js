const { network } = require('hardhat')
const { networkConfig, developmentChains } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')
const { storeImages, storeTokenUriMetadata } = require('../utils/uploadToPinata')

const imagesLocation = './images/randomNft'

const metadataTemplate = {
  name: '',
  description: '',
  image: '',
  attributes: [{ trait_type: 'Cuteness', value: 100 }],
}

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
  log('------------------------------------------------------------------>')

  arguments = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId]['gasLane'],
    networkConfig[chainId]['mintFee'],
    networkConfig[chainId]['callbackGasLimit'],
    tokenUris,
  ]
  const randomIpfsNft = await deploy('RandomIpfsNft', {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
    log('------------------------------------------------------------------')

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
      log('Verifying.....')
      await verify(randomIpfsNft.address, arguments)
    }
}

async function handleTokenUris() {
  tokenUris = []
  // Store the image in IPFS
  // Store the metadata in IPFS
  const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
  for (imageUploadResponseIndex in imageUploadResponses) {
    // create metadata
    // upload the metadata
    let tokenUriMetadata = { ...metadataTemplate }
    // pug.png, st-bernard.png
    tokenUriMetadata.name = files[imageUploadResponseIndex].replace('.png', '')
    tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
    console.log(
      '%c Uploading ',
      'color: white; background-color: #61dbfb',
      `${tokenUriMetadata.name}..`
    )
    console.log(`Uploading ${tokenUriMetadata.name}...`)
    // store the JSON to pinata
    const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
  }
  console.log('%c Token URIs Uploaded', 'color: white; background-color: #61dbfb', 'they are ')
  console.log(tokenUris)
  return tokenUris
}

module.exports.tags = ['all', 'randomipfs', 'main']