import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
import "hardhat-abi-exporter";
import type { HardhatUserConfig } from "hardhat/config";
import type { NetworkUserConfig } from "hardhat/types";
import { resolve } from "path";
import "xdeployer";

import "./tasks/accounts";
import "./tasks/deploy";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

const isProduction = process.env.NODE_ENV === "production";

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic && isProduction) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
if (!infuraApiKey && isProduction) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const chainIds = {
  "arbitrum-mainnet": 42161,
  avalanche: 43114,
  bsc: 56,
  goerli: 5,
  hardhat: 31337,
  mainnet: 1,
  "optimism-mainnet": 10,
  "polygon-mainnet": 137,
  "polygon-mumbai": 80001,
};

function getChainConfig(chain: keyof typeof chainIds): NetworkUserConfig {
  let jsonRpcUrl: string;
  switch (chain) {
    case "avalanche":
      jsonRpcUrl = "https://api.avax.network/ext/bc/C/rpc";
      break;
    case "bsc":
      jsonRpcUrl = "https://bsc-dataseed1.binance.org";
      break;
    default:
      jsonRpcUrl = "https://" + chain + ".infura.io/v3/" + infuraApiKey;
  }
  return {
    accounts: {
      count: 10,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  };
}

let liveNetworks = {};
if (mnemonic && infuraApiKey && isProduction) {
  liveNetworks = {
    arbitrum: getChainConfig("arbitrum-mainnet"),
    avalanche: getChainConfig("avalanche"),
    bsc: getChainConfig("bsc"),
    goerli: getChainConfig("goerli"),
    mainnet: getChainConfig("mainnet"),
    optimism: getChainConfig("optimism-mainnet"),
    "polygon-mainnet": getChainConfig("polygon-mainnet"),
    "polygon-mumbai": getChainConfig("polygon-mumbai"),
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY || "",
      avalanche: process.env.SNOWTRACE_API_KEY || "",
      bsc: process.env.BSCSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      optimisticEthereum: process.env.OPTIMISM_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      chainId: chainIds.hardhat,
    },
    ...liveNetworks,
  },
  abiExporter: {
    runOnCompile: true,
    flat: true,
    path: "artifacts/abi",
  },
  xdeploy: {
    contract: "SocketV2Verifier",
    salt: "997780a8bb225dfe670e0503b056ee70bc97b1b59c85d1c53fdcebe28bfd706b",
    signer: process.env.PRIVATE_KEY,
    networks: [
      "ethMain",
      "polygon",
      "gnosis",
      "arbitrumMain",
      "fantomMain",
      "optimismMain",
      "avalanche",
      "bscMain",
      "auroraMain",
      "goerli",
      "rinkeby",
      "ropsten",
      "arbitrumTestnet",
      "sokol",
      "mumbai",
    ],
    rpcUrls: [
      "https://main-light.eth.linkpool.io/",
      "https://rpc-mainnet.matic.network",
      "https://rpc.xdaichain.com",
      "https://arb1.arbitrum.io/rpc",
      "https://rpc.ftm.tools",
      "https://mainnet.optimism.io/",
      "https://rpc.ankr.com/avalanche",
      "https://bsc-dataseed1.binance.org",
      "https://mainnet.aurora.dev",
      "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      "https://rpc.ankr.com/eth_rinkeby",
      "https://rpc.ankr.com/eth_ropsten	",
      "https://rinkeby.arbitrum.io/rpc",
      "https://sokol.poa.network",
      "https://matic-mumbai.chainstacklabs.com",
    ],
    gasLimit: 1.2 * 10 ** 6,
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.15",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/hardhat-template/issues/31
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  typechain: {
    outDir: "src/types",
    target: "ethers-v5",
  },
};

export default config;
