const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const SYMBOLS = ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "{", "[", "}", "]", ",", "|", ":", ";", "<", ">", ".", "?", "/"];

const elInputLength=document.getElementById('input-length');

function creatPassword(length, options) {
    let characters = [];

    for (let key of Object.keys(options)) {
        if (options[key]) {
            if (key === 'includeNumbers') {
                characters = characters.concat(NUMBERS);
            } else if (key === 'includeLetters') {
                characters = characters.concat(LETTERS);
            } else if (key === 'includeSymbols') {
                characters = characters.concat(SYMBOLS);
            }
        }
        else alert("Vui long chon mot loai mat khau");
    }

    if (characters.length === 0) return ''; 

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    return password;
}

function updatePassword() {
    const length = parseInt(elInputLength.value);
    const includeNumbers = document.getElementById('checkbox-numbers').checked;
    const includeLetters = document.getElementById('checkbox-letters').checked;
    const includeSymbols = document.getElementById('checkbox-symbols').checked;

    const options = {
        includeNumbers,
        includeLetters,
        includeSymbols
    };

    const newPassword = creatPassword(length, options);
    document.getElementById('result').textContent = newPassword;
}

document.querySelector('.btn-generate').addEventListener('click', updatePassword);
document.getElementById('input-length').addEventListener('input', function() {
    document.getElementById('length').textContent = this.value;
});
