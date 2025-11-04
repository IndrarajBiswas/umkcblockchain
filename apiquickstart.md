DIDLab API Student Quickstart
This guide shows you how to authenticate with SIWE, upload files to IPFS, and verify badges using https://api.didlab.org. You will need a DIDLab wallet (chain ID 252501) plus curl and jq in your terminal.

API Surface
Endpoint	Description
POST /v1/siwe/prepare	Generate a SIWE challenge for your wallet address.
POST /v1/siwe/verify	Verify the SIWE signature and receive a JWT token.
POST /v1/ipfs/upload	Upload a file to the managed IPFS node (requires JWT).
GET /v1/ipfs/verify/:cid	Check pin status and payment info for a CID.
GET /v1/ipfs/bundle/:bundleCid	Retrieve stored upload metadata for a bundle CID.
GET /v1/nft/metadata/:id	Fetch the on-chain metadata JSON for a DIDLab badge ID.
GET /v1/nft/verify?owner=0x…&id=…	Confirm whether an address holds a badge ID (also returns metadata when present).
1. Sign In With Ethereum (SIWE)
Request a SIWE challenge for your wallet address, sign it locally, then submit the signature to obtain a JWT token.

ADDRESS=0xYourDidlabWallet
prepare=$(curl -s -X POST https://api.didlab.org/v1/siwe/prepare \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg address "$ADDRESS" '{address:$address}')")
message=$(echo "$prepare" | jq -r .message)

# Sign message with your wallet (Metamask, cast, etc.) and store signature in $SIG
payload=$(jq -n --arg message "$message" --arg signature "$SIG" '{message:$message, signature:$signature}')

token=$(curl -s -X POST https://api.didlab.org/v1/siwe/verify \
  -H "Content-Type: application/json" \
  -d "$payload" | jq -r .token)
echo "$token"
Tokens are valid for six hours. Repeat the flow when it expires or you receive a 401.

2. Upload Files to IPFS
Use the JWT to call the managed IPFS uploader. Files are pinned automatically.

upload=$(curl -sS -X POST https://api.didlab.org/v1/ipfs/upload \
  -H "Authorization: Bearer $token" \
  -F "file=@path/to/asset.json" \
  -F "pin=true")
echo "$upload"

cid=$(echo "$upload" | jq -r .cid)
bundleCid=$(echo "$upload" | jq -r .bundleCid)
Check pin status, payment metadata, and the gateway URL using the returned CIDs. Files over 25 MB or exceeding 250 MB per wallet per day return HTTP 429.

curl -s "https://api.didlab.org/v1/ipfs/verify/$cid" | jq
curl -s "https://api.didlab.org/v1/ipfs/bundle/$bundleCid" | jq
3. Inspect Badge Metadata
Read badge metadata or verify ownership straight from the API.

curl -s https://api.didlab.org/v1/nft/contracts | jq
curl -s https://api.didlab.org/v1/nft/metadata/1001 | jq
curl -s "https://api.didlab.org/v1/nft/verify?owner=$ADDRESS&id=1001" | jq
4. Troubleshooting & Support
401: JWT missing or expired – rerun the SIWE flow.
429: Daily upload quota exceeded – wait or contact staff.
500: Internal error – capture the response and share it in #api-support.
For help, post the failing endpoint, timestamp, and response body in the #api-support Discord channel.