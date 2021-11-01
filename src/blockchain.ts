import { Block } from "./block";
import { Transaction } from "./transaction";
import { inspect } from 'util';

export class Blockchain {
  private readonly chain: Block[] = [];

  private _pendingTransactions: Transaction[] = [];
  private miningReward: number = 100;

  private _balances = new Map<string, number>([['', 1e6]]);

  constructor(private difficulty = 1) {
    const genesisBlock = new Block(Date.now(), [new Transaction('', '', 0)], '');
    genesisBlock.mineBlock(0);
    this.chain.push(genesisBlock);
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(rewardAddress: string): Block {
    this.addTransaction(new Transaction('', rewardAddress, this.miningReward));
    const b = new Block(Date.now(), this._pendingTransactions, this.getLatestBlock().hash); // TODO there should be a limit on length of transactions to be included
    b.mineBlock(this.difficulty);

    this.chain.push(b);
    this._pendingTransactions = [];

    return b;
  }

  addTransaction(t: Transaction): void {
    if (!t.to) {
      throw new Error(`Transaction must include a valid 'to' address`);
    }
    if (!t.isValid()) {
      throw new Error(`Invalid transaction`);
    }

    // check sufficient balances and update them
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

    this._pendingTransactions.push(t);
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

  assertValidChain(): void {
    // check relation between blocks
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.hasValidTransactions()) {
        throw new Error(`Invalid transactions in block ${i}`);
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.error(`currentBlock.hash: ${currentBlock.hash}`);
        console.error(`currentBlock.calculateHash(): ${currentBlock.calculateHash()}`);
        throw new Error(`Block ${i} has a wrong hash`);
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        throw new Error(`Block ${i} has a wrong hash for the previous block`);
      }
    }
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
    console.log(`\n----------Blockchain----------`);
    console.log(inspect(this.chain, true, Infinity, true));
    console.log(`Balances:`, inspect(this._balances, true, Infinity, true));

    this.assertValidChain();
    try {
      this.assertValidChain();
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : JSON.stringify(e);
      console.warn(`Chain is invalid: `, errMsg);
    }
    console.log();
  }
}