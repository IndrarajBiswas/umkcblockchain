import { artifacts } from "hardhat";
import { createWalletClient, createPublicClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const RPC_URL = process.env.RPC_URL!;
const CHAIN_ID = Number(process.env.CHAIN_ID!);
const PRIVATE_KEY_RAW = (process.env.PRIVATE_KEY || "").replace(/^0x/, "");

async function main() {
  if (!RPC_URL || !CHAIN_ID || !PRIVATE_KEY_RAW) {
    throw new Error("Missing env RPC_URL/CHAIN_ID/PRIVATE_KEY");
  }

  const { abi, bytecode } = await artifacts.readArtifact("CampusCredit");

  const chain = {
    id: CHAIN_ID,
    name: `didlab-${CHAIN_ID}`,
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] } },
  } as const;

  const account = privateKeyToAccount(`0x${PRIVATE_KEY_RAW}`);
  const wallet = createWalletClient({ account, chain, transport: http(RPC_URL) });
  const publicClient = createPublicClient({ chain, transport: http(RPC_URL) });

  const initialSupply = parseUnits("1000000", 18);

  const hash = await wallet.deployContract({ abi, bytecode, args: [initialSupply] });
  console.log("Deploy tx:", hash);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const address = receipt.contractAddress!;

  console.log("CampusCredit deployed at:", address);
  console.log("Deployer:", account.address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
