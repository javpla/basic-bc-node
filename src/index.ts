import { Blockchain } from "./blockchain";
import { getEc } from "./keygenerator";
import { Transaction } from "./transaction";

const key = getEc().keyFromPrivate('048e1ef0706de729b5239119be452c004dec7b65d38689866ae715385d009bc75288c0771ef5efdc75c6cd43d5688872d82c01b0f4623fea53e71ca91ea4481187');
const walletAddress = key.getPublic('hex');

const bc = new Blockchain(0);

console.log(`Initialized blockchain!`);
bc.inspect();

console.log('Starting miner...');
const minerAddress = walletAddress;

let b = bc.minePendingTransactions(minerAddress);

console.log('Block successfully mined: ', b.hash);
bc.inspect();

const tx = new Transaction(minerAddress, 'a', 50).sign(key);
bc.addTransaction(tx);
// bc.addTransaction(new Transaction('a', 'b', 100).sign(key)); TODO add a test for this line instead
bc.minePendingTransactions(minerAddress);

console.log('Block successfully mined: ', b.hash);
bc.inspect();
