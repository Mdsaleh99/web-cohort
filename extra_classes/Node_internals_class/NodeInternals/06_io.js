const fs = require("fs");

fs.readFile("fdsf.txt", () => {
    console. log("readFile 1");
})
setTimeout (() => console.log("setTimeout 1"), 2000);
process.nextTick(()=> console.log("nextTick 1"))
Promise.resolve().then(() => console.log('Promise'))
//  io polling 
setImmediate(() => {
    console.log("immidiate")
    setTimeout (() => console.log("setTimeout 3"), 0);
})
