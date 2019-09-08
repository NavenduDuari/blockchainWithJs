const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = "" ){
        this.timestamp=timestamp;
        this.transactions=transactions;
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
            this.hash=this.calculateHash();
        }
        console.log("Block minned..");
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty=3;
        this.pendingTransactions=[];
        this.miningReward=100;
    }
    createGenesisBlock(){
        return(new Block("18/08/1997", "Genesis block", 0));
    }
    getLatestBlock(){
        return(this.chain[this.chain.length -1]);
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(),this.pendingTransactions);
        block.previousHash=this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);
        this.chain.push(block);

        this.pendingTransactions=[
            new Transaction(null,miningRewardAddress,this.miningReward)
        ];
    }
    
    checkBalanceOfAddress(address){
        let balance = 0;
        for(const block in this.chain){
            for(const trans in block.transactions){
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

navCoin.createTransaction(new Transaction('address1','address2',100));
navCoin.createTransaction(new Transaction('address2','address1',50));
console.log("starting the miner...\n");
navCoin.minePendingTransactions('miner1_add');

navCoin.createTransaction(new Transaction('address1','address2',100));
navCoin.createTransaction(new Transaction('address2','address1',50));
console.log("starting the miner...\n");
navCoin.minePendingTransactions('miner1_add');

navCoin.createTransaction(new Transaction('address1','address2',100));
navCoin.createTransaction(new Transaction('address2','address1',50));
console.log("starting the miner...\n");
navCoin.minePendingTransactions('miner1_add');

console.log(navCoin.chain);