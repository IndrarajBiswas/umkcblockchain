# Assignment 3 — Build, Deploy & Operate a Production-Style ERC-20 on DIDLab

This directory ships a Hardhat v3 + Viem workflow that covers the Assignment 3
brief: deploy an OpenZeppelin-based ERC-20 to DIDLab, operate it with multiple
EIP-1559 fee strategies, and capture analysis artifacts. While the DIDLab RPC was
unavailable, the entire flow was executed against a local Hardhat node to keep
scripts, outputs, and documentation ready for a live retry.

## Prerequisites

- Node.js 22 LTS (`node -v` → `v22.x`).
- Access to a DIDLab RPC endpoint, chain ID, and funded private key.

## Setup

```bash
npm install
cp .env.example .env
# fill in RPC_URL, CHAIN_ID, PRIVATE_KEY, and optional helper vars
```

## Local Node (Fallback)

When DIDLab is offline, spin up a local chain that mirrors the assignment flow:

```bash
npx hardhat node --hostname 127.0.0.1 --port 8545
```

Update `.env` with `RPC_URL=http://127.0.0.1:8545` and `CHAIN_ID=31337` to point
scripts at the local network.

## Deploy

```bash
npx hardhat run scripts/deploy.ts --network didlab
```

The script deploys `CampusCredit` with a 1,000,000 token initial supply and prints
the contract address plus deployer account.

## Operate (Transfers & Approval)

```bash
export TOKEN_ADDRESS=0xYourCampusCreditAddress
export ACCT2=0xTeammateAddress
npx hardhat run scripts/interact.ts --network didlab
```

Three transactions are issued with distinct priority tips:
1. Transfer 100 CAMP (1 gwei tip)
2. Transfer 50 CAMP (3 gwei tip)
3. Approve 25 CAMP (2 gwei tip)

Hashes and post-transaction balances are written to `interact-output-local.txt`.

## Analyze

```bash
export TX1_HASH=0x...
export TX2_HASH=0x...
export TX3_HASH=0x...
npx hardhat run scripts/analyze.ts --network didlab
```

The analyzer records base fee vs. effective gas, total fees, and decoded events.
Console output is mirrored to `analyze-output-local.txt` for the report.

## Submission Checklist

- `contracts/CampusCredit.sol`
- `scripts/deploy.ts`, `scripts/interact.ts`, `scripts/analyze.ts`
- `.env.example` (keep the real `.env` local)
- `deploy-output-local.txt`, `interact-output-local.txt`, `analyze-output-local.txt`
- `report.md` with the collected data
- Screenshots demonstrating node, deploy, interact, and analyze runs
