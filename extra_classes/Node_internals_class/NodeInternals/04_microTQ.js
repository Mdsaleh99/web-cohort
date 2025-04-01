console.log("console 1");
Promise.resolve().then(()=> console.log('promise '))
process.nextTick(() => console.log("process.nextTick 1"));
console.log("console 2");


