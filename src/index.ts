import { Block, Blockchain } from "./types";

const bc = new Blockchain(4);
bc.addBlock(new Block(Date.now(), { amount: 10 }, bc.getLatestBlock().getHash()))
bc.addBlock(new Block(Date.now(), { amount: 200 }, bc.getLatestBlock().getHash()))
bc.addBlock(new Block(Date.now(), { amount: 300 }, bc.getLatestBlock().getHash()))
bc.addBlock(new Block(Date.now(), { amount: 400 }, bc.getLatestBlock().getHash()))

console.log(JSON.stringify(bc, null, 2));
console.log('Is blockchain valid: ' + bc.isChainValid());
