const { network } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  let vrfCoordinatorV2Address, subscriptionId

  if (deploymentsChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getcontract('VRFCoordinatorV2Mock')
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
    const tx = await vrfCoordinatorV2Mock.createSubscription()
    const txReceipt = await tx.wait(1)
    subscriptionId = txReceipt.event[0].args.subId
  } else {
    vrfCoordinatorV2Address = nextworkConfig[chainId].vrfCoordinatorV2
    subscriptionId = networkConfig[chainId].subscriptionId
  }
  log('------------------------------------------------------------------')
  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId].gasLane,
    networkConfig[chainId].mintFee,
    networkConfig[chainId].callbackGasLimit,
    // tokenUris,
    networkConfig[chainId].mintFee,
  ]
}
