import "dotenv/config";
import campusCreditV2Artifact from "../static-artifacts/CampusCreditV2.json" assert { type: "json" };
import { createWalletClient, createPublicClient, http, parseUnits, formatUnits, getAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const RPC_URL = process.env.RPC_URL!;
const CHAIN_ID = Number(process.env.CHAIN_ID!);
const PRIVATE_KEY = (process.env.PRIVATE_KEY || "").replace(/^0x/, "");
const TOKEN = process.env.TOKEN_ADDRESS as `0x${string}`;
const RECIPIENT = process.env.RECIPIENT || "";

async function main() {
  if (!RPC_URL || !CHAIN_ID || !PRIVATE_KEY || !TOKEN) throw new Error("Missing env");

  const { abi } = campusCreditV2Artifact as { abi: any };
  const chain = {
    id: CHAIN_ID,
    name: "DIDLab TrustNet",
    nativeCurrency: { name: "Trust", symbol: "TT", decimals: 18 },
    rpcUrls: { default: { http: [RPC_URL] } },
  } as const;

  const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);
  const wallet = createWalletClient({ account, chain, transport: http(RPC_URL) });
  const publicClient = createPublicClient({ chain, transport: http(RPC_URL) });

  const me = getAddress(account.address);
  const you = RECIPIENT ? getAddress(RECIPIENT) : me;

  const balances = async (label: string) => {
    const bMe = (await publicClient.readContract({
      address: TOKEN,
      abi,
      functionName: "balanceOf",
      args: [me],
    })) as bigint;
    const bYou = (await publicClient.readContract({
      address: TOKEN,
      abi,
      functionName: "balanceOf",
      args: [you],
    })) as bigint;
    console.log(`${label} | Me: ${formatUnits(bMe, 18)} CAMP | You: ${formatUnits(bYou, 18)} CAMP`);
  };

  await balances("Before");

  const tx1 = await wallet.writeContract({
    address: TOKEN,
    abi,
    functionName: "transfer",
    args: [you, parseUnits("100", 18)],
    maxPriorityFeePerGas: 1_000_000_000n,
    maxFeePerGas: 20_000_000_000n,
  });
  const r1 = await publicClient.waitForTransactionReceipt({ hash: tx1 });
  const fee1 = r1.gasUsed * (r1.effectiveGasPrice ?? 0n);
  console.log(
    "transfer tx:",
    tx1,
    "block:",
    r1.blockNumber?.toString(),
    "gasUsed:",
    r1.gasUsed.toString(),
    "fee(wei):",
    fee1.toString(),
  );

  const tx2 = await wallet.writeContract({
    address: TOKEN,
    abi,
    functionName: "approve",
    args: [you, parseUnits("50", 18)],
    maxPriorityFeePerGas: 2_000_000_000n,
    maxFeePerGas: 21_000_000_000n,
  });
  const r2 = await publicClient.waitForTransactionReceipt({ hash: tx2 });
  const fee2 = r2.gasUsed * (r2.effectiveGasPrice ?? 0n);
  console.log(
    "approve tx:",
    tx2,
    "block:",
    r2.blockNumber?.toString(),
    "gasUsed:",
    r2.gasUsed.toString(),
    "fee(wei):",
    fee2.toString(),
  );

  const allowance = (await publicClient.readContract({
    address: TOKEN,
    abi,
    functionName: "allowance",
    args: [me, you],
  })) as bigint;
  console.log("allowance:", formatUnits(allowance, 18), "CAMP");

  await balances("After");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
