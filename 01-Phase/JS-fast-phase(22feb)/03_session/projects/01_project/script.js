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

// browsers always works on UTC (Universal Time Coordinated)

// The padStart() method in JavaScript adds characters to the start of a string until it reaches a specified length. string.padStart(targetLength, padString)
// targetLength → Total length you want the final string to have.
// padString (optional) → The string to add at the start. (Default is a space ' ')

setInterval(updateClock, 1000) // we giving reference of function which is 'updateClock' by doing this it automatically calls updateClock after 1 second. if we do updateClock() it runs only one time
updateClock() // this is written because when we refresh the page it shows '00:00:00 AM' and 'Loading date' so to fix that we written this

// study more about these 3
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString

