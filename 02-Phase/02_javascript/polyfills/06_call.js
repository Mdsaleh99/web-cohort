if (!Function.prototype.myCall) {
  Function.prototype.myCall = function (thisArgs, ...args) {
    thisArgs = thisArgs || globalThis;
    const fnKey = Symbol("fn");
    thisArgs[fnKey] = this;
    const result = thisArgs[fnKey](...args);
    delete thisArgs[fnKey];

    return result;
  };
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
  // https://www.w3schools.com/js/js_function_call.asp
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
}
function greet(hi) {
  console.log(`Hello, my name is ${this.name}, ${hi}`);
}

const person = {
  name: "Alice",
  fs: "some existing value", // No conflict because we use Symbol()
};
const person2 = {
  name: "Bob",
  fs: "some existing value", // No conflict because we use Symbol()
};

// greet.myCall(person);
// console.log(person.fn); // Still "some existing value" - no overwriting!

Function.prototype.myCall2 = function (context, ...args) {
  const func = this; // this inside myCall2 refers to someFunction, i.e., the function that called myCall2. holds a reference of that function               someFunction.myCall2(someContext, arg1, arg2);

  // context.fn = func;
  const obj = { ...context }; // copy of person2 it is a shallow copy. Create a shallow copy of the provided context object to avoid modifying the original
  console.log("before: ", obj);

  obj.fn = func; // fn points to func means referencing the function func. Assign the function (that called .myCall2) as a method of the newly created object

  console.log("after: ", obj);

  obj.fn(...args); // calling that fn function with given ...args.  Invoke the function using obj, ensuring `this` refers to the correct context
  // console.log(...args);
  
};

greet.myCall2(person2);
console.log("**************************************************");
greet.myCall2(person2, "hello");