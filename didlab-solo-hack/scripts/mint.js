const hre = require("hardhat");
const fs = require("fs");
require("dotenv").config();

async function main(){
  const badgeAddress = "0xfccA47616fEF20026A093d7e2a98001d1a30F889";
  const tokenURI = "ipfs://QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks";

  const [signer] = await hre.ethers.getSigners();
  console.log("Minting with account:", signer.address);

  const Badge = await hre.ethers.getContractAt("DidLabBadge", badgeAddress);

  console.log("Minting NFT with tokenURI:", tokenURI);
  const tx = await Badge.mintTo(signer.address, tokenURI);
  const receipt = await tx.wait();

  console.log("tx:", receipt.hash);

  const tokenId = await Badge.nextId() - 1n;
  console.log("tokenId:", tokenId.toString());

  const confirmedURI = await Badge.tokenURI(tokenId);
  console.log("tokenURI:", confirmedURI);
}

main().catch(e=>{console.error(e); process.exit(1);});
