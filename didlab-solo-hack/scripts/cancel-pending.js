const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const address = await signer.getAddress();
  const provider = signer.provider;

  const latestNonce = await provider.getTransactionCount(address, "latest");
  const pendingNonce = await provider.getTransactionCount(address, "pending");

  console.log("address:", address);
  console.log("latest nonce:", latestNonce);
  console.log("pending nonce:", pendingNonce);

  if (pendingNonce <= latestNonce) {
    console.log("No pending transactions to cancel.");
    return;
  }

  const gasPriceGwei = process.env.GAS_PRICE_GWEI || "20";
  const gasPrice = hre.ethers.utils.parseUnits(gasPriceGwei, "gwei");
  const gasLimit = hre.ethers.BigNumber.from(process.env.GAS_LIMIT || "21000");

  console.log("Using gasPrice (gwei):", gasPriceGwei);
  console.log("Using gasLimit:", gasLimit.toString());

  const txs = [];
  for (let nonce = latestNonce; nonce < pendingNonce; nonce++) {
    console.log(`Sending cancel tx for nonce ${nonce}...`);
    const tx = await signer.sendTransaction({
      to: address,
      value: 0,
      nonce,
      gasPrice,
      gasLimit,
    });
    console.log(`  tx hash: ${tx.hash}`);
    txs.push(tx);
  }

  for (const tx of txs) {
    console.log(`Waiting for confirmation ${tx.hash}...`);
    await tx.wait();
    console.log(`  confirmed ${tx.hash}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
