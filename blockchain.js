// blockchain.js
// Mini blockchain with Proof-of-Work, array-based transactions, and validation.
// Run: node blockchain.js

const crypto = require('crypto');

const DEFAULT_DIFFICULTY = 3; // Assignment requires >= 3

/** A single block in the chain */
class Block {
  /**
   * @param {number} index
   * @param {string} timestamp - e.g., Date.now().toString()
   * @param {Array<object>} data - array of transaction objects
   * @param {string} previousHash - hex string of previous block hash
   */
  constructor(index, timestamp, data = [], previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = Array.isArray(data) ? data : [data]; // ensure array
    this.previousHash = previousHash;
    this.nonce = 0; // attempts counter for mining
    this.hash = this.calculateHash();
  }

  /** Compute SHA-256 over the block’s contents */
  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        String(this.index) +
          this.timestamp +
          JSON.stringify(this.data) +
          this.previousHash +
          String(this.nonce)
      )
      .digest('hex');
  }

  /** Proof-of-Work: find a hash starting with N leading zeros */
  mineBlock(difficulty) {
    const target = '0'.repeat(difficulty);
    const start = Date.now();

    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    const ms = Date.now() - start;
    console.log(
      `   Block mined (idx=${this.index}): ${this.hash} (nonce=${this.nonce}, ${ms}ms)`
    );
  }
}

/** A simple blockchain container */
class Blockchain {
  constructor(difficulty = DEFAULT_DIFFICULTY) {
    if (difficulty < 3) {
      throw new Error('Difficulty must be at least 3 for this assignment.');
    }
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
  }

  createGenesisBlock() {
    return new Block(0, Date.now().toString(), ['Genesis Block'], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Add a new block to the chain.
   * Sets its previousHash, mines it, then appends.
   */
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  /** Verify integrity: hash consistency + correct previousHash links */
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      // recompute hash from the block’s current contents
      if (current.hash !== current.calculateHash()) return false;

      // ensure link matches previous block’s actual hash
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }
}

/* ---------------------- DEMO / WALKTHROUGH ---------------------- */

function main() {
  // 1) Create a chain with difficulty >= 3
  const demoCoin = new Blockchain(3);

  // 2) Add blocks with ARRAY transactions (≥ 5 total tx across chain)
  console.log('     Mining block #1 ...');
  demoCoin.addBlock(
    new Block(1, Date.now().toString(), [
      { from: 'Alice', to: 'Bob', amount: 50 },
    ])
  );

  console.log('     Mining block #2 ...');
  demoCoin.addBlock(
    new Block(2, Date.now().toString(), [
      { from: 'Charlie', to: 'Dana', amount: 75 },
      { from: 'Alice', to: 'Eve', amount: 25 },
    ])
  );

  console.log('     Mining block #3 ...');
  demoCoin.addBlock(
    new Block(3, Date.now().toString(), [
      { from: 'Eve', to: 'Frank', amount: 20 },
      { from: 'Gina', to: 'Hank', amount: 10 },
      { from: 'Bob', to: 'Charlie', amount: 5 },
    ])
  );

  // 3) Show the chain
  console.log('\n   Full chain:');
  console.log(JSON.stringify(demoCoin, null, 2));

  // 4) Validate (should be true)
  console.log('\n    Is chain valid?', demoCoin.isChainValid());

  // 5) Tamper test: modify a transaction in block #1 and re-validate
  console.log('\n     Tampering with block #1 data ...');
  // Block #1 is at index 1 in the array; change the first transaction
  demoCoin.chain[1].data[0].amount = 9999;

  // 6) Validate again (should be false)
  console.log('    Is chain valid after tamper?', demoCoin.isChainValid());
}

main();