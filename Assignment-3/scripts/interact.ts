import { artifacts } from "hardhat";
import {
  createWalletClient,
  createPublicClient,
  http,
  parseUnits,
  formatUnits,
  getAddress,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

const RPC_URL = process.env.RPC_URL!;
const CHAIN_ID = Number(process.env.CHAIN_ID!);
const PRIVATE_KEY_RAW = (process.env.PRIVATE_KEY || "").replace(/^0x/, "");
const TOKEN = process.env.TOKEN_ADDRESS || "<PASTE_DEPLOYED_ADDRESS>";
const DECIMALS = 18;
const ACCT2 = (process.env.ACCT2 || "").trim();

async function main() {
  if (!RPC_URL || !CHAIN_ID || !PRIVATE_KEY_RAW) {
    throw new Error("Missing envs");
  }
  if (!TOKEN || TOKEN === "<PASTE_DEPLOYED_ADDRESS>") {
    throw new Error("Set TOKEN in scripts/interact.ts or TOKEN_ADDRESS env var");
  }

  const { abi } = await artifacts.readArtifact("CampusCredit");
  const chain = {
    id: CHAIN_ID,
    name: `didlab-${CHAIN_ID}`,
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] } },
  } as const;

  const account = privateKeyToAccount(`0x${PRIVATE_KEY_RAW}`);
  const wallet = createWalletClient({ account, chain, transport: http(RPC_URL) });
  const publicClient = createPublicClient({ chain, transport: http(RPC_URL) });

  const acct2 = ACCT2 || account.address;

  const balances = async (label: string) => {
    const b1 = await publicClient.readContract({
      address: getAddress(TOKEN),
      abi,
      functionName: "balanceOf",
      args: [account.address],
    });
    const b2 = await publicClient.readContract({
      address: getAddress(TOKEN),
      abi,
      functionName: "balanceOf",
      args: [acct2],
    });
    console.log(
      `${label} | Deployer: ${formatUnits(b1 as bigint, DECIMALS)} CAMP | Acct2: ${formatUnits(
        b2 as bigint,
        DECIMALS,
      )} CAMP`,
    );
  };

  await balances("Before");

  const tx1 = await wallet.writeContract({
    address: getAddress(TOKEN),
    abi,
    functionName: "transfer",
    args: [acct2, parseUnits("100", DECIMALS)],
    maxPriorityFeePerGas: 1_000_000_000n,
    maxFeePerGas: 20_000_000_000n,
  });
  console.log("Tx1 hash:", tx1);
  const rcpt1 = await publicClient.waitForTransactionReceipt({ hash: tx1 });
  console.log("Tx1 mined in block:", rcpt1.blockNumber);

  const tx2 = await wallet.writeContract({
    address: getAddress(TOKEN),
    abi,
    functionName: "transfer",
    args: [acct2, parseUnits("50", DECIMALS)],
    maxPriorityFeePerGas: 3_000_000_000n,
    maxFeePerGas: 22_000_000_000n,
  });
  console.log("Tx2 hash:", tx2);
  const rcpt2 = await publicClient.waitForTransactionReceipt({ hash: tx2 });
  console.log("Tx2 mined in block:", rcpt2.blockNumber);

  const tx3 = await wallet.writeContract({
    address: getAddress(TOKEN),
    abi,
    functionName: "approve",
    args: [acct2, parseUnits("25", DECIMALS)],
    maxPriorityFeePerGas: 2_000_000_000n,
    maxFeePerGas: 21_000_000_000n,
  });
  console.log("Tx3 hash:", tx3);
  const rcpt3 = await publicClient.waitForTransactionReceipt({ hash: tx3 });
  console.log("Tx3 mined in block:", rcpt3.blockNumber);

  await balances("After");

  console.log("HASHES:", JSON.stringify({ tx1, tx2, tx3 }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
