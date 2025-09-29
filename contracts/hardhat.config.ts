import type { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import hardhatKeystore from "@nomicfoundation/hardhat-keystore";
import { configVariable } from "hardhat/config";

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxMochaEthersPlugin, hardhatKeystore],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  ignition: {
    requiredConfirmations: 1
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    rewardsChain: {
      type: "http",
      url: "http://localhost:3450",
      chainType: "generic",
      accounts: [configVariable("WALLET_PRIVATE_KEY")],
    },
    stakingChain1: {
      type: "http",
      url: "http://localhost:3050",
      chainType: "generic",
      accounts: [configVariable("WALLET_PRIVATE_KEY")],
    },
    stakingChain2: {
      type: "http",
      url: "http://localhost:3350",
      chainType: "generic",
      accounts: [configVariable("WALLET_PRIVATE_KEY")],
    },
    zksyncGateway: {
      type: "http",
      url: "http://localhost:3150",
      chainType: "generic",
    },
  },
};

export default config;
