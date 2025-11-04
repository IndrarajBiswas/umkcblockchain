# Assignment 4 – DIDLab ERC-20 DApp UI

This folder contains the "Minimal DApp" deliverable: a single-file web application that connects to
MetaMask, switches the wallet to the public DIDLab TrustNet network, and interacts with your deployed
ERC-20 token.

## Network Metadata

These are the shared defaults for the TrustNet deployment (adjust once your contract is live):

- **RPC URL**: `https://eth.didlab.org`
- **Chain ID (decimal)**: `252501`
- **Native token**: `Trust (TT)`
- **Token Address**: *(paste the address emitted by your deployment script)*

## Running the DApp

1. Install [Node.js 22.x](https://nodejs.org/) (required by the assignment brief).
2. Ensure the MetaMask browser extension is installed and that your funded TrustNet account is imported.
3. Serve the static page locally from the repository root:

   ```bash
   cd Assignment-4
   python3 -m http.server 8000
   ```

   Alternatively: `npx http-server -p 8000`.
4. Open [http://localhost:8000](http://localhost:8000) in a MetaMask-enabled browser profile.
5. Confirm the RPC endpoint (editable field defaults to `https://eth.didlab.org`), paste your ERC-20
   token address, then click **Connect & Switch Network** followed by **Load Token**. Use the remaining
   buttons to refresh balances, transfer tokens, or add the token to MetaMask.

## Environment Alignment

Use `Assignment-4/.env.example` as the source of truth. Copy it to `.env` and paste in:

```env
RPC_URL=https://eth.didlab.org
CHAIN_ID=252501
TOKEN_NAME=CampusCredit
TOKEN_SYMBOL=CAMP
TOKEN_ADDRESS=0x<your_token>
```

Private keys are optional for this static UI; only paste them if you plan to automate off-chain tasks.

## Requirement Mapping

- **Connect flow**: `btnConnect` requests accounts, adds/switches the DIDLab network (RPC + Chain ID), and displays the connected account/network.
- **Token load & persistence**: `tokenAddr` input is validated with viem `getAddress`, metadata (name/symbol/decimals) is loaded, and preferences persist in `localStorage` under `didlab-ui`.
- **Balance view**: Reads `balanceOf(account)` and renders human units via `formatUnits`, with manual refresh or automatic updates.
- **Transfer**: Recipient and amount inputs feed a `transfer` call; the UI reports hash, mined block, and gas from the receipt log.
- **Updates**: `watchContractEvent` listens for `Transfer` events touching the active account and triggers `refresh()`.
- **Wallet integration**: `btnWatch` calls `wallet_watchAsset` so MetaMask tracks the token.
- **Runtime**: Pure HTML/JS with viem CDN imports—no Hardhat or build tooling in the browser.

## Deliverables Checklist

- Repository includes `Assignment-4/index.html` (single-page DApp) and this README.
- Fill in **Network Metadata** and confirm values before submitting.
- Place required screenshots in `Assignment-4/screenshots/`:
  - Connected state (account + network).
  - Token metadata view (name/symbol/decimals).
  - Transfer confirmation showing hash and block.
  - Optional: token added inside MetaMask.
- Provide the short note in `Assignment-4/note.md` (≤½ page) covering UX/safety touches and issues encountered.

## Troubleshooting Tips

- **MetaMask not found**: Confirm the extension is active (non-private window) or install it.
- **Network switch denied**: Approve MetaMask prompts for the DIDLab network; retry the connect flow.
- **Returned no data (0x)**: Token address is wrong for TrustNet; verify the contract exists on that network.
- **Insufficient funds**: Use the DIDLab faucet or transfer tokens from your deployer account to the connected wallet.
- **Event watcher silent**: Ensure MetaMask is connected and the account matches the one emitting/receiving transfers.

## Implementation Notes

- User preferences persist via `localStorage` so reloading the page keeps the last network/RPC/token.
- `getAddress` and `parseUnits` handle casing and decimal conversion, preventing malformed requests.
- Transaction logging escapes HTML to avoid DOM injection from unexpected error messages.
- Gas tips (`maxPriorityFeePerGas`/`maxFeePerGas`) default to ~1–2 gwei for TrustNet; raise them if the public network increases fees.
