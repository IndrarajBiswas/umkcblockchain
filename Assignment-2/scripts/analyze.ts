import { artifacts } from "hardhat";
import { createPublicClient, http, decodeEventLog } from "viem";

const RPC_URL = process.env.RPC_URL!;
const CHAIN_ID = Number(process.env.CHAIN_ID!);

const HASHES = {
  tx1: process.env.TX1_HASH || "<TX_HASH_1>",
  tx2: process.env.TX2_HASH || "<TX_HASH_2>",
  tx3: process.env.TX3_HASH || "<TX_HASH_3>",
} as const;

async function analyze(hash: `0x${string}`, abi: any) {
  const chain = {
    id: CHAIN_ID,
    name: `didlab-${CHAIN_ID}`,
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] } },
  } as const;

  const pc = createPublicClient({ chain, transport: http(RPC_URL) });

  const tx = await pc.getTransaction({ hash });
  const rcpt = await pc.getTransactionReceipt({ hash });
  const block = await pc.getBlock({ blockNumber: rcpt.blockNumber });

  const baseFee = block.baseFeePerGas ?? 0n;
  const gasUsed = rcpt.gasUsed ?? 0n;
  const effective = rcpt.effectiveGasPrice ?? tx.gasPrice ?? 0n;
  const totalFee = gasUsed * effective;

  console.log(`\n=== ${hash} ===`);
  console.log("Status:", rcpt.status === "success" ? "Success" : "Fail");
  console.log("Block:", rcpt.blockNumber);
  console.log("Timestamp (UTC):", new Date(Number(block.timestamp) * 1000).toISOString());
  console.log("From:", tx.from);
  console.log("To:", tx.to);
  console.log("Nonce:", tx.nonce);
  console.log("Gas limit:", tx.gas);
  console.log("Gas used:", gasUsed);
  console.log("Base fee per gas:", baseFee);
  console.log("Max fee per gas:", tx.maxFeePerGas ?? 0n);
  console.log("Max priority fee per gas:", tx.maxPriorityFeePerGas ?? 0n);
  console.log("Effective gas price:", effective);
  console.log("Total fee (wei):", totalFee);

  for (const log of rcpt.logs) {
    try {
      const parsed = decodeEventLog({ abi, data: log.data, topics: log.topics });
      console.log("Event:", parsed.eventName, parsed.args);
    } catch {
      // Not a CampusCredit event
    }
  }
}

async function main() {
  const { abi } = await artifacts.readArtifact("CampusCredit");

  if (HASHES.tx1.startsWith("<")) throw new Error("Set TX1_HASH env var");
  if (HASHES.tx2.startsWith("<")) throw new Error("Set TX2_HASH env var");
  if (HASHES.tx3.startsWith("<")) throw new Error("Set TX3_HASH env var");

  await analyze(HASHES.tx1 as `0x${string}`, abi);
  await analyze(HASHES.tx2 as `0x${string}`, abi);
  await analyze(HASHES.tx3 as `0x${string}`, abi);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
