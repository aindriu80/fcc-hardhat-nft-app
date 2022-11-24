const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

const BASE_FEE = ethers.utils.parseEther("0.25") //0.25 is the premium. It costs 0.25 LINK per request
const GAS_PRICE_LINK = 1e9 // 100000000 // link per gas. Calcuated value based on the gas price of the chain.

module.exports = async function ({ getNamedAccount, deployments }) {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = network.config.chainId
  let etherUsdPriceAddress

  if (developmentChains.includes(network.name)) {
    const EthUsdAggregator = await ethers.getContract("MockV3Aggregator")
    ethUsdPriceAddress = EthUsdAggregator.address
  } else {
    ethUsdPriceAddress = networkConfig[chainId].ethUsdPriceAddress
  }
  console.log("-----------------------------------------------------------------------")

  const lowSVG = await fs.readFileSync("./images/dynamicNft/frown.svg", { encoding: "utf8" })
  const highSVG = await fs.readFileSync("./images/dynamicNft/happy.svg", { encoding: "utf8" })
  args = [ethUsdPriceAddress, lowSVG, highSVG]
  const dynamicSvgNft = await deploy("DynamicSvgNft", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying.....")
    await verify(dynamicSvgNft.address, args)
  }
}

module.exports.tags = ["all", "dynamicSvgNft", "main"]
