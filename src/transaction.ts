import { createHash } from 'crypto';
import { ec } from 'elliptic';
import { getEc } from './keygenerator';

const SHA256 = (text: string) => createHash('sha256').update(text).digest('hex');

export class Transaction {
  private signature?: ec.Signature;

  constructor(readonly from: string, readonly to: string, readonly amount: number) { }

  calculateHash(): string {
    return SHA256(this.from + this.to + this.to).toString();
  }

  sign(key: ec.KeyPair): Transaction {
    if (key.getPublic('hex') !== this.from) {
      throw new Error(`Not allowed to sign transactions from other wallets`);
    }

    const hash = this.calculateHash();
    this.signature = key.sign(hash, 'base64').toDER('hex');

    return this;
  }

  isValid(): boolean {
    if (this.from === '') return true;

    if (!this.signature) {
      throw new Error(`Invalid Transaction. Signature is missing`);
    }

    const publicKey = getEc().keyFromPublic(this.from, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}