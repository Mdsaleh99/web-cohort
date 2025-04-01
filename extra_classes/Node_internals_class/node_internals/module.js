// console.log("Start module")
// // import test from "./module.greet.js";  // static import
// import("./module.greet.js").then((val)=>console.log(val.default)) // dynamic importing
// // console.log(test);

// console.log("end module")


import {counter,increment} from  "./module.greet.js";

console.log("Before Counter: ",counter) // 0
increment()
console.log("After Counter: ",counter) // 1
