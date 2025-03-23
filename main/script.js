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
const depositeInp = document.querySelector('#depositeInp');
const withdrawBtn = document.querySelector('#withdrawBtn');
const withdrawInp = document.querySelector('#withdrawInp');
const transferBtn = document.querySelector('#transferBtn');
const transferInp = document.querySelector('#transferInp');
const changecard = document.querySelector('.changeCard');
const changecard1 = document.querySelector('.changeCard1');
const transferCardInp = document.querySelector('#transferCardInp');
const userDB = JSON.parse(localStorage.getItem('user'));
const setTransactionLimit = document.querySelector('#transactionLimitInp');
const transactionLimitBtn = document.querySelector('#transactionLimitBtn');

const user = new UserAccount(userDB.name, userDB.email);

user.addCard();
user.addCard();

const card1 = user.getCardByKey(1);
const card2 = user.getCardByKey(2);

function updateInfoBox(card) {
    const options = card.getCardOptions();
    boxInfo.innerHTML = `
        <h3>card number: <span class="cardNumber">${options.key}</span></h3>
        <h3>card balance: <span class="cardBalance">${options.balance}</span></h3>
        <h3>transaction limit: <span class="transactionLimit">${options.transactionLimit}</span></h3>
        <h3>history logs: <span class="historyLogs">${options.historyLogs}</span></h3>
    `;
}

updateInfoBox(card1);
updateInfoBox(card2);

changecard.addEventListener('click', () => updateInfoBox(card2));
changecard1.addEventListener('click', () => updateInfoBox(card1));

function handleTransaction(card1, card2) {
    depositeBtn.addEventListener('click', () => {
        card1.putCredits(+depositeInp.value);
        updateInfoBox(card1);
    });

    withdrawBtn.addEventListener('click', () => {
        card1.takeCredits(+withdrawInp.value);
        updateInfoBox(card1);
    });

    transferBtn.addEventListener('click', () => {
        card1.transferCredits(+transferInp.value, card2);
        updateInfoBox(card1);
    });

    transactionLimitBtn.addEventListener('click', () => {
        card1.setTransactionLimit(+setTransactionLimit.value);
        updateInfoBox(card1);
    });

    depositeBtn.addEventListener('click', () => {
        card2.putCredits(+depositeInp.value);
        updateInfoBox(card2);
    });

    withdrawBtn.addEventListener('click', () => {
        card2.takeCredits(+withdrawInp.value);
        updateInfoBox(card2);
    });

    transferBtn.addEventListener('click', () => {
        card2.transferCredits(+transferInp.value, card1);
        updateInfoBox(card2);
    });

    transactionLimitBtn.addEventListener('click', () => {
        card2.setTransactionLimit(+setTransactionLimit.value);
        updateInfoBox(card2);
    });
}

handleTransaction(card1, card2);

