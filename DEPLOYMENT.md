# 🚀 DIDLab TrustNet Deployment Guide

Complete guide for deploying smart contracts to the DIDLab TrustNet public blockchain.

## 📋 Table of Contents

- [Network Information](#network-information)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Process](#deployment-process)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## 🌐 Network Information

### DIDLab TrustNet Specifications

| Parameter | Value | Description |
|-----------|-------|-------------|
| **Network Name** | DIDLab TrustNet | Public test network |
| **Chain ID** | `252501` (`0x3DA55` hex) | Unique network identifier |
| **Native Currency** | Trust (TT) | Used for gas fees |
| **RPC Endpoint** | `https://eth.didlab.org` | JSON-RPC API endpoint |
| **WebSocket** | N/A | Not available |
| **Block Explorer** | `https://explorer.didlab.org` | Blockscout instance |
| **Faucet** | `https://faucet.didlab.org` | Get test TT tokens |
| **Block Time** | ~5 seconds | Average block generation |
| **Consensus** | QBFT | Quorum Byzantine Fault Tolerance |
| **Gas Price** | 1.2 gwei (recommended) | Minimum gas price |
| **EVM Version** | Paris | Pre-Shanghai (no PUSH0) |

### Network Characteristics

- ✅ **Public Access**: Open to all developers
- ✅ **Persistent**: Data remains on-chain
- ✅ **Free Testnet**: No real currency required
- ⚠️ **Paris EVM**: Requires `evmVersion: "paris"` in compiler settings
- ⚠️ **Legacy Transactions**: EIP-1559 not supported, use `gasPrice` instead

---

## 🔧 Prerequisites

### Required Software

```bash
# Node.js (v18+ required)
node --version  # Should show v18.0.0 or higher

# NPM (v9+ recommended)
npm --version   # Should show v9.0.0 or higher

# Git
git --version
```

### Required Tools

1. **MetaMask** (Browser Extension)
   - Download: https://metamask.io
   - Used for: Wallet management, transaction signing

2. **Code Editor** (VSCode recommended)
   - Extensions: Solidity, Hardhat

3. **Terminal/CLI Access**

### Get Test Tokens

Before deploying, you need TT (Trust) tokens for gas fees:

1. Visit the faucet: https://faucet.didlab.org
2. Enter your wallet address
3. Request tokens (wait for confirmation)
4. Verify balance in MetaMask or explorer

**Minimum recommended balance:** 0.1 TT for deployments

---

## ⚙️ Environment Setup

### Step 1: Add DIDLab TrustNet to MetaMask

#### Method A: Manual Configuration

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Fill in the following:

```
Network Name: DIDLab TrustNet
RPC URL: https://eth.didlab.org
Chain ID: 252501
Currency Symbol: TT
Block Explorer: https://explorer.didlab.org
```

4. Click "Save"

#### Method B: Using Web3 (Programmatic)

```javascript
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0x3DA55',  // 252501 in hex
    chainName: 'DIDLab TrustNet',
    nativeCurrency: {
      name: 'Trust',
      symbol: 'TT',
      decimals: 18
    },
    rpcUrls: ['https://eth.didlab.org'],
    blockExplorerUrls: ['https://explorer.didlab.org']
  }]
});
```

### Step 2: Export Private Key from MetaMask

⚠️ **SECURITY WARNING**: Never share your private key!

1. Open MetaMask
2. Click account menu (three dots)
3. Select "Account Details"
4. Click "Export Private Key"
5. Enter password
6. Copy the private key (starts with `0x`)

### Step 3: Configure Environment Variables

For each assignment directory (Assignment-2 and Assignment-3):

```bash
# Navigate to assignment directory
cd Assignment-2  # or Assignment-3

# Copy the example environment file
cp .env.example .env

# Edit the .env file
nano .env  # or use your preferred editor
```

**Required .env Configuration:**

```env
# DIDLab TrustNet Connection
RPC_URL=https://eth.didlab.org
CHAIN_ID=252501

# Your Private Key (NEVER commit this!)
PRIVATE_KEY=0xyour_private_key_here

# Assignment-specific configs (varies by assignment)
TOKEN_NAME=CampusCredit
TOKEN_SYMBOL=CAMP
```

**Security Checklist:**
- ✅ `.env` is in `.gitignore`
- ✅ Never commit `.env` to version control
- ✅ Use a test wallet (not your main wallet)
- ✅ Only use testnet tokens

---

## 📦 Deployment Process

### Assignment 2: Basic ERC-20 Token

#### 1. Install Dependencies

```bash
cd Assignment-2
npm install
```

#### 2. Configure Hardhat

The project is already configured for DIDLab TrustNet. Key configuration in `hardhat.config.ts`:

```typescript
solidity: {
  version: "0.8.24",
  settings: {
    optimizer: { enabled: true, runs: 200 },
    evmVersion: "paris"  // Required for DIDLab
  }
}
```

#### 3. Compile Contracts

```bash
npx hardhat compile
```

Expected output:
```
Compiled 1 Solidity file with solc 0.8.24 (evm target: paris)
```

#### 4. Update Static Artifacts

```bash
cp artifacts/contracts/CampusCredit.sol/CampusCredit.json static-artifacts/
```

#### 5. Deploy to DIDLab TrustNet

```bash
npx tsx scripts/deploy.ts
```

Expected output:
```
Deploy tx: 0x...
CampusCredit deployed at: 0x...
Deployer: 0x41BAc3886F5ba782416E0324A9E84CFDfd85b9DA
```

#### 6. Save Contract Address

Update your `.env` file:
```env
TOKEN_ADDRESS=0x<deployed_contract_address>
```

#### 7. Interact with Contract

```bash
# Run interaction script
npx tsx scripts/interact.ts

# Analyze gas costs
npx tsx scripts/analyze.ts
```

---

### Assignment 3: Advanced ERC-20 with Features

#### 1. Install Dependencies

```bash
cd Assignment-3
npm install
```

#### 2. Compile with Paris EVM

```bash
npx hardhat compile
```

#### 3. Update Artifacts

```bash
cp artifacts/contracts/CampusCreditV2.sol/CampusCreditV2.json static-artifacts/
```

#### 4. Deploy CampusCreditV2

```bash
npx tsx scripts/deploy.ts
```

Expected output:
```
Deploying CampusCreditV2...
Deploy tx: 0x...
Deployed at: 0x...
Block: 1256994n

Add this to .env:
TOKEN_ADDRESS=0x...
```

#### 5. Update Environment

Add the deployed address to `.env`:
```env
TOKEN_ADDRESS=0x<deployed_address>
```

#### 6. Run Operations

```bash
# Batch airdrop to multiple addresses
npx tsx scripts/airdrop.ts

# Test transfers and approvals
npx tsx scripts/transfer-approve.ts

# Query event logs
npx tsx scripts/logs-query.ts
```

---

## ✅ Verification

### Method 1: Block Explorer

1. Visit https://explorer.didlab.org
2. Enter your contract address
3. Verify:
   - ✅ Contract bytecode is present
   - ✅ Transactions are visible
   - ✅ Deployer address matches yours

### Method 2: RPC Call

```bash
curl -X POST https://eth.didlab.org \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getCode",
    "params":["0xYOUR_CONTRACT_ADDRESS","latest"],
    "id":1
  }'
```

If deployed successfully, you'll receive bytecode starting with `0x608060405234801561...`

### Method 3: Script Verification

Create a verification script:

```typescript
import { createPublicClient, http } from 'viem';

const client = createPublicClient({
  transport: http('https://eth.didlab.org')
});

const code = await client.getCode({
  address: '0xYOUR_CONTRACT_ADDRESS'
});

console.log('Contract deployed:', code && code.length > 2);
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Issue 1: "Invalid opcode: 0x5f"

**Problem:** Bytecode contains PUSH0 instruction (Solidity 0.8.20+)
**Solution:** Set `evmVersion: "paris"` in Hardhat config

```typescript
// hardhat.config.ts
solidity: {
  version: "0.8.24",
  settings: {
    evmVersion: "paris"  // Add this!
  }
}
```

Then recompile:
```bash
npx hardhat compile
cp artifacts/**/*.json static-artifacts/
```

#### Issue 2: "Invalid transaction type"

**Problem:** Trying to use EIP-1559 transactions
**Solution:** Use legacy transactions with `gasPrice`

```typescript
// Instead of:
maxFeePerGas: 20_000_000_000n,
maxPriorityFeePerGas: 2_000_000_000n,

// Use:
gasPrice: 1_200_000_000n,
```

#### Issue 3: "Insufficient funds"

**Problem:** Not enough TT for gas fees
**Solution:** Get more test tokens

```bash
# Visit faucet
open https://faucet.didlab.org

# Check balance
curl -X POST https://eth.didlab.org \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getBalance",
    "params":["0xYOUR_ADDRESS","latest"],
    "id":1
  }'
