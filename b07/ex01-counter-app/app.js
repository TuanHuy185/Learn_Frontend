const elCounter = document.getElementById('number');
const elBntIncrease=document.getElementById('btn-increase');
const elBntDecrease=document.getElementById('btn-decrease');
const elBntReset=document.getElementById('btn-reset');
const elBntSave=document.getElementById('btn-save');
const elHistory = document.getElementById('saved-number');
let count = 0;

elBntIncrease.addEventListener('click', () => {
    updateScore('increase');
});

elBntDecrease.addEventListener('click', () => {
    updateScore('decrease');
});

elBntReset.addEventListener('click', () => {
    updateScore('reset');
});

elBntSave.addEventListener('click', () => {
    /*const history = document.getElementById('saved-number');
    const newItem = document.createElement('span');
    history.appendChild(newItem);
    newItem.textContent = count + '|';*/
    elHistory.textContent+= elCounter.textContent + '|';
    updateScore('reset');
});

function updateScore(action){
    switch(action){
        case 'increase':
            count++;
            break;
        case 'decrease':
            count--;
            break;
        case 'reset':
            count=0
            break;
    }
    elCounter.textContent = count;
}