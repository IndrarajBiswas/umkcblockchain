# Mini Blockchain — Assignment 1 (Extended)

## How to run
node blockchain.js


---

## Reflection

Working through this mini-blockchain clarified how hashing underpins immutability. Each block’s hash depends on its contents (index, timestamp, transactions, previousHash, and nonce). Because the `previousHash` is embedded in the next block, a change to any block’s data breaks every subsequent hash link. That “chain reaction” is why a blockchain is tamper-evident: even a tiny modification (e.g., changing an amount from 50 to 51) causes a completely different hash, which immediately invalidates the chain when compared to stored links.

Proof-of-Work (PoW) adds a cost to creating valid blocks. By requiring a hash with a prefix of zeros, the miner is forced into a brute-force search over the nonce. The difficulty setting controls how hard that search is; even at a modest difficulty of 3, I can see the nonce climbing and the mining time varying from block to block. This exercise made it concrete that PoW’s security isn’t about making tampering impossible—rather, it makes tampering **expensive**. To re-write history, an attacker would have to re-mine the changed block and all blocks after it, catching up to or exceeding the honest chain’s cumulative work. That computational race is exactly what discourages retroactive edits.

A small surprise was how sensitive the hash is to the serialized form of data. If `JSON.stringify` wasn’t included for transactions, tampering might not be detected correctly. Another practical insight was how performance depends on difficulty and machine speed—sometimes a block mines in a fraction of a second, and sometimes it takes longer, even with the same difficulty, due to the randomness of the nonce search.

Overall, I learned that the combination of hashing (for integrity and linking) and Proof-of-Work (for cost and consensus weight) provides a simple but powerful model for immutability. Even this minimal simulation shows why blockchains are resilient against unauthorized changes: they make cheating detectable **and** computationally expensive.