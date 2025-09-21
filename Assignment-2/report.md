# Assignment 2 — Analyze Transactions on DIDLab

_All tasks were executed on the DIDLab Team 01 network (`https://hh-01.didlab.org`, chainId `31337`). The tables below summarize the deployment, interaction hashes, and fee analysis generated from the live run._

## Part A — Deployment
- Contract address: `0x67D269191c92Caf3cd7723F116c85E6E9BF55933`
- Symbol / decimals: `CAMP`, 18
- Initial supply (human / raw): `1,000,000 CAMP` / `1_000_000 * 10^18`
- Compiler version: 0.8.24
- Deploy tx hash: `0x8874714ebb621f90ffda75b2f915de30c9e935eb7d328532588e9a732c338f17`

## Part B — Transaction Details

### Tx1 — Transfer 100 CAMP (`0x3510ce729bec7c4479eda4cfe1b3079e39df0027297b54795ed460d71394adec`)
- Status: Success (block `31`, `2025-09-21T16:05:41Z`)
- From / To: deployer (`0xf39F…2266`) → teammate (`0x7099…79C8`)
- Gas limit / gas used: 51,626 / 51,626
- Base fee / max fee / max priority: 0.016534465 gwei / 20 gwei / 1 gwei
- Effective gas price / total fee: 1.016534465 gwei / `52,479,608,290,090 wei`
- Event: `Transfer` 100 CAMP to teammate

### Tx2 — Transfer 50 CAMP (`0xdb2225f0e0e9d3aedd3736b035a1cde10de98268b179d9c3d404205b621d2a97`)
- Status: Success (block `32`, `2025-09-21T16:05:42Z`)
- Gas limit / gas used: 34,526 / 34,526
- Base fee / max fee / max priority: 0.014474771 gwei / 22 gwei / 3 gwei
- Effective gas price / total fee: 3.014474771 gwei / `104,077,755,943,546 wei`
- Event: `Transfer` 50 CAMP to teammate

### Tx3 — Approve 25 CAMP (`0x68f2fcfe83f56aeb99db53cb2aeb2072346eb06d7ff2ee1afdcb9447579866f8`)
- Status: Success (block `33`, `2025-09-21T16:05:43Z`)
- Gas limit / gas used: 46,379 / 46,379
- Base fee / max fee / max priority: 0.01266959 gwei / 21 gwei / 2 gwei
- Effective gas price / total fee: 2.01266959 gwei / `93,345,602,914,610 wei`
- Event: `Approval` 25 CAMP for teammate as spender

## Part C — Fee Comparison (Tx1 vs Tx2)
- Ordering: Tx1 confirmed in block 31, Tx2 in block 32 (nonce ordering preserved).
- Effective price: Tx2 paid ~3.01 gwei vs Tx1’s ~1.02 gwei because of the higher priority fee (3 gwei vs 1 gwei), demonstrating EIP‑1559’s tip mechanism.
- EIP‑1559 summary: the base fee is burned each block, while the priority fee is paid to the validator. The effective price is `min(maxFeePerGas, baseFee + maxPriorityFeePerGas)`, so increasing the max priority fee awards faster inclusion at the cost of a higher effective price.

## Part D — Decimals & Conversion
- Example: Tx1 emitted `100000000000000000000` as the transfer value. Converting by `10^18` (token decimals) → `100 CAMP`.

## Evidence & Outputs
- `deploy-output.txt` — deployment hash/address excerpt
- `interact-output.txt` — before/after balances and transaction hashes
- `analyze-output.txt` — block/gas/fee breakdown for all three hashes
- Screenshots in `screenshots/` capture the deploy, interact, and analyze terminal sessions.

_Re-run the scripts with your `.env` values to regenerate the dataset; update `report.md` with the new hashes before submission._
