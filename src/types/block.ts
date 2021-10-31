import { createHash } from 'crypto';
import { Transaction } from './transaction';

const SHA256 = (text: string) => createHash("sha256").update(text).digest("hex");

export class Block {
  private _nonce: number = 0;

  private _hash: string = '';

  constructor(private _timestamp: number, private _transactions: Transaction[], readonly _previousHash: string) { }

  public get hash(): string {
    return this._hash;
    
  }
  public get previousHash(): string {
    return this._previousHash;
  }
  public get transactions(): Transaction[] {
    return this._transactions;
  }

  calculateHash(previousHash: string): string {
    return SHA256(previousHash + this._timestamp + JSON.stringify(this._transactions) + this._nonce).toString();
  }

  mineBlock(difficulty: number): void {
    while (this._hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this._nonce++;
      this._hash = this.calculateHash(this._previousHash);
    }
  }
}