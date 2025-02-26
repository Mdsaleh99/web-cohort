const fs = require("fs");
// const fsV2 = require("fs/promises")

// converting legacy code to modren code

// nodejs ka jo fs/promises hai usme jo function banaye hai with support of promise oh aise hi likhe hai jaise hum ne niche banaye hai like readFileWithPromise, etc

// Legacy code ko asynchronize banana hai toh callback use hota tha

// converting legacy callback code to support promises is known as Promisification

// ++++++++++++++++++++++++++ custom promises starts +++++++++++++++++++++++++++++

console.log("Program starts");

function readFileWithPromise(filePath, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, encoding, function(err, content) {
      if (err) {
        reject(err); // reject ka connection 'catch()' k saath hai and reject gives signal to 'catch()' to execute the 'catch()' function. reject means 'rejected' stage
      } else {
        resolve(content); // resolve ka connection 'then()' k saath hai and resolve gives signal to 'then()' to execute the 'then()' function. resolve means 'fullfilled' stage
      }
    });
  });
}

function writeFileWithPromise(filepath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function unlinkWithPromise(filepath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filepath, function (e) {
      if (e) {
        reject(e);
      } else {
        resolve();
      }
    });
  });
}

// Multiple Async code is running in sync fashion
readFileWithPromise('./hello.txt', 'utf-8')
  .then((content) => writeFileWithPromise('./backup.txt', content))
  .then(() => unlinkWithPromise('./hello.txt'))
  .catch((e) => console.log('Error', e))
  .finally(() => console.log('All DOne'));

console.log("Program ends");

// ++++++++++++++++++++++++++ custom promises end +++++++++++++++++++++++++++++

// ++++++++++++++++++++++++ async await ++++++++++++++++++++++++++++++++++++

// async and await runs on promises behind the sences and async await is a syntatic sugar for promises
// async and await ===> async code ko sync me execute karta hai it means code toh async hoga but wahi code synchronizally run hoga ya execute hoga
// jab function ko async mark karte hai toh oh function promise return karta hai
// await use karne se oh code wahi resolve ho jata hai and wahi return b karta hai if that particluar function return something
// await keyword use karna hai toh function use karna hoga and uss function ko async banana hai and error handle karna hai toh uss code ko try-catch me likna hoga

// write a Async function that waits for 10 seconds before deleting the file which is hello.txt
// async return promise so we returned promise 
function wait(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), seconds * 1000);
  });
}

// promises and async await me asynchornous code handle karna hai toh async await is recommended because async await use karne se code readability imporve hogi. but performance pe koyi effect nhi hoga dono me promises and async await

// (Syntax Sugar)
async function doTasks() {
  // doTasks() micro task queue me jaayega aur readFileWithPromise() iss function ko run karna start hua
  try {
    const fileContent = await readFileWithPromise("./hello.txt", "utf-8");
    await writeFileWithPromise("./backup.txt", fileContent);
    await wait(10);
    await unlinkWithPromise("./hello.txt");
    throw new Error(""); // jab yah error aayega tab ye catch() k pass error through karega ya transfer karega
  } catch (e) {
    console.log("Error", e);
  } finally {
    console.log("All DOne");
  }
}

doTasks().then(() => console.log("All Done")).catch(() => console.log("Error")) // jo upper error throw kiya tha oh idhar catch hoga catch() me