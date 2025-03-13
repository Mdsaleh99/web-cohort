const quotes = [
  "Believe you can and you're halfway there.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Don't watch the clock; do what it does. Keep going.",
  "The only way to do great work is to love what you do.",
  "Opportunities don't happen. You create them.",
  "It always seems impossible until it's done.",
  "Dream big and dare to fail.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Do what you can, with what you have, where you are.",
  "Act as if what you do makes a difference. It does.",
  "You are never too old to set another goal or to dream a new dream.",
  "Start where you are. Use what you have. Do what you can.",
  "Difficulties in life are intended to make us better, not bitter.",
  "Happiness is not something ready-made. It comes from your own actions.",
  "Your time is limited, so don't waste it living someone else's life.",
];


const quoteDisplay = document.getElementById("quoteDisplay")
const generateBtn = document.getElementById("generateBtn")

function generateQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length); ;
    quoteDisplay.innerText = quotes[randomIndex]
    
}

generateBtn.addEventListener("click", generateQuote)