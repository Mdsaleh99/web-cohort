//1
// console.log("Start");
// setTimeout(()=>console.log("Timeout Called"),3000);
// const add = require("./add.js");

// console.log(add(2,3));
// console.log("End");


// 2

const {  counter,increment,decrement } = require("./counter");

console.log(counter);
increment();
console.log(counter);  // not updates because it creates a copies

// 3



