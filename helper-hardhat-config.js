const networkConfig = {
  31337: {
    name: "localhost",
    subscriptionId: "588",
    gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", // 30 gwei
    keepersUpdateInterval: "30",
    raffleEntranceFee: "100000000000000000", // 0.1 ETH
    callbackGasLimit: "500000", // 500,000 gas
    // mintFee: '100000000000000000000', //0.01
    mintFee: "00000000000001", //0.01
  },
  mintFee: "10000000000000000", // 0.01 ETH
  4: {
    name: "goerli",
    subscriptionId: "6430",
    gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // 30 gwei
    keepersUpdateInterval: "30",
    raffleEntranceFee: "100000000000000000", // 0.1 ETH
    callbackGasLimit: "500000", // 500,000 gas
    vrfCoordinatorV2: "0x2ca8e0c643bde4c2e08ab1fa0da3401adad7734d",
    mintFee: "10000000000000000", // 0.01 ETH
    ethUsdPrice: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
  },
  1: {
    name: "mainnet",
    keepersUpdateInterval: "30",
  },
}

const developmentChains = ['hardhat', 'localhost']

module.exports = {
  networkConfig,
  developmentChains,
}