# Assignment 3 — Build, Deploy & Operate a Production-Style ERC-20 on DIDLab

_All data below was collected on the live DIDLab Team 01 network (RPC `https://hh-01.didlab.org`, chainId `31337`). `CampusCreditV2` implements cap enforcement, pausing, role gates, and a batch airdrop._

## Part A — Deployment
- Contract address: `0x610178dA211FEF7D417bC0e6FeD39F05609AD788`
- Deploy tx hash: `0xf6ad8f8d20c4fee16fa460c9bdba693b7edc442ad1b45079c1d7f0368e4ed43b`
- Block number: `11`
- Token parameters: name `DidLabToken`, symbol `DLAB`, decimals `18`, cap `2,000,000 CAMP`
- Initial mint: `1,000,000 CAMP` to deployer `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Roles granted at deploy: `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE`, `PAUSER_ROLE`
- Gas policy: `maxPriorityFeePerGas` 2 gwei, `maxFeePerGas` 20 gwei (EIP-1559)

## Part B — Transfer & Approve (`npm run xfer`)
- Transfer `0xd65f615858acf6099f0d89386725348f0f24645f505db2636f1369b5e246e09b`
  - Block `24`, gas used `36,824`, fee `38,363,155,227,464 wei`
  - Action: 100 CAMP from deployer → teammate `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Approve `0x8820703a0492fdac353b04da8e48a6fb4d6183870b47e2721a551d54f9ca802e`
  - Block `25`, gas used `26,509`, fee `53,987,851,275,624 wei`
  - Action: approve teammate for 50 CAMP allowance
- Balances before: deployer `999,780 CAMP`, teammate `240 CAMP`
- Balances after: deployer `999,680 CAMP`, teammate `340 CAMP`
- Allowance after script: `50 CAMP`

## Part C — Batch Airdrop vs Singles (`npm run airdrop`)
- Recipients: `0xf39F…2266`, `0x7099…79C8`, `0x3C44…29BC`
- Batch airdrop `0x3d0cd2ec932a47a97c1900cbc1ed60ba907f733956f9021af1c9807c4d1e3838`
  - Block `26`, gas used `58,647`, fee `119,171,912,245,494 wei`
- Singles total (three transfers) gas `102,824`, fee `208,160,495,368,028 wei`
- Gas-aware design: custom errors (`CapExceeded`, `ArrayLengthMismatch`), cap checks inside `airdrop`, minimal calldata arrays, unchecked loops, and a single transaction combine for ≈`42.96%` gas savings in this run.

## Part D — Logs & Events (`npm run logs`)
- `RoleGranted` events at block `11` confirm admin/minter/pauser assignments
- Deployment mint, scripted transfer/approve, batch mint, and comparison transfers recorded across blocks `11–29`
- Full output: `logs-query-output.txt`

## Part E — Submission Checklist
1. Artifacts: contract (`contracts/CampusCreditV2.sol`), scripts, Hardhat config, `.env.example`, README.
2. Console logs: `deploy-output.txt`, `transfer-approve-output.txt`, `airdrop-output.txt`, `logs-query-output.txt`.
3. MetaMask evidence: `screenshots/Network Details.png`, `screenshots/Token Details.png`, and
   `screenshots/Transacation Details.png` document the custom network, token import, and MetaMask
   transfer hash on DIDLab.
4. Short write-up above covers cap/pause/roles enforcement and batch gas savings.

_Rerun the scripts with your team’s `.env` (Member B can reuse the deployed `TOKEN_ADDRESS`) to reproduce the DIDLab workflow._
