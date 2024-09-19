const num1Input = document.getElementById('number-one');
const num2Input = document.getElementById('number-two');
const resultDiv = document.getElementById('result');

const calculate = (operation) => {
  const num1 = parseFloat(num1Input.value);
  const num2 = parseFloat(num2Input.value);
  
  let result;
  if (isNaN(num1) || isNaN(num2)) {
    result = 'Invalid input';
  } else {
    switch (operation) {
      case 'add':
        result = num1 + num2;
        break;
      case 'subtract':
        result = num1 - num2;
        break;
      case 'multiply':
        result = num1 * num2;
        break;
      case 'divide':
        result = num2 !== 0 ? num1 / num2 : 'Cannot divide by zero';
        break;
      default:
        result = 'Unknown operation';
    }
  }
  resultDiv.textContent = `Result: ${result}`;
}

const addButton = document.getElementById('btn-sum').addEventListener('click', () => calculate('add'));
const subtractButton = document.getElementById('btn-subtract').addEventListener('click', () => calculate('subtract'));
const multiplyButton = document.getElementById('btn-multiply').addEventListener('click', () => calculate('multiply'));
const divideButton = document.getElementById('btn-divide').addEventListener('click', () => calculate('divide'));