```

#### Issue 4: "Nonce too low"

**Problem:** Transaction nonce mismatch
**Solution:** Reset MetaMask account or specify nonce manually

```typescript
// In deployment script
const nonce = await publicClient.getTransactionCount({
  address: account.address
});

await wallet.deployContract({
  abi,
  bytecode,
  args,
  nonce,  // Explicit nonce
  gasPrice: 1_200_000_000n
});
```

#### Issue 5: "Missing env RPC_URL/CHAIN_ID/PRIVATE_KEY"

**Problem:** Environment variables not loaded
**Solution:** Add `import "dotenv/config"` at the top of your script

```typescript
// At the very top of deploy.ts
import "dotenv/config";
```

#### Issue 6: "Connection timeout"

**Problem:** RPC endpoint unreachable
**Solution:** Check network connectivity and RPC URL

```bash
# Test RPC connectivity
curl -X POST https://eth.didlab.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

---

## 🎯 Best Practices

### Development Workflow

1. **Test Locally First**
   ```bash
   # Start local Hardhat node
   npx hardhat node

   # Deploy to local node (in another terminal)
   npx tsx scripts/deploy.ts
   ```

2. **Incremental Deployment**
   - Test on local network
   - Deploy to testnet (DIDLab)
   - Only then consider mainnet

