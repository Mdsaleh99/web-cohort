// console.log("Start");

// function greetMe(){
//     return "Welcome"
// }

// const start = Date.now();
// while(Date.now() - start < 5000){}// just for blocking delay

// console.log("End")

// let counter = 0;

// function increment(){
//     counter++;
// }



// module.exports = {counter,increment}

console.log(module.exports === exports);
exports = "Welcome";
console.log(module.exports === exports); 
