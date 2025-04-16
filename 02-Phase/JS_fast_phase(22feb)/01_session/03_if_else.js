function prepareChai(type) {
  if (type === "Masala Chai") {
    console.log("Adding spices to the chai");
  } else {
    console.log("Preparing regular chai");
  }
}

prepareChai("Masala Chai");
prepareChai("Ginger Chai");

/*
Ek online store mein, agar customer ka total bill amount 1000 se zyada hai, toh 10% discount milta hai. Nahi toh, full amount pay karna padta hai.

*/

function calculateTotal(amount) {
  // convert to number
  //   if (amount > 1000) {
  //     return amount * 0.9;
  //   }
  //   return amount;

  return amount > 100 ? amount * 0.9 : amount;
}

let finalBill = calculateTotal(1200);
// console.log(finalBill);
// console.log(calculateTotal(1300));

/*
Ek traffic light system mein, agar light "red" hai, toh "Stop" print karo. Agar "yellow" hai, toh "Slow down" print karo. Agar "green" hai, toh "Go" print karo.


*/

function trafficLight(color) {
  switch (color) {
    case "red":
      console.log("Stop");
      break;
    case "yellow":
      console.log("Slow down");
      break;
    case "green":
      console.log("Go");
      break;
    default:
      console.log("Chalan kaat do");
  }
}

trafficLight("yellow");

function checktruthyValue(value) {
  if (value) {
    console.log("Truthy");
  } else {
    console.log("Falsy");
  }
}

checktruthyValue(1); // Truthy
checktruthyValue(0); // Falsy
checktruthyValue("hitesh"); // Truthy
checktruthyValue(""); // Falsy
checktruthyValue([]); // Truthy
checktruthyValue([1, 2, 3]); // Truthy
checktruthyValue(undefined) // Falsy
checktruthyValue(null) // Falsy

function login(username, password) {
  if (username === "admin" && (password === "1234" || loginIp == "127")) {
    console.log("Login successful");
  } else {
    console.log("Invalid credentials");
  }
}
