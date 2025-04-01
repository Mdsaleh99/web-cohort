// You will understand this only if you will practice this topic on your end 
const fs = require("fs");
fs.readFile(__filename, () => {
    console. log("readFile 1");
    setImmediate(()=> console.log('Immidiate 1'))
})
setTimeout (() => console.log("setTimeout 1"), 0);

setTimeout(() => console.log('setTimeout 2'),0)
setImmediate(()=>{
    console.log('Immidiate 2')
})