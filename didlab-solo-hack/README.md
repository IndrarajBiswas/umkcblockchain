# DIDLab Solo Hackathon — Proof-of-Build

This repository contains a complete implementation of an ERC-721 NFT badge system on the DIDLab blockchain (chainId 252501), demonstrating SIWE authentication, IPFS integration, and smart contract deployment.

## Project Summary

- **Blockchain**: DIDLab EVM (chainId 252501)
- **RPC Endpoint**: https://eth.didlab.org
- **API Endpoint**: https://api.didlab.org

## Deployed Artifacts

- **Network**: chainId 252501 (DIDLab)
- **Contract Address**: `0xfccA47616fEF20026A093d7e2a98001d1a30F889`
- **Deployer Wallet**: `0x41BAc3886F5ba782416E0324A9E84CFDfd85b9DA`
- **Image CID**: `QmWqaMUoDryUA8Gsm6EV9DEimeAedgANGhLZBj7651JFcN`
- **Metadata CID**: `QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks`
- **Token URI**: `ipfs://QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks`

## Gateway URLs

- **Image**: https://gateway.didlab.org/ipfs/QmWqaMUoDryUA8Gsm6EV9DEimeAedgANGhLZBj7651JFcN
- **Metadata**: https://gateway.didlab.org/ipfs/QmWnZVUUS4yqAvpABNBcrZapYY9RKi9Eh8FSrweZVhvNks

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

**What Worked:**
- Successfully deployed ERC-721 contract to DIDLab network
- SIWE authentication flow worked correctly after fixing message formatting (trailing newline issue)
- IPFS uploads were smooth with the managed DIDLab node
- Complete end-to-end workflow from contract deployment to metadata upload

**Challenges:**
- Initial confusion with RPC endpoints (documented vs. actual: `eth.didlab.org`)
- SIWE message validation required exact character count (no trailing newlines)
- Hardhat version compatibility required downgrading to v2.19.0
- DIDLab blockchain has slower block times than typical testnets

**Key Learnings:**
- Importance of exact message formatting for cryptographic signatures
- Value of structured logging and evidence collection
- Benefits of using managed IPFS services for Web3 applications

## License

ISC
