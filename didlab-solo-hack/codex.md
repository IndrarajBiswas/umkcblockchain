# DIDLab Solo Hackathon - Continuation Codex

**Last Updated**: 2025-11-04 17:20:00
**Status**: 15/16 tasks complete, awaiting NFT mint confirmation

---

## Current State Summary

### ✅ What's Been Completed

1. **Smart Contract Deployment**
   - Contract: `DidLabBadge` (ERC-721)
   - Address: `0xfccA47616fEF20026A093d7e2a98001d1a30F889`
   - Network: DIDLab (chainId 252501)
   - RPC: `https://eth.didlab.org`
   - Deployer: `0x41BAc3886F5ba782416E0324A9E84CFDfd85b9DA`

2. **SIWE Authentication**
   - JWT token obtained (expires after 6 hours)
   - Token saved in: `jwt-response.json`
   - Signature process: ✅ Working (fixed trailing newline issue)

3. **IPFS Uploads**
   - **Image CID**: `QmWqaMUoDryUA8Gsm6EV9DEimeAedgANGhLZBj7651JFcN`
     - Gateway: https://gateway.didlab.org/ipfs/QmWqaMUoDryUA8Gsm6EV9DEimeAedgANGhLZBj7651JFcN
     - Size: 16,794 bytes (WebP)

   - **Metadata CID**: `QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks`
     - Gateway: https://gateway.didlab.org/ipfs/QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks
     - Size: 563 bytes (JSON)

   - **Token URI**: `ipfs://QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks`

4. **Documentation & Git**
   - README.md: ✅ Complete
   - EVIDENCE.md: ✅ Complete
   - Git committed and pushed to: https://github.com/IndrarajBiswas/umkcblockchain

---

## ⏳ What Remains: NFT Minting

### The Task

Mint token #1 from the `DidLabBadge` contract with the IPFS tokenURI.

### Why It's Pending

- Mint transaction was submitted but got stuck waiting for blockchain confirmation
- DIDLab network has slow block times (~30-60 seconds)
- Transaction may have actually succeeded but receipt wasn't received
- Process was stopped after ~15 minutes of waiting

### Current Mint Script

Location: `scripts/mint.js`

```javascript
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
```

---

## 🚀 How to Complete the Minting

### Step 1: Check If Token Was Already Minted

**IMPORTANT**: Before minting again, verify if the previous transaction succeeded:

```bash
cd /home/indy/umkcblockchain/didlab-solo-hack
npx hardhat console --network didlab
```

In the console:
```javascript
const badge = await ethers.getContractAt("DidLabBadge", "0xfccA47616fEF20026A093d7e2a98001d1a30F889")
const nextId = await badge.nextId()
console.log("Next token ID:", nextId.toString())

// If nextId is 2, token #1 was already minted!
// If nextId is 1, no tokens have been minted yet

// If minted, check the URI:
if (nextId > 1) {
  const uri = await badge.tokenURI(1)
  console.log("Token #1 URI:", uri)
  const owner = await badge.ownerOf(1)
  console.log("Token #1 Owner:", owner)
}
```

### Step 2: Mint the NFT (If Not Already Minted)

#### Option A: Run the Existing Script

```bash
cd /home/indy/umkcblockchain/didlab-solo-hack
npx hardhat run scripts/mint.js --network didlab
```

#### Option B: Mint with Higher Gas (Recommended)

Create `scripts/mint-fast.js`:

