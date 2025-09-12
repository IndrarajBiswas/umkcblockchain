// hardhat.config.ts
import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import type { HardhatUserConfig } from "hardhat/config";

const CHAIN_ID = Number(process.env.CHAIN_ID ?? 31337);

// Pull from .env (fail fast if missing when using didlab)
const RPC_URL = process.env.RPC_URL;
const PRIVKEY = process.env.PRIVKEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainId: CHAIN_ID,
      initialBaseFeePerGas: 1_000_000_000,
    },
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
      chainId: CHAIN_ID,
    },
    // Remote RPC (DIDLab)
    didlab: {
      type: "http",
      // Hardhat v3 expects a real URL object or a Configuration Variable.
      // We use a real URL object built from .env:
      url: RPC_URL ? new URL(RPC_URL) : undefined,
      chainId: CHAIN_ID,
      accounts: PRIVKEY ? [PRIVKEY] : [],
    },
  },
};

export default config;
