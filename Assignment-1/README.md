# Mini Blockchain — Assignment 1

A self-contained Node.js prototype that demonstrates the two pillars of blockchain integrity:
cryptographic hashing and Proof-of-Work. Running the script walks through mining three blocks,
inspecting the resulting ledger, and showing how a single tamper immediately invalidates the
chain.

## Highlights at a Glance

| Requirement | How it is satisfied |
| --- | --- |
| Difficulty ≥ 3 | `Blockchain` constructor enforces a minimum difficulty of three leading zeros. |
| Array-based transactions | Each block is populated with an array of transaction objects (≥ five total). |
| Proof-of-Work | `Block#mineBlock` brute-forces the nonce until the hash prefix meets the target. |
| Chain validation | `Blockchain#isChainValid` recomputes hashes and verifies the `previousHash` link. |
| Tamper demo | Script mutates Block #1 after mining and the validator flags the chain as invalid. |

## Project Layout

```
Assignment-1/
├── blockchain.js  # Complete implementation and interactive demo
└── README.md       # This walkthrough and reflection
```

Everything lives inside `blockchain.js`, making it easy for the grader (and future readers) to audit
both the algorithm and the sample run.

## Running the Demo Locally

### Prerequisites

- Node.js 18 LTS or newer (`node -v` ≥ 18)
- No npm dependencies are required; this is a single-file script

### Steps

```bash
cd Assignment-1
node blockchain.js
```

The script mines three blocks, prints the entire ledger, validates it, then performs the tamper test.
A real run from this repository is captured below (hashes will differ on your machine due to the
randomised nonce search):

```text
     Mining block #1 ...
   Block mined (idx=1): 0007f5efc7d7e648212ea1a79cc4a53dfada63b950b18c9de038cd7ddde96ab9 (nonce=6580, 36ms)
     Mining block #2 ...
   Block mined (idx=2): 000fcc64841995dfae4b544dbc6cf14f989c798d23918a4a263c185365557d69 (nonce=3976, 11ms)
     Mining block #3 ...
   Block mined (idx=3): 0000b68325d68380cff2610cd4c9fbb933323a7f2143c4f1d0aa2782f1b66f6c (nonce=10443, 26ms)
...
    Is chain valid? true

     Tampering with block #1 data ...
    Is chain valid after tamper? false
```

## Implementation Notes

- **Immutable history via hashing:** Each block hash is derived from its index, timestamp, array of
  transactions, the previous block hash, and the nonce. Changing any field results in a completely
  different hash.
- **Proof-of-Work cost:** Even with a difficulty of three leading zeros, the nonce climbs into the
  thousands, providing a visceral sense of the computational cost required to alter history.
- **Chain validation:** `isChainValid` is intentionally strict—it recomputes every hash and verifies
  the `previousHash` pointer so graders can easily see how tampering is detected.

## Reflection

Working through this mini-blockchain clarified how hashing underpins immutability. Because each
block’s hash is embedded in the next block, even a single transaction edit breaks every subsequent
link. Proof-of-Work doesn’t make tampering impossible; it makes it **expensive** by forcing an
attacker to redo the mining for the changed block and every block after it. The assignment also
highlighted how sensitive hashes are to serialization—serialising transactions with
`JSON.stringify` is critical for integrity checks.

This foundation set me up for the DIDLab assignments that follow, where the same principles are
scaled up to production-ready smart contracts.
