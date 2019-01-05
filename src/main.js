const {BlockChain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate('c58cc0b39f4eaad65e317c3cee56eb6c8b3919ef81a8780cb11ba00ee1a19951');
const myWalletAddress = myKey.getPublic('hex');
const toAddress = "045790330d227e203ebb3be351f4caf9a4730792622ae2e06c6166a62209865804d3dfe936e99119a502401da9e5487fffb4d25b83dde3d557b8b879a128e66c5e";

let kheiryCoin = new BlockChain();

const tx1 = new Transaction(myWalletAddress, toAddress, 10);
tx1.signTransaction(myKey);
kheiryCoin.addTransaction(tx1);

console.log('\nStrart the miner...');
kheiryCoin.minePendingTransactions(myWalletAddress);
console.log('\nBalance of khairy ', kheiryCoin.getBalanceOfAddress(myWalletAddress));

kheiryCoin.chain[1].transactions[0].amount = 1;
console.log(`\nIs chain valid? ${kheiryCoin.isChainValid()}`);

//console.log(`\nKHEIRYCOIN:\n${JSON.stringify(kheiryCoin, null, 4)}`);
