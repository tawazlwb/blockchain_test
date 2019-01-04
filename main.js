const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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
    }

    createGenesisBlock() {
        return new Block(0, "04/01/2019", "Genesis block", "0");
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

let kheiryCoin = new BlockChain();
kheiryCoin.addBlock(new Block(1, "05/01/2019", {amount : 4}));
kheiryCoin.addBlock(new Block(2, "06/01/2019", {amount : 14}));

//console.log(JSON.stringify(kheiryCoin, null, 4));

console.log('IS blockchain valid? ' + kheiryCoin.isChainValid());

kheiryCoin.chain[1].data.amount = 100;
console.log('IS blockchain valid? ' + kheiryCoin.isChainValid());

kheiryCoin.chain[1].data.amount = 110;
kheiryCoin.chain[1].calculateHash();
console.log('IS blockchain valid? ' + kheiryCoin.isChainValid());