function pataNahi(fn, delay) {
  // console.log(arguments);
  let myId;
  return function (...args) {
    // ...args - copy of original array
    // agar function return hora hai toh iske saath pataNahi() function me jo bhi hai oh b saath me jata hai isko bolte hai teffin concept
    console.log(args);
    clearTimeout(myId);
    myId = setTimeout(() => {
      // setTimeout: Returns a timeout ID (number) that can be used to clear the timeout.
      fn.apply(this, args); // 'this' se context pass hora hai
    }, delay);
  };
} 
// the above code is a concept of Debouncing
// Debounce Alogrithm
  // remove past request => keep a reference of it
  // fire new request means adds new request
  // userRequest() => debounceUserRequest()
// ------

// ...args => The rest parameter syntax allows a function to accept an indefinite number of arguments as an array
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments

function greet(name) {
  console.log(`Hello ${name}`);
}

// pataNahi(() => greet("Saleh"), 3000); // () => greet("Saleh") is matlab reference lo and abhi run nhi karna
// pataNahi(greet("saleh"), 3000) // greet("saleh") isko call kardo instantly

const sachMePataNahi = pataNahi(() => greet("Saleh"), 3000); // we holding pataNahi() function in variable because pataNahi() function returning a function and ) => greet("Saleh") is matlab reference lo and abhi run nhi karna

sachMePataNahi()
sachMePataNahi()
sachMePataNahi()
// o/p ==> Hello Saleh
// 'Hello Saleh' ek hi baar print hoga because previous calls jo kiye the oh sab clear hojayingi because we clearing the setTimeOut() using clearTimeOut()

// debounce karne k liye purani request hatani hai aur new request leni hai



// arguments: An array-like object available inside functions that holds passed arguments.
// call: Invokes a function with a given `this` value and arguments passed individually.
// apply: Invokes a function with a given `this` value and arguments passed as an array.
// bind: Returns a new function with a bound `this` value and preset arguments.
// this: Refers to the execution context, which varies based on how a function is called.



// VERY IMPORTANT NOTE TO UNDERSTAND JAVASCRIPT ==> konse memory me data jara hai and oh daigram (event loop) yaad rahkna hai because functions kis kis queue me jara hai aur kaise execution hora hai 