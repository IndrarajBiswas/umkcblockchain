const hre = require("hardhat");

async function main() {
  const badgeAddress = "0xfccA47616fEF20026A093d7e2a98001d1a30F889";
  const badge = await hre.ethers.getContractAt("DidLabBadge", badgeAddress);

  const latest = await hre.ethers.provider.getBlockNumber();
  const fromBlockEnv = process.env.FROM_BLOCK;
  const defaultSpan = 5000;
  const fromBlock = fromBlockEnv
    ? Number(fromBlockEnv)
    : Math.max(0, latest - defaultSpan);

  console.log("Querying Transfer events from block", fromBlock, "to", latest);
  const filter = badge.filters.Transfer();
  const events = await badge.queryFilter(filter, fromBlock, "latest");

  if (events.length === 0) {
    console.log("No transfer events found.");
    return;
  }

  for (const evt of events) {
    console.log({
      blockNumber: evt.blockNumber,
      transactionHash: evt.transactionHash,
      from: evt.args.from,
      to: evt.args.to,
      tokenId: evt.args.tokenId.toString(),
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