3. **Version Control**
   ```bash
   # Always commit before deploying
   git add .
   git commit -m "Pre-deployment snapshot"
   ```

### Security Practices

1. **Private Key Management**
   - ✅ Use separate test wallet
   - ✅ Never commit `.env` files
   - ✅ Use environment variables
   - ❌ Never hardcode private keys

2. **Transaction Confirmation**
   - Always wait for transaction receipt
   - Verify on block explorer
   - Save transaction hashes

3. **Gas Management**
   - Test gas estimates first
   - Use reasonable gas prices
   - Monitor spending

### Code Quality

1. **Contract Verification**
   - Read contract after deployment
   - Test all functions
   - Document contract addresses

2. **Documentation**
   - Save deployment outputs
   - Screenshot important steps
   - Record transaction hashes

3. **Backup**
   ```bash
   # Save deployment artifacts
   mkdir -p deployments/didlab
   cp .env deployments/didlab/.env.backup
   echo "0xCONTRACT_ADDRESS" > deployments/didlab/address.txt
   ```

---

## 📊 Gas Cost Estimates

| Operation | Estimated Gas | Cost @ 1.2 gwei | Notes |
|-----------|---------------|-----------------|-------|
| Deploy ERC-20 (Basic) | ~800,000 | ~0.00096 TT | Assignment 2 |
| Deploy ERC-20 (Advanced) | ~2,000,000 | ~0.0024 TT | Assignment 3 |
| Transfer | ~50,000 | ~0.00006 TT | Standard transfer |
| Approve | ~45,000 | ~0.000054 TT | Allowance approval |
| Mint (single) | ~70,000 | ~0.000084 TT | Role-based mint |
| Airdrop (10 recipients) | ~350,000 | ~0.00042 TT | Batch operation |

**Budget Recommendation:** 0.1 TT covers all assignments with margin

---

## 🔄 Deployment Checklist

Before deploying, ensure:

- [ ] Node.js v18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` configured with RPC, Chain ID, Private Key
- [ ] MetaMask configured for DIDLab TrustNet
- [ ] Wallet has sufficient TT balance (>0.01 TT)
- [ ] Contracts compiled with Paris EVM (`npx hardhat compile`)
- [ ] Static artifacts updated
- [ ] Git repository is clean (committed changes)

During deployment:

- [ ] Deployment script runs without errors
- [ ] Transaction hash received
- [ ] Contract address obtained
- [ ] Transaction confirmed on explorer

After deployment:

- [ ] Contract address saved to `.env`
- [ ] Verified on block explorer
- [ ] Interaction scripts tested
- [ ] Deployment details documented
- [ ] Screenshots captured

---

## 📚 Reference Commands

### Quick Command Reference

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy to DIDLab
npx tsx scripts/deploy.ts

# Run tests
npm test

# Check node version
node --version

# Clean build artifacts
npx hardhat clean

# Start local node
npx hardhat node

# Get account nonce
cast nonce 0xYOUR_ADDRESS --rpc-url https://eth.didlab.org
```

### Useful RPC Calls

```bash
# Get block number
curl -X POST https://eth.didlab.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Get balance
curl -X POST https://eth.didlab.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xADDRESS","latest"],"id":1}'

# Get transaction count (nonce)
curl -X POST https://eth.didlab.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["0xADDRESS","latest"],"id":1}'

# Get transaction receipt
curl -X POST https://eth.didlab.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params":["0xTX_HASH"],"id":1}'
```

---

## 🆘 Getting Help

### Resources

- **DIDLab Documentation**: https://didlab.org
- **Hardhat Docs**: https://hardhat.org/docs
- **Viem Docs**: https://viem.sh
- **OpenZeppelin**: https://docs.openzeppelin.com
- **Solidity Docs**: https://docs.soliditylang.org

### Support Channels

1. Check this guide's troubleshooting section
2. Review assignment-specific README files
3. Inspect deployment output logs
4. Consult block explorer for transaction details

---

## ✨ Success Criteria

Your deployment is successful when:

✅ **Contract deployed** - Address received and confirmed
✅ **Bytecode on-chain** - Verified via RPC or explorer
✅ **Transactions working** - Can interact with contract functions
✅ **Events emitted** - Logs visible on block explorer
✅ **Documentation complete** - Addresses and hashes recorded

---

**Deployed Contracts from this Guide:**

- **Assignment 2**: `0xcbb54b9fde502e9962f2cb06f9396dc43c7e611d`
- **Assignment 3**: `0x268e178131c6e5a8717ce704aeb687612fadc3bd`

View on Explorer:
- https://explorer.didlab.org/address/0xcbb54b9fde502e9962f2cb06f9396dc43c7e611d
- https://explorer.didlab.org/address/0x268e178131c6e5a8717ce704aeb687612fadc3bd

---

**Last Updated:** November 2025
**Network:** DIDLab TrustNet (Chain ID: 252501)
