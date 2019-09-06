const SHA256 = require('crypto-js/sha256');
class Block{
    constructor(index, timestamp, data, previousHash = "" ){
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
    }
    calculateHash(){
        return(SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash ).toString());
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock(){
        return(new Block(0, "18/08/1997", "Genesis block", 0));
    }
    getLatestBlock(){
        return(this.chain[this.chain.length -1]);
    }
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    checkValidity(){
        for(let i=0; i<this.chain.length - 1; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash != previousBlock.hash){
                return false;
            }
        }
        return true;
    }

}

let navCoin = new Blockchain();
navCoin.addBlock(new Block(1, "07/09/2019", {amount: 10}));
console.log(navCoin);
console.log(navCoin.checkValidity());