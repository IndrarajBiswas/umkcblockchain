# UMKC Blockchain Assignments

This repository collects all blockchain coursework for the semester. Each assignment lives in its
own directory with code, documentation, and submission artefacts.

## Assignment Overview

- [Assignment 1 – Mini Blockchain Extension](./Assignment-1)
  - Node.js prototype with Proof-of-Work (difficulty ≥ 3)
  - ≥ 5 transactions per block with chain validation demo
  - Reflection on immutability and PoW cost
- [Assignment 2 – CampusCredit on DIDLab](./Assignment-2)
  - Hardhat v3 + Viem workflow targeting the DIDLab Team 01 network
  - Deploys `CampusCredit` ERC‑20, performs two transfers + one approval, and analyses fees/events
  - Outputs: `deploy-output.txt`, `interact-output.txt`, `analyze-output.txt`, updated `report.md`
- [Assignment 3 – CampusCreditV2 (Production-Style) on DIDLab](./Assignment-3)
  - Hardhat v3 + Viem project with cap/pause/roles and batch airdrop support (`CampusCreditV2`)
  - Scripts for deploy, transfer/approve, batch vs singles gas comparison, and logs query
  - Live DIDLab data recorded in `deploy-output.txt`, `transfer-approve-output.txt`, `airdrop-output.txt`, `logs-query-output.txt`, plus MetaMask network/token/tx screenshots

Each assignment folder includes a README with step-by-step instructions, environment requirements,
and links to the relevant artefacts. Run the workflows with your own `.env` credentials to reproduce
the results.
