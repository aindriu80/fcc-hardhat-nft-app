require('@nomiclabs/hardhat-waffle')
require('hardhat-gas-reporter')
require('@nomiclabs/hardhat-etherscan')
require('dotenv').config()
require('solidity-coverage')
require('hardhat-deploy')

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || ''
const GOERLI_RPC_URL =
  process.env.GOERLI_RPC_URL ||
  'https://eth-goerli.alchemyapi.io/v2/0xdedfd3b96df81882c95a44ded7049debe02aa691'
  // 'https://goerli.etherscan.io/tx/0xa850f81eb847fca5c2a3378abe3799fb5eb66f1ed6a58bd1c2b9f02e3e1d3ef7'
const PRIVATE_KEY =
  process.env.PRIVATE_KEY || '0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a'
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ''

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.8',
      },
      {
        version: '0.8.7',
      },
      {
        version: '0.6.6',
      },
      {
        version: '0.6.12',
      },
      {
        version: '0.4.19',
      },
    ],
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    localhost: {
      chainId: 31337,
    },
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    outputFile: 'gas-report.txt',
    noColors: true,
    // coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
}
