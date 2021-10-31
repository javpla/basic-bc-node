const crypto = require("crypto"), SHA256 = message => crypto.createHash("sha256").update(message).digest("hex");


class Block {
  constructor(timestamp, data, previousHash = '') {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = '';
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log('Block mined: ' + this.hash);
  }
}

class Blockchain {
  constructor(difficulty = 1) {
    const genesisBlock = new Block(0, new Date().toISOString(), 'Genesis block')
    this.chain = [genesisBlock];
    this.difficulty = difficulty;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(b) {
    b.previousHash = this.getLatestBlock().hash;
    b.mineBlock(this.difficulty);
    this.chain.push(b);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash != currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

const bc = new Blockchain(4);
bc.addBlock(new Block(new Date().toISOString(), { amount: 10 }))
bc.addBlock(new Block(new Date().toISOString(), { amount: 200 }))
bc.addBlock(new Block(new Date().toISOString(), { amount: 300 }))
bc.addBlock(new Block(new Date().toISOString(), { amount: 400 }))

console.log(JSON.stringify(bc, null, 2));
console.log('Is blockchain valid: ' + bc.isChainValid());
