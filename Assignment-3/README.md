# Assignment 3 — Build, Deploy & Operate a Production-Style ERC-20 on DIDLab

This directory mirrors the professor's revised Activity 3 playbook. It uses Hardhat v3 (ESM)
and Viem to deploy and operate the `CampusCreditV2` ERC-20 with cap, pause, role-based
minting, and a gas-aware batch airdrop. The workflow below has been validated directly on the
DIDLab Team 01 RPC (`https://hh-01.didlab.org`, chainId `31337`).

## 0. Environment & Prerequisites

- Node.js 22.x (LTS), npm, Git, VS Code, MetaMask
- Copy `.env.example` → `.env` and populate:
  - `RPC_URL`, `CHAIN_ID`, `PRIVATE_KEY`
  - `TOKEN_NAME`, `TOKEN_SYMBOL`, `TOKEN_CAP`, `TOKEN_INITIAL`
  - Optional `RECIPIENT`, `AIRDROP_RECIPIENTS`
  - Append `TOKEN_ADDRESS` after deployment
- `.env.example` includes ready-to-use values for Team 01 (Member A & Member B)

## 1. Install & Compile

```bash
npm install
npm run compile
```

`hardhat.config.ts` targets Solidity 0.8.24 (optimizer 200) and registers a `didlab` network
that pulls connection details from `.env`.

## 2. Deploy (EIP-1559)

```bash
npm run deploy
# record the deploy hash, contract address, block → update TOKEN_ADDRESS
```

Latest deployment: `TOKEN_ADDRESS=0x610178dA211FEF7D417bC0e6FeD39F05609AD788` (see
`deploy-output.txt`).

## 3. Operate the Token

### Transfer & Approve

```bash
npm run xfer
```

`scripts/transfer-approve.ts` shows balances before/after, the transfer & approve transaction
hashes, block numbers, gas used, and total fees. Output captured in
`transfer-approve-output.txt`.

### Batch Airdrop vs Singles

```bash
npm run airdrop
```

`scripts/airdrop.ts` reads `AIRDROP_RECIPIENTS` (comma separated) or falls back to an inline
default list. It mints 10 CAMP per recipient using the contract `airdrop`, then replays the
same distribution with individual transfers. Gas totals and percent savings are logged in
`airdrop-output.txt`.

### Event Logs

```bash
npm run logs
```

`scripts/logs-query.ts` scans the last ~2000 blocks for Transfer/Approval events. Sample output
is stored in `logs-query-output.txt`.

## 4. MetaMask Checklist

1. Add Network → Name `DIDLab Team 01`, RPC `https://hh-01.didlab.org`, Chain ID `31337`, symbol `ETH`.
2. Import the faucet private key as a temporary account.
3. Import `TOKEN_ADDRESS` and verify balances.
4. Send a token transfer in MetaMask and confirm it appears in `npm run logs`.
   - Evidence stored in `screenshots/Network Details.png`, `screenshots/Token Details.png`, and
     `screenshots/Transacation Details.png`.

## 5. Deliverables & Evidence

- Contract: `contracts/CampusCreditV2.sol`
- Scripts: `scripts/deploy.ts`, `scripts/transfer-approve.ts`, `scripts/airdrop.ts`, `scripts/logs-query.ts`
- Outputs: `deploy-output.txt`, `transfer-approve-output.txt`, `airdrop-output.txt`, `logs-query-output.txt`
- Report: `report.md`
- Screenshots: store MetaMask/network evidence under `screenshots/`

Run the same commands with your team-specific `.env` (or Member B’s key + `TOKEN_ADDRESS`) to recreate the DIDLab workflow.
