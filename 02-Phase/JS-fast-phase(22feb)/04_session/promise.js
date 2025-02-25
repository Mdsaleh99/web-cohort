const fs = require("fs");

console.log("program starts");

// fs.readFileSync('./hello.txt', 'utf-8') // blocking code means synchronize code


// ------- Legacy code -------
fs.readFile("./hello.txt", "utf-8", function (err, data1) {
  // it is non-blocking code means it is asyncrohize code because it does not return promise and it has callback function to handle err and data. so if we have to use fs with promises we have to import the fs/promises
  if (err) return console.error("Error reading file1:", err);
  console.log("File1 Content:", data1);

  fs.writeFile("file2.txt", data1 + " - Copied", (err) => {
    if (err) return console.error("Error writing to file2:", err);
    console.log("File2 Created Successfully");

    fs.appendFile("file2.txt", "\nAppended Text", (err) => {
      if (err) return console.error("Error appending to file2:", err);
      console.log("Text Appended to File2");

      fs.readFile("file2.txt", "utf8", (err, data2) => {
        if (err) return console.error("Error reading file2:", err);
        console.log("Updated File2 Content:", data2);
      });
    });
  });
});

// ------- Legacy code ------- END -----

sum(5, 10, (value) => {
  console.log("Result: ", value);
});

console.log("End of program");

function sum(a, b, cb) {
  setTimeout(() => {
    cb(a + b);
  }, 4 * 1000);
}
