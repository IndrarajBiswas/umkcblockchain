import { network } from "hardhat";
import { parseUnits, formatUnits } from "viem";

const TOKEN = process.env.TOKEN_ADDRESS!; // export TOKEN_ADDRESS=0x... before running

async function main() {
  const { viem } = await network.connect();
  const [deployer, acct2] = await viem.getWalletClients();

  const token = await viem.getContractAt("CampusCredit", TOKEN, {
    client: { wallet: deployer },
  });

  const before = await token.read.balanceOf([acct2.account.address]);
  console.log("Acct2 before:", formatUnits(before, 18), "CAMP");

  const tx = await token.write.transfer([acct2.account.address, parseUnits("100", 18)]);
  await (await viem.getPublicClient()).waitForTransactionReceipt({ hash: tx });

  const after = await token.read.balanceOf([acct2.account.address]);
  console.log("Acct2 after:", formatUnits(after, 18), "CAMP");
}

main().catch((e) => { console.error(e); process.exit(1); });
