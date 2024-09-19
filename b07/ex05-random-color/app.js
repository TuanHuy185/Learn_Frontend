let colorCharacters = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function randomColor() {
  let colorCode = '#';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * colorCharacters.length);
    colorCode += colorCharacters[randomIndex];
  }

  return colorCode;
}

function updateColor() {
  const color = randomColor();

  document.querySelector('.color-box').style.backgroundColor = color;
  document.querySelector('.color-text').textContent = color;
}

function copyColorToClipboard() {
  const colorText = document.querySelector('.color-text');
  navigator.clipboard.writeText(colorText.textContent)
  alert('Copied: ' + colorText.textContent);
}

document.querySelector('.btn').addEventListener('click', updateColor);
document.querySelector('.color-text').addEventListener('click', copyColorToClipboard);

