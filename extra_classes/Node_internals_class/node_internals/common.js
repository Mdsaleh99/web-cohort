// require module
// console.log("Start commonjs")
// const greetMe = require("./common.greet.js");

// console.log(greetMe);


// console.log("end commonjs")

// const {counter,increment} = require("./common.greet.js");

// console.log("Before Counter: ",counter) //0
// increment()
// console.log("After Counter: ",counter)//0  // creates copy


console.log("Start")

setTimeout(()=>console.log("Timeout called"),1000);
setImmediate(()=>console.log("Immediate called"));

