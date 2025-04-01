console.log("console 1"); //1
process.nextTick(() => console.log("process.nextTick 1")); //3
console.log("console 2"); //2

Promise.resolve().then(() =>{
    console.log("Promise.resolve 1") //5   //6
    process.nextTick(() => console.log("inside promise process.nextTick 1")); //7
});
process.nextTick(() => {
    console.log("process.nextTick 2") //4
    Promise.resolve().then(()=> console.log('Promise inside nextTick ')) //6  //5
});
