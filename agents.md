# Solo Proof‑of‑Build Badge — agents.md

**Purpose:** Orchestrate, verify, and document a 70‑minute solo build that mints a verifiable ERC‑721 badge pointing to IPFS metadata using DIDLab infra. This file is the single source of truth for any AI/automation agent to execute and self‑audit the run.

---

## 0) Mission & Success Criteria

**You succeed if all of the below are true:**

1. Image + metadata uploaded to IPFS via DIDLab API using SIWE → JWT.
2. Minimal ERC‑721 is deployed to the DIDLab EVM (chainId `252501`).
3. One NFT is minted, pointing to your IPFS metadata URI.
4. A self‑contained evidence bundle is produced with on‑chain and off‑chain proof, reproducible logs, and a README summary.

**Absolute timebox:** 70 minutes end‑to‑end. Target check‑ins at: 5, 15, 35, 55, and 65 minutes.

---

## 1) Inputs & Assumptions

* **Tooling:** Node 18+, `npm`, `git`, `curl`, `jq`, `bash`.
* **Wallet:** Burner EOA with small gas on chain `252501`.
* **OS:** Linux/macOS or compatible shell (WSL ok).
* **Network endpoints:**

  * RPC: `https://rpc.blockchain.didlab.org`
  * DIDLab API (SIWE/IPFS): `https://api.didlab.org`

---

## 2) Environment & Directory Layout

```bash
export RPC_URL="https://rpc.blockchain.didlab.org"
export CHAIN_ID=252501
export PRIVKEY=0xYOUR_PRIVATE_KEY      # burner only
export ADDR=0xYourWalletAddress        # derived from PRIVKEY

# Working dir
mkdir -p didlab-solo-hack && cd didlab-solo-hack
```

**Repo layout (target):**

```
.
├─ assets/
│  └─ badge.png
├─ contracts/
│  └─ DidLabBadge.sol
├─ scripts/
│  ├─ deploy.js
│  ├─ mint.js
│  └─ sign.js
├─ logs/
│  ├─ run.jsonl             # structured event log (append‑only)
│  └─ console.txt           # raw shell output (tee)
├─ evidence/
│  ├─ onchain.txt           # addresses, tx hashes, block #s
│  ├─ token.json            # fetched IPFS metadata
│  └─ screenshots/          # (user/agent to capture as PNGs)
├─ .env.example
├─ .gitignore
├─ hardhat.config.js
├─ metadata.json            # minted token metadata (source)
├─ README.md                # high‑level summary & checklist
└─ EVIDENCE.md              # compact submission checklist
```

**Logging policy:**

* Every action MUST emit a JSON event to `logs/run.jsonl` with fields:
  `{"ts": ISO8601, "step": "<id>", "cmd": "<shell or api>", "status": "ok|err", "data": {...}}`.
* Mirror all terminal output with `|& tee -a logs/console.txt`.

**Helper (append event):**

```bash
log(){ node -e "const fs=require('fs');const e=JSON.parse(process.argv[1]);fs.appendFileSync('logs/run.jsonl',JSON.stringify(e)+'\n')" "$1"; }
```

---

## 3) Scaffold & Configure (Step IDs: S1–S3)

**S1 — Project init**

```bash
set -euo pipefail
mkdir -p logs evidence/screenshots assets scripts contracts
log '{"ts":"'"$(date -Iseconds)"'","step":"S1","cmd":"npm init -y","status":"start"}'
 git init |& tee -a logs/console.txt
 npm init -y |& tee -a logs/console.txt
 npm i -D hardhat @nomicfoundation/hardhat-toolbox dotenv |& tee -a logs/console.txt
 npm i @openzeppelin/contracts |& tee -a logs/console.txt
log '{"ts":"'"$(date -Iseconds)"'","step":"S1","status":"ok"}'
```

**S2 — `hardhat.config.js`**

```js
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
module.exports = {
  solidity: "0.8.20",
  networks: {
    didlab: {
      url: process.env.RPC_URL || "https://rpc.blockchain.didlab.org",
      chainId: 252501,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
```

