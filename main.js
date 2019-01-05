const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block {
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block mined: ' + this.hash);
    }
}

class BlockChain {
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.minigReward = 100;
    }

    createGenesisBlock() {
        return new Block("04/01/2019", [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        //newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.minigReward)
        ];
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if(currentBlock.hash !== currentBlock.calculateHash() || currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let minerAddress = 'kheiry-address';
let kheiryCoin = new BlockChain();
kheiryCoin.createTransaction(new Transaction("address1", "address2", 100));
kheiryCoin.createTransaction(new Transaction("address2", "address1", 50));

console.log('\nStrart the miner...');
kheiryCoin.minePendingTransactions(minerAddress);
console.log('\nBalance of ${minerAddress} ', kheiryCoin.getBalanceOfAddress(minerAddress));

console.log('\nStrart the miner again...');
kheiryCoin.minePendingTransactions(minerAddress);
console.log(`\nBalance of ${minerAddress}: `, kheiryCoin.getBalanceOfAddress(minerAddress));

console.log(`\nKHEIRYCOIN:\n${JSON.stringify(kheiryCoin, null, 4)}`);
