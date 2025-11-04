const hre = require("hardhat");

async function main() {
  const badgeAddress = "0xfccA47616fEF20026A093d7e2a98001d1a30F889";
  const badge = await hre.ethers.getContractAt("DidLabBadge", badgeAddress);

  const nextId = await badge.nextId();
  const nextIdNum = Number(nextId);
  console.log("nextId:", nextId.toString());

  for (let tokenId = 1; tokenId < nextIdNum; tokenId++) {
    const owner = await badge.ownerOf(tokenId);
    const uri = await badge.tokenURI(tokenId);
    console.log(`ownerOf(${tokenId}):`, owner);
    console.log(`tokenURI(${tokenId}):`, uri);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