```javascript
const hre = require("hardhat");

async function main(){
  const badgeAddress = "0xfccA47616fEF20026A093d7e2a98001d1a30F889";
  const tokenURI = "ipfs://QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks";

  const [signer] = await hre.ethers.getSigners();
  console.log("Minting with account:", signer.address);

  const Badge = await hre.ethers.getContractAt("DidLabBadge", badgeAddress);

  console.log("Minting NFT with tokenURI:", tokenURI);

  // Mint with explicit gas settings
  const tx = await Badge.mintTo(signer.address, tokenURI, {
    gasLimit: 500000,
    gasPrice: ethers.parseUnits('50', 'gwei')
  });

  console.log("TX submitted:", tx.hash);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();
  console.log("tx:", receipt.hash);
  console.log("Block:", receipt.blockNumber);

  const tokenId = await Badge.nextId() - 1n;
  console.log("tokenId:", tokenId.toString());

  const confirmedURI = await Badge.tokenURI(tokenId);
  console.log("tokenURI:", confirmedURI);
}

main().catch(e=>{console.error(e); process.exit(1);});
```

Then run:
```bash
npx hardhat run scripts/mint-fast.js --network didlab
```

#### Option C: Interactive Console (Most Control)

```bash
cd /home/indy/umkcblockchain/didlab-solo-hack
npx hardhat console --network didlab
```

Then run line by line:
```javascript
const [signer] = await ethers.getSigners()
const badge = await ethers.getContractAt("DidLabBadge", "0xfccA47616fEF20026A093d7e2a98001d1a30F889")
const tokenURI = "ipfs://QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks"

// Check balance
const balance = await ethers.provider.getBalance(signer.address)
console.log("Balance:", ethers.formatEther(balance), "ETH")

// Mint
const tx = await badge.mintTo(signer.address, tokenURI, {
  gasLimit: 500000,
  gasPrice: ethers.parseUnits('50', 'gwei')
})
console.log("TX hash:", tx.hash)

// Wait (may take 1-2 minutes)
const receipt = await tx.wait()
console.log("Minted! Block:", receipt.blockNumber)

// Verify
const tokenId = await badge.nextId() - 1n
console.log("Token ID:", tokenId.toString())
const uri = await badge.tokenURI(tokenId)
console.log("Token URI:", uri)
```

### Step 3: Update Evidence After Successful Mint

Once minting succeeds, capture the details:

```bash
# Add to evidence/onchain.txt
echo "MINT_TX=<transaction-hash>" >> evidence/onchain.txt
echo "TOKEN_ID=1" >> evidence/onchain.txt
echo "BLOCK_NUMBER=<block-number>" >> evidence/onchain.txt
```

Update `EVIDENCE.md` with:
- Mint transaction hash
- Block number
- Confirmation that token ID #1 exists

### Step 4: Final Verification

```bash
cd /home/indy/umkcblockchain/didlab-solo-hack
npx hardhat console --network didlab
```

Run comprehensive checks:
```javascript
const badge = await ethers.getContractAt("DidLabBadge", "0xfccA47616fEF20026A093d7e2a98001d1a30F889")

// Check contract state
console.log("Next ID:", (await badge.nextId()).toString())
console.log("Contract name:", await badge.name())
console.log("Contract symbol:", await badge.symbol())

// Check token #1
const tokenId = 1n
const owner = await badge.ownerOf(tokenId)
const uri = await badge.tokenURI(tokenId)
console.log("\nToken #1:")
console.log("  Owner:", owner)
console.log("  URI:", uri)
console.log("  Expected URI:", "ipfs://QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks")
console.log("  URI matches:", uri === "ipfs://QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks")
```

### Step 5: Commit and Push Final Updates

```bash
cd /home/indy/umkcblockchain
git add didlab-solo-hack/evidence/onchain.txt didlab-solo-hack/EVIDENCE.md
git commit -m "Update evidence with successful NFT mint

Token ID: 1
Transaction: <tx-hash>
Block: <block-number>"
git push origin main
```

---

## 📋 Important Files & Locations

### Configuration
- **Project Root**: `/home/indy/umkcblockchain/didlab-solo-hack`
- **Hardhat Config**: `hardhat.config.js`
- **Environment**: `.env` (contains `PRIVATE_KEY`)
- **Contract**: `contracts/DidLabBadge.sol`

### Scripts
- **Deploy**: `scripts/deploy.js`
- **Mint**: `scripts/mint.js`
- **SIWE Sign**: `scripts/sign.js`

