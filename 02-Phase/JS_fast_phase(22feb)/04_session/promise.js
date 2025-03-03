const fs = require("fs");
const fsV2 = require("fs/promises");

console.log("program starts");

// const contents = fs.readFileSync('./hello.txt', 'utf-8') // blocking code means synchronize code
// console.log("File reading success", contents);

// ------- Legacy code -------
fs.readFile("./hello.txt", "utf-8", function (err, content) {
  // it is non-blocking code means it is asyncrohize code and it does not return promise because in past years there is no concept of promises so they uses callback functions to handle err and print or handle data. so if we have to use fs with promises we have to import the fs/promises
  // promises k bina Asynchornous javascript callback k concept pe kaam kartithi. so in readFile() function we pass third argument as a callback function
  if (err) {
    console.log("Error in file reading", err);
  } else {
    console.log("File Reading Success: ", content);
  }
});

/*

1. Read the contents of file from hello.txt
2. Then create a new file named as backup.txt
3. Copy the contents of hello file to backup file
4. delete the hello file

These all are depend on each other

using above statement write program in non-blocking code means Asynchorinize
*/
fs.readFile("./hello.txt", "utf-8", function (err, content) {
  if (err) {
    console.log("Error in file reading", err);
  } else {
    console.log("File Reading Success: ", content);
    fs.writeFile("backup.txt", content, function (err) {
      if (err) {
        console.log(`Error in writing backup.txt`, err);
      } else {
        fs.unlink("./hello.txt", function (e) {
          if (e) {
            console.log("Error deleteing file", e);
          } else {
            console.log("File delete success");
          }
        });
      }
    });
  }
});

// Above we doing callback hell because inside one function we writing another function we did this because the given statement is depended on each other means ek ka input dusare ka output tha
// if we write like this code we lose code readability

// ------- Legacy code ------- END -----

// ------- Modern code ------------
fsV2
  .readFile("./hello.txt", "utf-8")
  .then((content) => fsV2.writeFile("backup.txt", content))
  .then(() => fsV2.unlink("./hello.txt"))
  .catch((e) => console.log("Error: ", e));

// readFile: Asynchronously reads a file and returns data via a callback (file content or error).
// writeFile: Asynchronously writes data to a file, returns undefined (callback handles errors).
// unlink: Asynchronously deletes a file, returns undefined (callback handles errors).


// ------- Modern code -------- END ------------

sum(5, 10, (value) => {
  console.log("Result: ", value);
});

console.log("End of program");

function sum(a, b, cb) {
  setTimeout(() => {
    cb(a + b);
  }, 4 * 1000);
}