**S3 — Secrets templates**

```bash
cat > .env.example <<'EOF'
RPC_URL=https://rpc.blockchain.didlab.org
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
EOF
printf "node_modules\n.env\nlogs\nevidence/screenshots\n" > .gitignore
```

**Verification gate V‑A:** `npx hardhat --version` succeeds; `node -v` ≥ 18.

---

## 4) Minimal ERC‑721 (S4–S6)

**S4 — Contract** (`contracts/DidLabBadge.sol`)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract DidLabBadge is ERC721, Ownable {
    uint256 public nextId = 1;
    mapping(uint256 => string) private _tokenURIs;
    constructor(address initialOwner) ERC721("DIDLab Hackathon Badge","DLHB") Ownable(initialOwner) {}
    function mintTo(address to, string memory uri) external onlyOwner returns (uint256 tokenId) {
        tokenId = nextId++;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = uri;
    }
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "no token");
        return _tokenURIs[tokenId];
    }
}
```

**S5 — Deploy script** (`scripts/deploy.js`)

```js
const hre = require("hardhat");
async function main(){
  const [deployer] = await hre.ethers.getSigners();
  const Badge = await hre.ethers.getContractFactory("DidLabBadge");
  const badge = await Badge.deploy(deployer.address);
  await badge.waitForDeployment();
  console.log("DidLabBadge:", await badge.getAddress());
}
main().catch((e)=>{console.error(e); process.exit(1);});
```

**S6 — Compile & deploy**

```bash
npx hardhat compile |& tee -a logs/console.txt
BADGE_ADDRESS=$(npx hardhat run scripts/deploy.js --network didlab | awk '/DidLabBadge:/ {print $2}')
log '{"ts":"'"$(date -Iseconds)"'","step":"S6","cmd":"deploy","status":"ok","data":{"badgeAddress":"'"$BADGE_ADDRESS"'"}}'
echo "BADGE_ADDRESS=$BADGE_ADDRESS" | tee -a evidence/onchain.txt
```

**Verification gate V‑B:** `BADGE_ADDRESS` is a checksummed EOA‑like string (0x…; not empty). Optionally query code size via `eth_getCode`.

---

## 5) SIWE → JWT → IPFS (S7–S11)

**S7 — Add image**

```bash
cp /path/to/any-small.png assets/badge.png
```

**S8 — Prepare SIWE challenge**

```bash
curl -s -X POST "$DIDLAB_SIWE_PREPARE" -H 'content-type: application/json' \
  -d '{"address":"'"$ADDR"'"}' | jq -r .message > siwe.txt
