/*

What are Buffers in Node.js?
    A Buffer is a temporary storage area for binary data.
    Node.js does not support direct binary manipulation (like C/C++), so Buffers help handle raw data efficiently.
    Used mostly when dealing with file streams, network data, and binary protocols.



Why Do We Need Buffers?
    JavaScript Strings are UTF-16 encoded, making direct binary data handling inefficient.
    Buffers store binary data outside V8's heap.
    Useful when working with:
        File System (fs module)
        Networking (TCP, UDP, WebSockets)
        Streams (handling chunks of data)

! https://nodejs.org/api/buffer.html#buffers-and-character-encodings
*/


const { Buffer } = require("buffer")

// const buf = Buffer.alloc(4)
// console.log(buf);
// console.log(buf[1]);


// const buf = Buffer.from("Hello world")
// console.log(buf);
// console.log(buf.toString());

// const bufTwo = Buffer.allocUnsafe (110);
// console.log(bufTwo);

// const buf = Buffer.alloc(10)
// buf.write('Hello')
// console.log(buf.toString());

// const bufTwo = Buffer.from("chai aur code")
// console.log(bufTwo.toString());
// console.log(bufTwo.toString("utf-8", 0, 4));

const bufThree = Buffer.from("Chai");
console.log(bufThree);
bufThree[0] = 0x4A
console.log(bufThree);
console.log(bufThree.toString());


const buf1 = Buffer.from("Chai aur")
const buf2 = Buffer.from(" Code")
const merged = Buffer.concat([buf1, buf2])
console.log(merged.toString());
console.log(merged.length);
