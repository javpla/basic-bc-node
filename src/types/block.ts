import { createHash } from 'crypto';

const SHA256 = (text: string) => createHash("sha256").update(text).digest("hex");

export class Block {
  private nonce: number = 0;

  private hash: string = '';

  constructor(private timestamp: number, private data: any, readonly previousHash: string) {}

  public getHash(): string{
    return this.hash;
  }
  public getPreviousHash(): string {
    return this.previousHash;
  }

  calculateHash(previousHash: string): string {
    return SHA256(previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty: number): void {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash(this.previousHash);
    }

    console.log('Block mined: ' + this.hash);
  }
}