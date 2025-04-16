function greet(name) {
  console.log(`Hello ${name}`);
}

// greet("Hitesh");
// greet("Piyush");

let globalVar = "I am global";

function modifyGlobal() {
  globalVar = "I am modified";
  let blockScopedVar = "I am blocked-scoped";
  console.log(blockScopedVar);
}

// modifyGlobal();

// IIFE
// IIFE is a use and throw function it executes only one time
// there are different ways to write IIFE functions
// let config = function () { }()
// (() => { })()
// ()()

let config = (function () {
  let settings = {
    theme: "dark",
  };
  return settings;
})();

// interview qs

let person1 = {
  name: "saleh",
  greet: function () {
    console.log(`Hello ${this.name}`);
  },
};

let person2 = {
  name: "abdulla",
};
// call person1 greet function but property should be person2 which is name abdulla
person1.greet.call(person2); // Hello abdulla
person1.greet.call({ name: "Mukul" }); // Hello Mukul
// call() function me sirf context pass karna hai 'this' ka. oh chahe variable me hold kiya ho ya direct pass karre ho
// 'this' ka context change karna hai isliye call() use karre hai
// here we can use bind() instead call() but using bind() it returns a new function.
// call() function call directly

person1.greet.bind(person2); // o/p => nothing will print we have to store this in variable because bind() retruns a function, after that we have to call
const bindGreet = person1.greet.bind(person2);
bindGreet(); // Hello abdulla
console.log(bindGreet); // o/p => [Function: bound greet]
