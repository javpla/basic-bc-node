import { Blockchain, Transaction } from "./types";

const bc = new Blockchain(0);

console.log('Starting miner...');
const minerAddress = 'miner';
bc.minePendingTransactions(minerAddress);

bc.inspect();

bc.addTransaction(new Transaction(minerAddress, 'a', 100));
bc.addTransaction(new Transaction('a', 'b', 100));
bc.addTransaction(new Transaction('b', 'a', 50));
bc.minePendingTransactions(minerAddress);

bc.inspect();
