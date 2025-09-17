# Assignment 3 — Build, Deploy & Operate a Production-Style ERC-20 on DIDLab

_DIDLab RPC `hh-01` was unavailable (HTTP 530). The workflow was executed against
a local Hardhat node (chainId 31337) to keep deployment, interaction, and
analysis steps ready for redeployment once the remote endpoint returns._

## Part A — Deployment
- Contract address: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Symbol / decimals: `CAMP`, 18
- Initial supply (human / raw): `1,000,000 CAMP` / `1000000000000000000000000`
- Compiler version: 0.8.24
- Script: `scripts/deploy.ts`
- Deploy tx hash: `0x99f8d23df577b409aab169f6225c0b1f25e49724420f40a009c1b658f21e9ea5`

## Part B — Transaction Details

### Tx1 (`0x01073e1f0cdcba87085796305e4e587b580cc4f878fe25ee4bca643eb0cf01c4`)
- Status: Success
- Block / timestamp (UTC): 2 / 2025-09-17T20:06:11Z
- From / To: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` → `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Nonce: 1
- Gas limit / gas used: 51,626 / 51,626
- Base fee / max fee / max priority fee (wei): 769,606,477 / 20,000,000,000 / 1,000,000,000
- Effective gas price (wei): 1,769,606,477
- Total fee (wei / ETH): 91,357,703,981,602 ≈ 0.000091357703981602
- Event: `Transfer` 100 CAMP to `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`

### Tx2 (`0xf4c60f9572503ef31240635f716a2680659e5ca30da3145ca7447a3674ae3c4e`)
- Status: Success
- Block / timestamp (UTC): 3 / 2025-09-17T20:06:12Z
- From / To: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` → `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Nonce: 2
- Gas limit / gas used: 34,526 / 34,526
- Base fee / max fee / max priority fee (wei): 673,736,765 / 22,000,000,000 / 3,000,000,000
- Effective gas price (wei): 3,673,736,765
- Total fee (wei / ETH): 126,839,435,548,390 ≈ 0.000126839435548390
- Event: `Transfer` 50 CAMP to `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`

### Tx3 (`0xf831deb73f6869d27e811b351a3e5ad13651aaf21c61aa944a8d9d378aafb4f4`)
- Status: Success
- Block / timestamp (UTC): 4 / 2025-09-17T20:06:13Z
- From / To: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` → `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- Nonce: 3
- Gas limit / gas used: 46,379 / 46,379
- Base fee / max fee / max priority fee (wei): 589,713,515 / 21,000,000,000 / 2,000,000,000
- Effective gas price (wei): 2,589,713,515
- Total fee (wei / ETH): 120,108,323,112,185 ≈ 0.000120108323112185
- Event: `Approval` 25 CAMP for `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`

## Part C — Fee Comparison (Tx1 vs. Tx2)
- Ordering: Tx1 (block 2) confirmed before Tx2 (block 3) due to sender nonce.
- Effective price: Tx2 paid 3.673736765 gwei with a 3 gwei tip, higher than Tx1’s 1.769606477 gwei (1 gwei tip).
- EIP-1559 takeaways: miners earn the priority portion while the protocol burns the base fee. Raising `maxPriorityFeePerGas` lifts the effective price until capped by `maxFeePerGas`.

## Part D — Decimals & Conversion
- Example: Tx1 emitted `value = 100000000000000000000` (wei). Dividing by 10^18 yields 100 CAMP.

## Screenshots / Evidence
- `deploy-output-local.txt` — deployment logs
- `interact-output-local.txt` — transfer+approval hashes
- `analyze-output-local.txt` — fee breakdowns
- `hardhat-node.log` — local chain startup proof
