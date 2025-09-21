# Assignment 2 – CampusCredit on DIDLab

This assignment follows the “Analyze Transactions on DIDLab” workflow using Hardhat v3 + Viem.
The project deploys a simple ERC‑20 (`CampusCredit`) to the Team 01 DIDLab network, executes a
set of transfers/approvals, and analyzes the resulting on-chain fees and events.

## Prerequisites

- Node.js 22 LTS (`node -v` → `v22.x`)
- DIDLab RPC endpoint, chain ID, and faucet private key (Team 01 → `https://hh-01.didlab.org`, `31337`)

## Setup

```bash
npm install
cp .env.example .env
# fill in RPC_URL, CHAIN_ID, PRIVATE_KEY, ACCT2, etc.
```

`.env.example` is pre-populated with the Team 01 defaults that were used to capture the outputs in
this repo. Member B only needs to drop in their faucet key and reuse the recorded `TOKEN_ADDRESS`.

## Compile

```bash
npx hardhat compile
```

## Deploy to DIDLab

```bash
npx hardhat run scripts/deploy.ts --network didlab | tee deploy-output.txt
```

The deploy script prints the transaction hash, contract address, and deployer. The current run
(deploy hash `0x8874…8f17`) produced `TOKEN_ADDRESS=0x67D269191c92Caf3cd7723F116c85E6E9BF55933`.
Record the address in `.env` for the interaction/analysis steps.

## Generate Transactions

```bash
npx hardhat run scripts/interact.ts --network didlab | tee interact-output.txt
```

This script performs two transfers (100 & 50 CAMP) and one 25 CAMP approval using different
priority fees. The output includes before/after balances for the deployer and teammate plus the
three hashes.

## Analyze Fees & Logs

```bash
export TX1_HASH=0x3510…adec
export TX2_HASH=0xdb22…2a97
export TX3_HASH=0x68f2…66f8
npx hardhat run scripts/analyze.ts --network didlab | tee analyze-output.txt
```

The analyzer pulls block metadata, gas usage, effective fee data, and decodes the ERC‑20 events for
all three transactions. Results are stored in `analyze-output.txt` for inclusion in the report.

## Submission Artifacts

- `contracts/CampusCredit.sol`
- `scripts/deploy.ts`, `scripts/interact.ts`, `scripts/analyze.ts`
- `.env.example` (documented keys), `.env` (local only)
- `deploy-output.txt`, `interact-output.txt`, `analyze-output.txt`
- `report.md` with live DIDLab data and screenshot references
- `screenshots/` (terminal captures of deploy/interact/analyze)

Re-run the scripts with your own DIDLab credentials to reproduce the dataset; update `.env` and
`report.md` with the new hashes before submission.
