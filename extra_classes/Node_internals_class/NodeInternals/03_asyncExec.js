const fs = require('fs')

console.log("One")

fs.readFile(__filename, () =>{
    console.log('Two')
})

console.log('Three')

// ------------------------------

