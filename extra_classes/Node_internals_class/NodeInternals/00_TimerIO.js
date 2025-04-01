const fs = require('fs')

fs.readFile(__filename, () => {
    console. log("readFile 1");
})
setTimeout(()=>console.log("Timeout Called 1"),1000)

console.log('log')
