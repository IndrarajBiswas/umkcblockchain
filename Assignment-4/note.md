# Assignment 4 – Short Note

## Extra Safety & UX Touches
- Validate all user-supplied addresses with `getAddress` before using them to avoid accidental checksum mistakes.
- Escape log output before inserting into the DOM so provider error strings cannot inject markup.
- Persist the selected team and token address in `localStorage` for faster reloads and fewer copy/paste mistakes.
- Auto-watch the `Transfer` event stream and refresh balances when the connected account sends or receives funds, so the UI stays current without manual refreshes.

## Issues Encountered & Resolutions
- **MetaMask network switching quirks**: MetaMask throws an error the first time a custom chain is requested; catching the error and falling back to `wallet_addEthereumChain` resolved the add/switch flow reliably.
- **Event listener timing**: Initial balance refreshes were missing if the contract watch was registered before token metadata loaded. Delaying `watchContractEvent` until after `loadToken()` completes ensures the listener uses the correct address and account context.
