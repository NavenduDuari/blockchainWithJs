const SHA256 = require('crypto-js/sha256');
class Block{
    constructor(index, timestamp, data, previousHash = "" ){
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
        this.nonce=0;
    }
    calculateHash(){
        return(SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce ).toString());
    }
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty).fill(0).join("")){
            this.nonce++;
            console.log("nonce: "+this.nonce);
            this.hash=this.calculateHash();
        }
        console.log("Block minned..");
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty=3;
    }
    createGenesisBlock(){
        return(new Block(0, "18/08/1997", "Genesis block", 0));
    }
    getLatestBlock(){
        return(this.chain[this.chain.length -1]);
    }
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    checkValidity(){
        for(let i=1; i<this.chain.length - 1; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }

}

let navCoin = new Blockchain();
console.log("Mining block 1..");
navCoin.addBlock(new Block(1, "07/09/2019", {amount: 10}));
console.log("Mining block 2..");
navCoin.addBlock(new Block(2, "08/09/2019", { amount: 100}));
console.log(navCoin);
// console.log(navCoin.checkValidity());
// navCoin.chain[1].data = {amount: 55}
// console.log(navCoin.checkValidity());