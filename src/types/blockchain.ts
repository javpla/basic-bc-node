import { Block } from "./block";
import { Transaction } from "./transaction";
import { inspect } from 'util';

export class Blockchain {
  private readonly chain: Block[] = [];

  private _pendingTransactions: Transaction[] = [];
  private miningReward: number = 100;

  private _balances = new Map<string, number>([['', 1e6]]);

  constructor(private difficulty = 1) {
    this.chain.push(new Block(Date.now(), [new Transaction('', '', 0)], ''));
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(rewardAddress: string): void {
    this.addTransaction(new Transaction('', rewardAddress, this.miningReward));
    const b = new Block(Date.now(), this._pendingTransactions, this.getLatestBlock().hash); // TODO there should be a limit on length of transactions to be included
    b.mineBlock(this.difficulty);
    console.log('Block successfully mined: ', b.hash);

    this.chain.push(b);
  }

  addTransaction(t: Transaction): void {
    this._pendingTransactions.push(t);

    const balanceFrom = this._balances.get(t.from);
    if (balanceFrom === undefined || balanceFrom < t.amount) {
      throw new Error('Insufficient balance in source address');
    }
    this._balances.set(t.from, balanceFrom - t.amount);

    const balanceTo = this._balances.get(t.to);
    if (balanceTo === undefined) {
      this._balances.set(t.to, t.amount);
    } else {
      this._balances.set(t.to, t.amount + balanceTo);
    }
  }

  calculateBalances(addresses: Set<string>): Map<string, number> {
    const map = new Map<string, number>(
      Array.from(addresses.values()).map(k => [k, 0])
    );

    if (map.size === 0) {
      return map;
    }

    for (const b of this.chain) {
      for (const t of b.transactions) {
        const balanceFrom = map.get(t.from);
        if (balanceFrom !== undefined) {
          map.set(t.from, balanceFrom - t.amount);
        }

        const balanceTo = map.get(t.to);
        if (balanceTo !== undefined) {
          map.set(t.to, balanceTo + t.amount);
        }
      }
    }

    return map;
  }

  getBalance(address: string): number {
    return this._balances.get(address) ?? 0;
  }

  isChainValid(): boolean {
    // check relation between blocks
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash != currentBlock.calculateHash(previousBlock.hash)) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  assertBalance(): void {
    // check _balances
    for (const balances of this.calculateBalances(new Set(this._balances.keys()))) {
      if (balances.keys.length !== this._balances.size) {
        throw new Error('Addresses length incorrect');
      }
      // TODO: check that all keys are contained in both balances and their values
    }
  }

  inspect(): void {
    const transactions = this.chain.reduce<Transaction[]>((transactions, b) => {
      return [...transactions, ...b.transactions];
    }, new Array<Transaction>());
    console.log(`Transactions: `, inspect(transactions));
    console.log(`Balances:`, inspect(this._balances));
  }
}