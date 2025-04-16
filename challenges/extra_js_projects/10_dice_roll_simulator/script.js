const dice = document.getElementById("dice");
const rollButton = document.getElementById("rollButton");
const resultMessage = document.getElementById("resultMessage");

rollButton.addEventListener("click", rollDice)

const diceFaces = ["\u2680", "\u2681", "\u2682", "\u2683", "\u2684", "\u2685"];

function rollDice() {
    const randomIndex = Math.floor(Math.random() * 6)

    dice.textContent = diceFaces[randomIndex]

    resultMessage.textContent = `You rolled a ${randomIndex + 1}`
}



// https://en.wikipedia.org/wiki/UTF-8
// https://www.compart.com/en/unicode/U+2683
// https://www.compart.com/en/unicode/U+2684
// https://www.compart.com/en/unicode/U+2685
// https://developer.mozilla.org/en-US/docs/Glossary/UTF-8
