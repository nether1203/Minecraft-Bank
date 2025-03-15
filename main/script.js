function UserCard(index, saveData = null){
 
    this._balance = saveData ? saveData.balance : 0;
    this._transactionLimit = saveData ? saveData.transactionLimit : 100;
    this._historyLogs = saveData ? saveData.historyLogs : [];
    this._key = index;
 
   saveCardToLocalStorage() 
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
    addCard(savedCardDate = null){
        if(this._cards.length >= 3){
            return console.warn("User can't have more than 3 cards");
        } else{
            const cardIndex = this._cards.length + 1;
            const card = new UserCard(cardIndex, savedCardDate);
            this._cards.push(card)
            this._cards.push(card);
            saveCardToLocalStorage();
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
 
    getCards(){
        return this._cards;
    }
 
    
}



function getCardsFromLocalStorege(){
    const cardsDate = JSON.parse(localStorage.getItem('cardsDate'));
    return cardsDate
}
const boxInfo = document.querySelector('.boxInfo');
const depositeBtn = document.querySelector('#depositeBtn');
const depositeInp = document.querySelector('#depositeInp');
const userDB = JSON.parse(localStorage.getItem('user'));
const historyLogs  = document.querySelector('.historyLogs')
const WithdrawnBtn = document.querySelector('#withdrawBtn')
const WithdrawnInp = document.querySelector('#withdrawInp')
const user = new UserAccount(userDB.name, userDB.email);
const savedCardsDate = getCardsFromLocalStorege();

if(savedCardsDate && savedCardsDate.length > 0 ){
    for(let cardsDate of savedCardsDate){
        user.addCard(cardsDate);
    } 
}else {
    user.addCard();
    user.addCard();
    saveCardToLocalStorage()
}

const imgLogotransaction = document.querySelector('.imgLogotransaction')

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
    if(depositeInp.value > 0){
        card1.putCredits(+depositeInp.value);
        
        infoBoxFuunction(card1, boxInfo)
        console.log(card1.getCardOptions());
        historyBoxRender(card1)

       
    }

})

WithdrawnBtn.addEventListener('click', () =>{
    if(WithdrawnInp.value > 0){
        card1.putCredits(+WithdrawnInp.value);
        
        infoBoxFuunction(card1, boxInfo)
    }
    console.log(card1.getCardOptions());
    historyBoxRender(card1)
}

 )




function historyBoxRender (card){
    historyLogs.innerHTML = ``
    card.getCardOptions().historyLogs.forEach(tarnsaction =>{
        console.log(tarnsaction.operationType);
        historyLogs.innerHTML += `  <li class="transaction">
        <img src="" alt="" class="imgLogotransaction">
        <h5 class="transationtitle">${tarnsaction.operationType}</h5>
        <div class="transactionhistory">
        <span class="transactionAmount">${tarnsaction.credits}</span>
        <span class="transactionData">${tarnsaction.operationTime}</span></div>
    </li>`
    });
}

function saveCardToLocalStorage(card){
    const cardDate = user.getCardByKey().map(card => card.getCardOptions());
    localStorage.setItem('cards', JSON.stringify(cardDate))
}



saveCardToLocalStorage()



