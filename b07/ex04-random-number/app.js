const elMin = document.getElementById('min');
const elMax = document.getElementById('max');
const elResult = document.getElementById('result');
const elBtnGenerate = document.getElementById('btn-generate');

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buttonClick() {
    const minInput = elMin.value;
    const maxInput = elMax.value;

    const min = parseInt(minInput);
    const max = parseInt(maxInput);

    if (isNaN(min) || isNaN(max) || min > max) {
        alert('Vui lòng nhập giá trị min và max');
        return;
    }

    const generatedNumber = randomNumber(min, max);
    elResult.value = generatedNumber;
}

elBtnGenerate.addEventListener('click', buttonClick);
