function change(x) {
  x = 20;
}
let y = 100;
console.log(y); // 100
change(y);
console.log(y); // 100
// here both console.log output is 100 because numbers are created on stack memory and the values are copied not passing the refernce. 100 values pass kiya change() function ko and local 'x' ko 20 karliya andar andar hi. 'y' ki value toh vahi rahegi 100 oh kidar b change nhi hori 


function change(x) {
    x.val = 20    
}

let z = { val: 100 }
console.log(z); // { val: 100 }
change(z)
console.log(z); //  { val: 20 }

// here both console.log output is different because objects are created on heap memory and for   change(z) function 'z' is a reference (memory address) of object not value. so we passing a memory address to change function



// +++++++++++++++++++++++++++  closure ++++++++++++++++++++++++++++++++++
function test() {
    let obj = { value: 10 }
    return true
}

// normal flow of exeution
// initially nothing is there (e.g: 0)
test() // value is 10
// test() execution is end so grabge collector delete the 'obj' variable
// initially nothing is there (e.g: 0)


// closure ==>  In JavaScript, a closure is a function that has access to the variables of its outer function, even after the outer function has finished executing. e.g:
function test() {
  let obj = { value: 10 };

  // closure function
  return function () {
    console.log(obj);
  };
}

// initially nothing is there (e.g: 0)
const innerFn = test() // value is 10. 
// we have still access of variable because innerFn is a function (because we returning a function) and innerFn has a refernce of obj. joh function return hora hai uss k parent k scope [[scope]] me 'obj' pada hai. and jab tak koyi b refernce exist karta hai Garbage collector usko clean or delete nhi karega 
innerFn()
innerFn()
innerFn()

// const innerFn = test() .    const innerFn = test()() ye dono same hai but const innerFn = test() likha toh innerFn ko call karna padega (ye se innerFn()). for this const innerFn = test()() we don't want to call innerFn because here we directly calling

// closure me ek badi problem hai oh hai 'Memory Leak'

/*
// closure is a javascript part
// lexical scoping is a convention

// closure easy definition ==> A function returning a function with its lexical scope binded is known as Closure function

How do closures work?
• The inner function maintains a reference to its lexical environment.
• This reference captures the state of the outer function at the time of its creation.
• The inner function can access the variables and parameters of the outer function.

*/

//deadly code
console.log([] + []);     // ""
console.log([1] + [2, 3]); // "12,3"
console.log([] + {});     // "[object Object]"
console.log({} + []);     // "[object Object]"
console.log({} + {});     // "[object Object][object Object]"