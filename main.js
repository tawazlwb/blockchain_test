const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data).toString());
    }
}

class BlockChain {
    constructor(){
        this.chain = [this.createGenesisBlock()];

    }

    createGenesisBlock() {
        return new Block(0, "04/01/2019", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

let kheiryCoin = new BlockChain();
kheiryCoin.addBlock(new Block(1, "05/01/2019", {amount : 4}));
kheiryCoin.addBlock(new Block(2, "06/01/2019", {amount : 14}));

console.log(JSON.stringify(kheiryCoin, null, 4));
