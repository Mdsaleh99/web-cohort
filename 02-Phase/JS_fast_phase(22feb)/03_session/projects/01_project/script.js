function updateClock() {
    const timeElement = document.getElementById("time");
    // console.log(timeElement);
    const dateElement = document.getElementById("date");

    const now = new Date();
    const hours = now.getHours() % 12 || 12; // now.getHours() % 12 || 12 this code is like   0 || 12 when now.getHours() % 12 this value becomes 0 (e.g: 12 % 12) which is falsy value so when it 0 it gives 12 because 12 is truthy value
    const minutes = now.getMinutes().toString().padStart(2, "0");
    // minutes < 10 ? `0${minutes}` : `${minutes}`
    const seconds = now.getSeconds();
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    timeElement.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
    dateElement.textContent = now.toLocaleDateString(undefined, options);
}
/*
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString#parameters
now.toLocaleDateString(undefined, options)
? In toLocaleDateString(), the first argument represents the locale (language and region format). When we pass undefined, it tells JavaScript to use the default locale of the user's browser or system.

Why undefined?
If you explicitly pass a locale (e.g., "en-US" or "fr-FR"), it forces a specific format.
If you pass undefined, JavaScript automatically detects the user's locale and applies the appropriate format.
console.log(now.toLocaleDateString("en-US", options)); // e.g., "Monday, March 3, 2025"
console.log(now.toLocaleDateString("fr-FR", options)); // e.g., "lundi 3 mars 2025"
console.log(now.toLocaleDateString(undefined, options)); // Uses system/browser default
*/

// browsers always works on UTC (Universal Time Coordinated)

// The padStart() method in JavaScript adds characters to the start of a string until it reaches a specified length. string.padStart(targetLength, padString)
// targetLength → Total length you want the final string to have.
// padString (optional) → The string to add at the start. (Default is a space ' ')
/*
let minutes = "9";
console.log(minutes.padStart(2, "0")); // "09"
*/

setInterval(updateClock, 1000) // we giving reference of function which is 'updateClock' by doing this it automatically calls updateClock after 1 second. if we do updateClock() it runs only one time
updateClock() // this is written because when we refresh the page it shows '00:00:00 AM' and 'Loading date' so to fix that we written this

// study more about these 3
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

