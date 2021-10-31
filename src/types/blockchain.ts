import { Block } from "./block";

export class Blockchain {
  private readonly chain: Block[] = [];

  constructor(private difficulty = 1) {
    this.chain.push(new Block(Date.now(), 'Genesis block', ''));
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  addBlock(b: Block): void {
    b.mineBlock(this.difficulty);
    this.chain.push(b);
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.getHash() != currentBlock.calculateHash(previousBlock.getHash())) {
        return false;
      }
      if (currentBlock.getPreviousHash() !== previousBlock.getHash()) {
        return false;
      }
    }
    return true;
  }
}