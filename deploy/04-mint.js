const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async function ({ getNamedAccounts }) {
  const { deployer } = await getNamedAccounts()

  // Basic NFT
  const basicNFT = await ethers.getContract("BasicNFT", deployer)
  const basicMintTx = await basicNFT.mintNft()
  await basicMintTx.wait(1)
  console.log(`Basic NFT index 0 has tokenURI:  ${await basicNFT.tokenURI(0)}`)

  // Random IPPS NFT
  const randomIpfsNft = await ethers.getContract("RandomIpfsNft", deployer)
  const mintFee = await randomIpfsNft.getMintFee()

  await new Promise(async (resolve, reject) => {
    setTimeout(resolve, 300000) // 5 minutes to resolve
    randomIpfsNft.once("NftMinted", async function () {
      resolve()
    })
    const randomIpfsNftMintTx = await randomIpfsNft.requestNft({ value: mintFee.toString() })
    const randomIpfsNftMintTxReceipt = await randomIpfsNftMintTx.wait(1)
    if (developmentChains.includes(network.name)) {
      const requestId = randomIpfsNftMintTxReceipt.events[1].args.requestId.toString()
      const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
      await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomIpfsNft.address)
    }
  })
  console.log(`Random IPFS NFT index 0 tokenURI: ${await randomIpfsNft.tokenURI(0)}`)

  // Dynamci SVG NFT
  const highValue = ethers.utils.parseEther("4000")
  const dynamicSvgNft = await ethers.getContract("DynamicSVGNFT", deployer)
  const dynamicSvgNftMintTx = await dynamicSvgNft.mintNft(highValue.toString())
  await dynamicSvgNftMintTx.wait(1)
  console.log(`Dynamic SVG NFT index 0 tokenURI: ${await dynamicSvgNft.token(0)}`)
}
