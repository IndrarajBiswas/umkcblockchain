# UMKC Blockchain Assignments

This repository aggregates the three major blockchain assignments completed for the UMKC course. Each
assignment folder contains the full codebase, step-by-step README, comprehensive report, raw CLI
outputs, and screenshots so the professor (and the public) can inspect every deliverable without
rerunning the work.

## Repository Map

| Assignment | Focus | Highlights |
| --- | --- | --- |
| [Assignment 1 — Mini Blockchain](./Assignment-1) | Node.js prototype illustrating hashing + Proof-of-Work | Mines three blocks with difficulty ≥ 3, validates integrity, and demonstrates tamper detection. |
| [Assignment 2 — CampusCredit on DIDLab](./Assignment-2) | Hardhat v3 + Viem deployment & transaction analysis | Deploys ERC‑20 to DIDLab, runs scripted transfers/approvals, analyses gas fees, and documents evidence with screenshots. |
| [Assignment 3 — CampusCreditV2 Production Rollout](./Assignment-3) | Production-grade ERC‑20 with operational tooling | Adds cap/pause/roles, batch airdrop optimisation, MetaMask verification, and an extensive report of on-chain activity. |
| [Assignment 4 — DIDLab ERC-20 DApp UI](./Assignment-4) | Browser-based viem DApp for DIDLab ERC-20 | Single-file UI connects MetaMask, loads token metadata, tracks balances, handles transfers, and ships with a submission-ready checklist. |

## What You’ll Find Inside Each Assignment

- **README.md** — A polished runbook describing prerequisites, exact commands, and embedded
  screenshots of the workflow.
- **report.md** — A narrative submission with tables, transaction summaries, gas analysis, and linked
  evidence.
- **Scripts & Contracts** — Source code for deployments, interactions, and analytics, along with
  Hardhat/TypeScript configuration.
- **Outputs & Screenshots** — Raw console logs captured via `tee` and PNG captures of every major step
  (both CLI and MetaMask where applicable).

Re-run the documented commands with your own `.env` secrets to regenerate the artefacts. The
combination of code, reports, and visuals shows exactly how each assignment was completed end to end.
