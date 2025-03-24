/*
* Complementary colors are pairs of colors that are opposite each other on the color wheel. When placed next to each other, they create strong visual contrast, making them stand out.
! Basic Complementary Color Pairs:
    Red ↔ Green
    Blue ↔ Orange
    Yellow ↔ Purple

! https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt#parameters
*/

const colorInput = document.getElementById("colorInput");
const colorCode = document.getElementById("colorCode");
const copyButton = document.getElementById("copyButton");
const complementaryContainer = document.getElementById(
  "complementaryContainer"
);
const saveColorButton = document.getElementById("saveColorButton");
const favoritesContainer = document.getElementById("favoritesContainer");

colorInput.addEventListener("input", () => {
  const selectedColor = colorInput.value;
  console.log(selectedColor);
  updateColorDisplay(selectedColor);
  showComplementaryColor(selectedColor);
});

function updateColorDisplay(color) {
  colorCode.textContent = color;
  colorCode.style.color = color;
}

function showComplementaryColor(color) {
  const complementaryColors = getComplementaryColor(color); // this method returns array of complement
  complementaryContainer.innerHTML = ""; // clear previous color

  complementaryColors.forEach((compColor) => {
    const colorBox = document.createElement("div");
    colorBox.classList.add("color-box");
    colorBox.style.backgroundColor = compColor;
    complementaryContainer.appendChild(colorBox);
  });
}

function getComplementaryColor(color) {
  const base = parseInt(color.slice(1), 16);
  const complement = (0xffffff ^ base).toString(16).padStart(6, "0");
  // return `#${complement}`;
  return [`#${complement}`]; // we can return like above but, here we returning as array so we have to handle difficult cases, it is a challenge to handle this
}

copyButton.addEventListener("click", () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator
  navigator.clipboard
    .writeText(colorCode.textContent)
    .then(() => alert("Color code copied")) // never do this in production
    .catch((err) => console.log("Failed to copy", err));
});

saveColorButton.addEventListener("click", () => {
    const color = colorCode.textContent
    addFavouriteColor(color)
})

function addFavouriteColor(color) {
    const colorBox = document.createElement("div");
    colorBox.classList.add("color-box");
    colorBox.style.backgroundColor = color;
    colorBox.title = color
    favoritesContainer.appendChild(colorBox);
}
console.log(this);
console.log(globalThis);
console.log(global);




// textContent: Gets all text, including hidden ones (faster, ignores styles)
// innerText: Gets only visible text (slower, considers styles)
// slice(start, end): Extracts part of a string/array without modifying the original
// If only start is given, slice() extracts from start to end of string/array

/*
! https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt#parameters
The parseInt() function in JavaScript is used to convert a string into an integer.
! parseInt(string, radix);
* string → The value to be converted into an integer.
* radix → (Optional) The base of the numerical system (e.g., 10 for decimal, 2 for binary, 16 for hexadecimal, etc.).

* Using Radix (Base)
console.log(parseInt("1010", 2));  // ➝ 10 (Binary to Decimal)
console.log(parseInt("A", 16));    // ➝ 10 (Hexadecimal to Decimal)
console.log(parseInt("52", 8));    // ➝ 42 (Octal to Decimal)

* Using the radix Parameter => By default, parseInt() assumes base 10 unless the number starts with:
"0x" → Hexadecimal (base 16)  and  "0" → Octal (in older versions of JS)

If the string starts with a number, parseInt() extracts it.
If the string starts with letters, it returns NaN (Not a Number).
console.log(parseInt("42"));       // ➝ 42
console.log(parseInt("100px"));    // ➝ 100 (Extracts number)
console.log(parseInt("abc100"));   // ➝ NaN (Invalid number)

Ignores decimals
console.log(parseInt("3.14"));     // ➝ 3
*/
