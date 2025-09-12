import { network } from "hardhat";
import { parseUnits } from "viem";

async function main() {
  const NAME   = process.env.TOKEN_NAME   ?? "DidLabToken";
  const SYMBOL = process.env.TOKEN_SYMBOL ?? "DLAB";
  const SUPPLY = process.env.TOKEN_SUPPLY ?? "1000000";

  const { viem } = await network.connect();

  // 18-decimals supply
  const initial = parseUnits(SUPPLY, 18);

  const token = await viem.deployContract("CampusCredit", [NAME, SYMBOL, initial]);
  console.log("CampusCredit deployed to:", token.address);

  const [deployer] = await viem.getWalletClients();
  const bal = await token.read.balanceOf([deployer.account.address]);
  console.log("Deployer balance (wei):", bal.toString());
}

main().catch((e) => { console.error(e); process.exit(1); });
