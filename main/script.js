function UserCard(index){
 
    this._balance = 100;
    this._transactionLimit = 100;
    this._historyLogs = [];
    this._key = index;
 
    let logOperation = (operationType, credits) => {
        this._historyLogs.push({
            operationType: operationType,
            credits: credits,
            operationTime: new Date().toLocaleString()
        })
    }
 
    this.getCardOptions = () => {
        return {
            balance: this._balance,
            transactionLimit: this._transactionLimit,
            historyLogs: this._historyLogs,
            key: this._key
        }
    }
 
    this.putCredits = (amount) => {
        this._balance += amount;
        logOperation("Received credits", amount)
        return this._balance;
    }
 
    this.takeCredits = (amount) =>{
        if(this._balance >= amount && this._transactionLimit >= amount){
            this._balance -= amount;
            logOperation('Withdrawn of credits', amount)
            return this._balance;
        } else{
            console.error("Not enough credits or transaction limit exceeded");
        }
    }
 
    this.setTransactionLimit = (amount) => {
        if(amount< 0 ){
            return console.error("Transaction limit can't be negative");
        } else{
            this._transactionLimit = amount;
            logOperation("Transaction limit changed", amount)
            return `Transaction limit set to ${this._transactionLimit}`
        }
 
    }
    this.transferCredits = (amount, card) => {
        const tax = amount * 0.005; 
        const totalAmount = amount + tax;
        if(totalAmount> this._balance){
            return console.warn("Not enough credits");
        }
 
        if( totalAmount > this._transactionLimit){
            return console.warn("Transaction limit exceeded");
        }
 
        this._balance -= totalAmount;
 
        card.putCredits(amount);
 
        logOperation("Withdrawn of credits", amount)
 
        return `Transfered ${amount} credits to card ${card.getCardOptions().key}`
 
    }
 
 
}
class UserAccount {
    constructor(name,  email ){
        this._name = name;
        this._email = email;
        this._cards = [];
    }
    addCard(){
        if(this._cards.length >= 3){
            return console.warn("User can't have more than 3 cards");
        } else{
            const card = new UserCard(this._cards.length + 1)
            this._cards.push(card);
            return card;
        }
 
    }
 
    getCardByKey(key){
        if(key < 1 || key > 3){
            return console.error("Card with such key doesn't exist");
        }
 
        // return this._cards[key - 1];
 
        for(let card of this._cards){
            if(card._key === key){
                return card;
            }
        }
        return console.error("Card with such key doesn't exist");
    }
 
 
    
}
const boxInfo = document.querySelector('.boxInfo');
const depositeBtn = document.querySelector('#depositeBtn');
const withdrawBtn = document.querySelector('#depositeInp');
const userDB = JSON.parse(localStorage.getItem('user'));

const user = new UserAccount(userDB.name, userDB.email);

user.addCard();
user.addCard();

const card1 = user.getCardByKey(1);
const card2 = user.getCardByKey(2);
console.log(card1.getCardOptions().balance);
function infoBoxFuunction(){
    boxInfo.innerHTML = '';

boxInfo.innerHTML += `
      <h3>card number: <span class="cardNumber">${card1.getCardOptions().key}</span></h3>
        <h3>card balance: <span class="cardBalance">${card1.getCardOptions().balance}</span></h3>
        <h3>transaction limit: <span class="transactionLimit">${card1.getCardOptions().transactionLimit}</span></h3>
        <h3>history logs: <span class="historyLogs">${card1.getCardOptions().historyLogs}</span></h3>
`;}

infoBoxFuunction();



depositeBtn.addEventListener('click', () => {
    card1.putCredits(+depositeBtn.value);
    infoBoxFuunction();
})
