const { developmentChains } = require('../helper-hardhat-config')

const DECIMALS = "18"
const INITIAL_PRICE = ethers.utils.parseUnits("2000", "ether")

const BASE_FEE = ethers.utils.parseEther('0.25') //0.25 is the premium. It costs 0.25 LINK per request
const GAS_PRICE_LINK = 1e9 // 100000000 // link per gas. Calcuated value based on the gas price of the chain.

module.exports = async function ({ getNamedAccount, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const args = [BASE_FEE, GAS_PRICE_LINK]

  if (developmentChains.includes(network.name)) {
    console.clear()
    console.log(
      '%c Local Network detected ',
      'color: white; background-color: #61dbfb',
      'Deploying Mocks....'
    )
    //  deploy a mock vrfcoordinator...
    await deploy('VRFCoordinatorV2Mock', {
      from: deployer,
      log: true,
      args: args,
    })
    await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    })
    log('Mocks deployed')
    log('------------------------------------------------------------------')
  }
}
module.exports.tags = ['all', 'mocks']
