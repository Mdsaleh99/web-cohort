const container = document.getElementsByClassName("container");
const hand = document.querySelectorAll(".hand");
const clock = document.getElementsByClassName("clock");
const clockByClassName = document.querySelector(".container .clock");
const hour = document.getElementsByClassName("hour");
const hourByClassName = document.querySelector(".clock .hour");
const minute = document.getElementsByClassName("minute");
const second = document.getElementsByClassName("second");
const digitalClock = document.getElementsByClassName("digital-clock");
const dateDisplay = document.querySelector(".date"); // querySelector(".date") - Selects ONLY the first element with the class "date"
// const date = document.getElementsByClassName("date") // getElementsByClassName("date") - Selects ALL elements with the class "date" (returns HTMLCollection)

// document.addEventListener("DOMContentLoaded", () => {
//     const div = document.createElement("div");
//     div.classList.add("number");
//     // hourByClassName.classList.add("number")
//     for (let i = 1; i <= 12; i++){
//         const span = document.createElement("span");
//         span.innerText = i;
//         div.appendChild(span);
//         clockByClassName.appendChild(div);
//         // clock.appendChild(span);
//     }
// })

document.addEventListener("DOMContentLoaded", () => {
  for (let i = 1; i <= 12; i++) {
    const div = document.createElement("div");
    div.classList.add("number");

    // Set custom CSS variable for rotation
    div.style.setProperty("--rotation", `${i * 30}deg`); // 360° / 12 = 30°

    const span = document.createElement("span");
    span.innerText = i;
    div.appendChild(span);

    clockByClassName.appendChild(div);
  }
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  dateDisplay.innerHTML = now.toLocaleDateString(undefined, options);
  console.log(dateDisplay);
});

/*
div.style.setProperty("--rotation", ${i * 30}deg)
This sets a custom CSS variable (--rotation) on each clock number.
The value is calculated as i * 30deg, where:
    i is the current hour number (1 to 12).
    Each hour on a clock is spaced 30 degrees apart

The setProperty() method allows setting CSS custom properties (variables) dynamically in JavaScript.

--rotation is a custom property created in JavaScript using setProperty().
It is not a built-in CSS property; you define it yourself.
CSS uses var(--rotation) to apply transformations.

=============================================================
const dateDisplay = document.querySelector(".date"); // querySelector(".date") - Selects ONLY the first element with the class "date"
const date = document.getElementsByClassName("date") // getElementsByClassName("date") - Selects ALL elements with the class "date" (returns HTMLCollection)
// Example Usage:
// dateDisplay.innerText = "March 3, 2025";  // Works directly on the first element
// date[0].innerText = "March 3, 2025";  // Access the first element from the collection
// Array.from(date).forEach(el => el.innerText = "March 3, 2025");  // Modify all elements

*/
