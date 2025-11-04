const hre = require("hardhat");
require("dotenv").config();

async function main(){
  const badgeAddress = "0xfccA47616fEF20026A093d7e2a98001d1a30F889";
  const tokenURI = "ipfs://QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks";

  const [signer] = await hre.ethers.getSigners();
  console.log("Minting with account:", signer.address);

  const Badge = await hre.ethers.getContractAt("DidLabBadge", badgeAddress);

  const gasPriceGwei = process.env.GAS_PRICE_GWEI || "20";
  const gasPrice = hre.ethers.utils.parseUnits(gasPriceGwei, "gwei");

  let gasLimit;
  if (process.env.GAS_LIMIT) {
    gasLimit = hre.ethers.BigNumber.from(process.env.GAS_LIMIT);
  } else {
    const estimate = await Badge.estimateGas.mintTo(signer.address, tokenURI);
    gasLimit = estimate.mul(120).div(100); // 20% buffer
  }

  console.log("Minting NFT with tokenURI:", tokenURI);
  console.log("Using gasPrice (gwei):", gasPriceGwei);
  console.log("Using gasLimit:", gasLimit.toString());
  const tx = await Badge.mintTo(signer.address, tokenURI, { gasPrice, gasLimit });
  const receipt = await tx.wait();

  console.log("tx:", receipt.hash);

  const tokenId = await Badge.nextId() - 1n;
  console.log("tokenId:", tokenId.toString());

  const confirmedURI = await Badge.tokenURI(tokenId);
  console.log("tokenURI:", confirmedURI);
}

main().catch(e=>{console.error(e); process.exit(1);});
