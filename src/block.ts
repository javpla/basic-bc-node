import { createHash } from 'crypto';
import { Transaction } from './transaction';

const SHA256 = (text: string) => createHash("sha256").update(text).digest("hex");

export class Block {
  private _nonce: number = 0;

  private _hash: string = '';

  constructor(private readonly timestamp: number, private _transactions: Transaction[], readonly previousHash: string) { }
  public get hash(): string {
    return this._hash;
  }
  public get transactions(): Transaction[] {
    return this._transactions;
  }

  calculateHash(): string {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this._transactions) + this._nonce).toString();
  }

  mineBlock(difficulty: number): void {
    do {
      this._nonce++;
      this._hash = this.calculateHash();
    } while (this._hash.substring(0, difficulty) !== Array(difficulty + 1).join('0'));
  }

  hasValidTransactions(): boolean {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}