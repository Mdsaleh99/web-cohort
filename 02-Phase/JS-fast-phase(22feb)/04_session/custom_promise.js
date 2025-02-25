const fs = require("fs");

// converting legacy code to modren code

// nodejs ka jo fs/promises hai usme jo function banaye hai with support of promise oh aise hi likhe hai jaise hum ne upper banaye hai

// Legacy code ko asynchronize banana hai toh callback use hota tha

// legacy to promises called as Promisificaition

function readFileWithPromise(filePath, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, encoding, function(err, content) {
      if (err) {
        reject(err);
      } else {
        resolve(content); // resolve ka connection 'then()' k saath hai and resolve gives signal to 'then()' to execute the 'then()' function
      }
    });
  });
}


// async and await runs on promises behind the sences
// async and await => async code ko sync me execute karta hai
// jab function ko async mark karte hai toh oh function promise return karta hai