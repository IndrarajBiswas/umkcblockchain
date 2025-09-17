# Assignment 2 – CampusCredit on DIDLab

This repo follows the "Assignment 2 — Analyze Transactions on DIDLab" brief. It contains:

- Hardhat v3 configuration with Viem and the Node.js test runner.
- `CampusCredit` ERC‑20 contract (OpenZeppelin based).
- TypeScript scripts for deploying, interacting (2 transfers + 1 approval with different tips), and analyzing transactions (fees + events).
- Report + screenshot placeholders for the final submission package.

## Prerequisites

- Node.js 22 LTS (`node -v` → `v22.x`).
- An assigned DIDLab RPC URL, chain ID, and faucet private key.

## Setup

```bash
npm install
cp .env.example .env
# edit .env with your team’s RPC_URL, CHAIN_ID, PRIVATE_KEY, etc.
```

## Compile

```bash
npx hardhat compile
```

## Deploy to DIDLab

```bash
npx hardhat run scripts/deploy.ts --network didlab
```

Record the contract address printed by the script. You will paste it into `scripts/interact.ts` (or export `TOKEN_ADDRESS`) and the report.

## Generate Transactions

```bash
# Optionally export ACCT2 to send tokens to your teammate’s address.
export TOKEN_ADDRESS=0xYourCampusCreditAddress
export ACCT2=0xTeammateAddress
npx hardhat run scripts/interact.ts --network didlab
```

This produces three hashes (two transfers + one approval) with different EIP‑1559 tips. Save them for the analyze step and the report.

## Analyze Fees & Logs

```bash
export TX1_HASH=0x...
export TX2_HASH=0x...
export TX3_HASH=0x...
npx hardhat run scripts/analyze.ts --network didlab
```

Copy the console output into `report.md` (Parts B–D) and take the required terminal screenshots for submission.

## Optional

- `screenshots/npx hardhat run scripts/` contains the four terminal captures required for submission.
- `report.md` is scaffolded with all prompts from the assignment; fill it in before pushing to GitHub.
- To clear local artifacts: `rm -rf cache artifacts`.

## Repo Checklist (per assignment)

- `contracts/CampusCredit.sol`
- `scripts/deploy.ts`
- `scripts/interact.ts`
- `scripts/analyze.ts`
- `hardhat.config.ts`
- `.gitignore`
- `.env` (untracked), `.env.example`
- `report.md`
- `screenshots/`
