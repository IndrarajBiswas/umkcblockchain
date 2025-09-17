import "dotenv/config";
import type { HardhatUserConfig } from "hardhat/types";

const RPC_URL = process.env.RPC_URL;
const CHAIN_ID = Number(process.env.CHAIN_ID || "0");

const networks: NonNullable<HardhatUserConfig["networks"]> = {
  hardhat: {
    type: "edr-simulated",
    initialBaseFeePerGas: 1_000_000_000,
  },
};

if (RPC_URL) {
  networks.didlab = {
    type: "http",
    url: RPC_URL,
    chainId: CHAIN_ID,
  };
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks,
};

export default config;