### Evidence & Logs
- **On-chain data**: `evidence/onchain.txt`
- **Console logs**: `logs/console.txt`
- **IPFS responses**: `ipfs-image-response.json`, `ipfs-metadata-response.json`

### Documentation
- **README**: `README.md`
- **Evidence**: `EVIDENCE.md`
- **This file**: `codex.md`

---

## 🔧 Troubleshooting

### Problem: "Transaction underpriced"
**Solution**: Increase gas price in the mint call

### Problem: "Insufficient funds"
**Solution**: Check balance with:
```javascript
const balance = await ethers.provider.getBalance(signer.address)
console.log(ethers.formatEther(balance))
```

### Problem: Transaction taking too long
**Solution**:
1. Wait up to 5 minutes (DIDLab is slow)
2. Check if it succeeded using Step 1 verification
3. If stuck, cancel and retry with higher gas

### Problem: "Token already minted" or "Token ID 1 already exists"
**Solution**: The previous transaction succeeded! Verify with Step 1.

### Problem: RPC errors
**Solution**: Ensure you're using `https://eth.didlab.org` not `https://rpc.blockchain.didlab.org`

---

## 🎯 Success Criteria

You'll know minting is complete when:

1. ✅ `badge.nextId()` returns `2` (meaning token #1 exists)
2. ✅ `badge.tokenURI(1)` returns `ipfs://QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks`
3. ✅ `badge.ownerOf(1)` returns `0x41BAc3886F5ba782416E0324A9E84CFDfd85b9DA`
4. ✅ Transaction hash captured in `evidence/onchain.txt`
5. ✅ EVIDENCE.md updated with mint details
6. ✅ Changes committed and pushed to GitHub

---

## 📊 Network Information

- **Network**: DIDLab EVM
- **Chain ID**: 252501
- **RPC**: https://eth.didlab.org
- **Block Explorer**: (if available, add here)
- **Block Time**: ~30-60 seconds (estimate based on observations)

---

## 🔐 Credentials & Keys

- **Wallet Address**: `0x41BAc3886F5ba782416E0324A9E84CFDfd85b9DA`
- **Private Key**: Stored in `.env` file (DO NOT COMMIT)
- **JWT Token**: In `jwt-response.json` (expires in 6 hours from last SIWE auth)

---

## 📦 Quick Reference Commands

```bash
# Navigate to project
cd /home/indy/umkcblockchain/didlab-solo-hack

# Check if token minted
npx hardhat console --network didlab
> const badge = await ethers.getContractAt("DidLabBadge", "0xfccA47616fEF20026A093d7e2a98001d1a30F889")
> await badge.nextId()

# Mint NFT
npx hardhat run scripts/mint.js --network didlab

# Check logs
tail -20 logs/console.txt

# Git status
cd /home/indy/umkcblockchain
git status

# Push changes
git add -A && git commit -m "Complete NFT minting" && git push origin main
```

---

## 🎓 Lessons Learned

1. **SIWE Message Formatting**: Messages must be exactly as returned from `/prepare` endpoint (no trailing newlines)
2. **Hardhat Version**: v2.19.0 required for compatibility (v3.x had issues)
3. **Block Times**: DIDLab network is slow; patience required for transaction confirmations
4. **IPFS Integration**: DIDLab managed IPFS node worked smoothly with proper JWT auth

---

## 👤 Agent Instructions

**Dear Next Agent:**

Your task is simple: **Complete the NFT minting and verify success.**

1. Start by checking if the token was already minted (Step 1 above)
2. If not minted, run the mint script (Step 2)
3. Wait patiently for confirmation (may take 1-5 minutes)
4. Verify the token exists and has correct URI (Step 4)
5. Update evidence files and push to GitHub (Step 5)

The hard work is done. The contract is deployed, IPFS is ready, just need to finalize the mint.

Good luck! 🚀

---

**End of Codex**
