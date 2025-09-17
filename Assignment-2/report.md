# Assignment 2 — Analyze Transactions on DIDLab

_Note: DIDLab RPC `hh-01` was offline (HTTP 530). The required workflow was executed end-to-end against a local Hardhat node (chainId 31337) so the steps, outputs, and analysis are documented while the instructor restores the remote endpoint._

## Part A — Deployment
- Contract address: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Symbol / decimals: `CAMP`, 18
- Initial supply (human / raw): `1,000,000 CAMP` / `1000000000000000000000000`
- Compiler version: 0.8.24
- Scripts used: `scripts/deploy.ts`

## Part B — Transaction Details

### Tx1 (`0x01073e1f0cdcba87085796305e4e587b580cc4f878fe25ee4bca643eb0cf01c4`)
- Status: Success
- Block / timestamp (UTC): 2 / 2025-09-17T17:56:48Z
- From / To: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` (EOA) → `0x5FbDB2315678afecb367f032d93F642f64180aa3` (CampusCredit)
- Nonce: 1
- Gas limit / gas used: 51,626 / 51,626
- Base fee / max fee / max priority fee: 0.769606477 gwei / 20 gwei / 1 gwei (raw: 769,606,477 / 20,000,000,000 / 1,000,000,000 wei)
- Effective gas price / total fee: 1.769606477 gwei / 91,357,703,981,602 wei (≈ 0.000091357703981602 ETH)
- Events (raw + human): `Transfer` value `100000000000000000000` (100 CAMP) from deployer to acct2

### Tx2 (`0xf4c60f9572503ef31240635f716a2680659e5ca30da3145ca7447a3674ae3c4e`)
- Status: Success
- Block / timestamp (UTC): 3 / 2025-09-17T17:56:49Z
- From / To: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` → `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Nonce: 2
- Gas limit / gas used: 34,526 / 34,526
- Base fee / max fee / max priority fee: 0.673736765 gwei / 22 gwei / 3 gwei (raw: 673,736,765 / 22,000,000,000 / 3,000,000,000 wei)
- Effective gas price / total fee: 3.673736765 gwei / 126,839,435,548,390 wei (≈ 0.00012683943554839 ETH)
- Events (raw + human): `Transfer` value `50000000000000000000` (50 CAMP) from deployer to acct2

### Tx3 (`0xf831deb73f6869d27e811b351a3e5ad13651aaf21c61aa944a8d9d378aafb4f4`)
- Status: Success
- Block / timestamp (UTC): 4 / 2025-09-17T17:56:50Z
- From / To: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` → `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Nonce: 3
- Gas limit / gas used: 46,379 / 46,379
- Base fee / max fee / max priority fee: 0.589713515 gwei / 21 gwei / 2 gwei (raw: 589,713,515 / 21,000,000,000 / 2,000,000,000 wei)
- Effective gas price / total fee: 2.589713515 gwei / 120,108,323,112,185 wei (≈ 0.000120108323112185 ETH)
- Events (raw + human): `Approval` value `25000000000000000000` (25 CAMP) from deployer to acct2 as spender

## Part C — Fee Comparison (Tx1 vs Tx2)
- Which landed first? Tx1 (block 2) mined before Tx2 (block 3); both confirmed sequentially because they share the same sender nonce ordering.
- Which had higher effective gas price / priority tip? Tx2 used a 3 gwei priority tip and paid 3.673736765 gwei effective gas, higher than Tx1’s 1 gwei tip and 1.769606477 gwei effective price.
- EIP-1559 summary: the protocol sets a base fee per block (burned) and miners receive the priority fee (“tip”). Senders cap what they pay with `maxFeePerGas`. The actual price is `min(maxFeePerGas, baseFee + maxPriorityFeePerGas)`, so increasing the tip raises the priority portion while still respecting the base-fee requirement.

## Part D — Decimals & Conversion
- Example: the Tx1 Transfer emitted `value = 100000000000000000000` wei. Dividing by `10^18` (token decimals) gives `100 CAMP`.

## Screenshots
- Pending: capture terminal output for `hardhat node`, `scripts/deploy.ts`, `scripts/interact.ts`, and `scripts/analyze.ts` runs (stored locally under `deploy-output-local.txt`, `interact-output-local.txt`, `analyze-output-local.txt`).