```

> Default: `DIDLAB_SIWE_PREPARE=${DIDLAB_SIWE_PREPARE:-https://api.didlab.org/v1/siwe/prepare}`

**S9 — Sign SIWE** (`scripts/sign.js`)

```js
const { Wallet } = require("ethers");
const fs = require("fs");
(async ()=>{
  const msg = fs.readFileSync("siwe.txt","utf8");
  const sig = await new Wallet(process.env.PRIVKEY).signMessage(msg);
  console.log(sig);
})();
```

```bash
SIG=$(node scripts/sign.js)
```

**S10 — Verify to obtain JWT**

```bash
JWT=$(curl -s -X POST "$DIDLAB_SIWE_VERIFY" -H 'content-type: application/json' \
  -d '{"address":"'"$ADDR"'","signature":"'"$SIG"'"}' | jq -r .token)
```

> Default: `DIDLAB_SIWE_VERIFY=${DIDLAB_SIWE_VERIFY:-https://api.didlab.org/v1/siwe/verify}`

**S11 — Upload to IPFS**

```bash
CID_IMG=$(curl -s -H "Authorization: Bearer $JWT" \
  -F "file=@assets/badge.png" ${DIDLAB_IPFS_UPLOAD:-https://api.didlab.org/v1/ipfs/upload} | jq -r .cid)
REPO_URL="add-after-push"
cat > metadata.json <<EOF
{
  "name": "DIDLab Hackathon Badge (Solo)",
  "description": "70-minute solo proof-of-build",
  "image": "ipfs://$CID_IMG",
  "attributes": [
    {"trait_type":"wallet","value":"$ADDR"},
    {"trait_type":"repo","value":"$REPO_URL"}
  ]
}
EOF
CID_META=$(curl -s -H "Authorization: Bearer $JWT" \
  -F "file=@metadata.json" ${DIDLAB_IPFS_UPLOAD:-https://api.didlab.org/v1/ipfs/upload} | jq -r .cid)
TOKEN_URI="ipfs://$CID_META"
log '{"ts":"'"$(date -Iseconds)"'","step":"S11","status":"ok","data":{"cid_img":"'"$CID_IMG"'","cid_meta":"'"$CID_META"'","token_uri":"'"$TOKEN_URI"'"}}'
echo -e "CID_IMG=$CID_IMG\nCID_META=$CID_META\nTOKEN_URI=$TOKEN_URI" | tee -a evidence/onchain.txt
```

**Verification gate V‑C:** `CID_IMG` and `CID_META` are non‑empty; `TOKEN_URI` begins with `ipfs://`.

---

## 6) Mint (S12–S13)

**S12 — Mint script** (`scripts/mint.js`)

```js
const hre = require("hardhat");
async function main(){
  const a = process.env.BADGE_ADDRESS;
  const uri = process.env.TOKEN_URI;
  const [me] = await hre.ethers.getSigners();
  const C = await hre.ethers.getContractAt("DidLabBadge", a);
  const tx = await C.mintTo(me.address, uri);
  const rc = await tx.wait();
  console.log("tx:", rc.hash);
  const id = (await C.nextId()) - 1n;
  console.log("tokenId:", id.toString());
  console.log("tokenURI:", await C.tokenURI(id));
}
main().catch(e=>{console.error(e); process.exit(1);});
```

**S13 — Execute**

```bash
export BADGE_ADDRESS
export TOKEN_URI
node scripts/mint.js |& tee -a logs/console.txt
# Capture outputs
MINT_TX=$(grep '^tx:' logs/console.txt | tail -1 | awk '{print $2}')
TOKEN_ID=$(grep '^tokenId:' logs/console.txt | tail -1 | awk '{print $2}')
CONF_URI=$(grep '^tokenURI:' logs/console.txt | tail -1 | awk '{print $2}')
log '{"ts":"'"$(date -Iseconds)"'","step":"S13","status":"ok","data":{"tx":"'"$MINT_TX"'","tokenId":"'"$TOKEN_ID"'","tokenURI":"'"$CONF_URI"'"}}'
echo -e "MINT_TX=$MINT_TX\nTOKEN_ID=$TOKEN_ID\nCONFIRMED_TOKEN_URI=$CONF_URI" | tee -a evidence/onchain.txt
```

**Verification gate V‑D:** `CONF_URI == TOKEN_URI` and `TOKEN_ID` is `1` (or expected value if rerun).

---

## 7) Quick Checks (S14)

**On‑chain readback:**

```bash
npx hardhat console --network didlab -e "const a='$BADGE_ADDRESS';(async()=>{const c=await ethers.getContractAt('DidLabBadge',a);console.log(await c.tokenURI($TOKEN_ID));})()" |& tee -a logs/console.txt
```

**Off‑chain check:** Resolve `TOKEN_URI` via any public IPFS gateway and confirm `image` points to `CID_IMG`. Save the fetched JSON to `evidence/token.json`.

---

## 8) Evidence Bundle (S15–S17)

**S15 — README & EVIDENCE.md**

```bash
cat > README.md <<'MD'
# DIDLab Solo Hackathon — Proof‑of‑Build
This repo contains: deploy ERC‑721 → SIWE/JWT → IPFS upload → mint → verify.
## Artifacts
- **Network:** chainId 252501
- **Contract:** $(grep BADGE_ADDRESS evidence/onchain.txt | cut -d= -f2)
- **Mint tx:** $(grep MINT_TX evidence/onchain.txt | cut -d= -f2)
- **Token ID:** $(grep TOKEN_ID evidence/onchain.txt | cut -d= -f2)
- **tokenURI:** $(grep TOKEN_URI evidence/onchain.txt | cut -d= -f2)
- **Image CID:** $(grep CID_IMG evidence/onchain.txt | cut -d= -f2)
- **Metadata CID:** $(grep CID_META evidence/onchain.txt | cut -d= -f2)

## How to run
- `cp .env.example .env` and set `PRIVATE_KEY`.
- `npm i` then follow **agents.md** steps S1–S14.

## Reflection
(2–3 sentences on what worked / what didn’t.)
MD

cat > EVIDENCE.md <<'MD'
# Submission Checklist
- [ ] Public repo URL
- [ ] Contract address, mint tx hash, token id, tokenURI
- [ ] Two screenshots: explorer page + IPFS metadata JSON (with image field)
- [ ] 2–3 sentence reflection
MD
```

**S16 — `.env.example` already created; ensure not committing `.env`**

**S17 — Commit**

```bash
git add .
git commit -m "solo hack complete"
```

---

## 9) Error Handling & Recovery

* **SIWE “invalid signature”** → Re‑prepare challenge, ensure `ADDR` matches `PRIVKEY`. Rotate burner if needed.
* **Insufficient gas** → Fund EOA on chain `252501`, retry.
* **Compile/deploy mismatch** → Confirm Solidity `0.8.20`, OZ installed, and `BADGE_ADDRESS` exported.
* **Empty tokenURI on readback** → Ensure `TOKEN_URI` exported before mint, correct contract address, and `mintTo` succeeded.

For each failure, emit a `status:"err"` event with `{"error":"<message>","hint":"<short remediation>"}`.

---

## 10) Verification Rubric (Self‑Check)

* **Reproducibility:** A third party can clone the repo and, with their own burner, reproduce the steps using this `agents.md`.
* **Traceability:** `logs/run.jsonl` and `logs/console.txt` show a consistent, timestamped sequence; values in `evidence/onchain.txt` match console outputs.
* **Integrity:** `CONF_URI == TOKEN_URI`; fetched `evidence/token.json.image` resolves to `CID_IMG`.
* **Completeness:** README, EVIDENCE.md, code, scripts, and assets present; screenshots captured.

---

## 11) Roles for Sub‑Agents

* **Solidity/Hardhat Agent:** Owns S4–S6; guarantees deploy.
* **Auth/IPFS Agent:** Owns S8–S11; guarantees JWT + CIDs.
* **Mint/Verify Agent:** Owns S12–S14; guarantees tx + checkbacks.
* **Archivist Agent:** Owns S15–S17; guarantees evidence bundle + commit.

Each agent MUST write to `logs/run.jsonl` and update `evidence/onchain.txt` keys they touch.

---

## 12) Idempotency & Reruns

* If re‑running, token IDs increment. Always capture the last `tokenId` and URIs.
* Never reuse non‑burner keys. If a run is corrupted, start a fresh directory with a new burner and reference the failed run in logs.

---

## 13) Timeboxes & Milestones

* **T+05** Prereqs & scaffold done (V‑A)
* **T+15** Contract compiled & deployed (V‑B)
* **T+35** JWT + IPFS CIDs obtained (V‑C)
* **T+55** Minted & verified (V‑D)
* **T+65** Evidence bundle & commit

---

## 14) Final Submission (to LMS/Canvas)

Provide:

* Public repo URL containing: contract, scripts, metadata.json, assets/badge.png, hardhat config, `.env.example`, README, `agents.md`, `EVIDENCE.md`, `logs/`.
* Network: chainId 252501, Contract address, Mint tx hash, Token ID, tokenURI.
* Two screenshots: (1) explorer page (contract or mint tx), (2) IPFS metadata JSON showing `image`.
* 2–3 sentence reflection.

> End of agents.md
