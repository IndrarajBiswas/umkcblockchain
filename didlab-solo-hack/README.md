# DIDLab Solo Hackathon — Proof-of-Build

This repository contains a complete implementation of an ERC-721 NFT badge system on the DIDLab blockchain (chainId 252501), demonstrating SIWE authentication, IPFS integration, and smart contract deployment.

## Project Summary

- **Blockchain**: DIDLab EVM (chainId 252501)
- **RPC Endpoint**: https://eth.didlab.org
- **API Endpoint**: https://api.didlab.org

## On-Chain Evidence

- **Network**: DIDLab EVM (chainId 252501)
- **Contract Address**: `0xfccA47616fEF20026A093d7e2a98001d1a30F889`
- **Mint Tx Hash**: `0x30fabb6f523cc0962bfae64f15cb23a3d7f87a4b76a20bb911fae463a04668f3`
- **Token ID**: `1`
- **Token URI**: `ipfs://QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks`
- **Image CID**: `QmWqaMUoDryUA8Gsm6EV9DEimeAedgANGhLZBj7651JFcN`
- **Metadata CID**: `QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks`
- **Owner**: `0x41BAc3886F5ba782416E0324A9E84CFDfd85b9DA`

## Gateway URLs

- **Image**: https://gateway.didlab.org/ipfs/QmWqaMUoDryUA8Gsm6EV9DEimeAedgANGhLZBj7651JFcN
- **Metadata**: https://gateway.didlab.org/ipfs/QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks

## Evidence Screenshots

![Mint transaction on explorer](evidence/screenshots/Minted%20NFTs.PNG)

![IPFS metadata JSON showing image field](evidence/screenshots/json%20output.PNG)

## Repository Structure

```
.
├── contracts/
│   └── DidLabBadge.sol          # ERC-721 NFT contract
├── scripts/
│   ├── deploy.js                 # Contract deployment script
│   ├── mint.js                   # NFT minting script
│   └── sign.js                   # SIWE message signing
├── assets/
│   └── badge.webp                # Badge image
├── evidence/
│   └── onchain.txt               # On-chain evidence (addresses, CIDs, tx hashes)
├── logs/
│   └── console.txt               # Complete execution log
├── metadata.json                 # NFT metadata (uploaded to IPFS)
├── hardhat.config.js             # Hardhat configuration
└── .env.example                  # Environment variable template
```

## How to Run

### Prerequisites
- Node.js 18+
- npm
- A wallet with gas on DIDLab network (chainId 252501)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env and add your PRIVATE_KEY
   ```

### Deploy Contract

```bash
npx hardhat run scripts/deploy.js --network didlab
```

### Mint NFT

1. Update `scripts/mint.js` with your contract address and token URI
2. Run:
   ```bash
   npx hardhat run scripts/mint.js --network didlab
   ```

## Technical Implementation

### 1. Smart Contract

- **DidLabBadge**: ERC-721 compliant NFT contract with custom tokenURI storage
- Built with OpenZeppelin contracts v4.9.0
- Solidity 0.8.20

### 2. SIWE Authentication

- Prepared challenge via `/v1/siwe/prepare`
- Signed message with ethers.js Wallet
- Obtained 6-hour JWT token via `/v1/siwe/verify`

### 3. IPFS Integration

- Uploaded badge image (17KB WebP)
- Created and uploaded ERC-721 metadata JSON
- Files pinned on DIDLab managed IPFS node

### 4. NFT Minting

- Minted token with `ipfs://` URI pointing to metadata
- Metadata references image via IPFS CID

## Reflection

SIWE authentication and the Hardhat deployment pipeline worked smoothly once I locked in the correct RPC endpoint and toolbox version. IPFS uploads through the DIDLab gateway were reliable and the on-chain metadata resolved immediately in wallets. The biggest friction came from slow block times—several mint attempts piled up in the mempool until I replaced them with higher-gas transactions.

## License

ISC
