setTimeout(()=>console.log("Timeout Called 1"),0) //5
setTimeout(()=> {
    console.log("Timeout Called 2")//6
    process.nextTick( ()=>{
        console.log('this is nt inside next tick') //7
        setTimeout(()=>console.log("Timeout Called 1"),0)
    })
},0)
setTimeout(()=>console.log("Timeout Called 3"),0) // 8

console.log("console 1"); //1
Promise.resolve().then(()=> console.log('promise ')) //4
process.nextTick(() => console.log("process.nextTick 1")); //3
console.log("console 2"); //2














// Promise.resolve().then(() =>{
//     console.log("Promise.resolve 1")
//     process.nextTick(() => console.log("inside promise process.nextTick 1"));
//     // setTimeout(()=>console.log("Timeout Called inside promise"),0)
// });
// process.nextTick(() => {
//     console.log("process.nextTick 2")
//     Promise.resolve().then(()=> console.log('Promise inside nextTick '))
// });

