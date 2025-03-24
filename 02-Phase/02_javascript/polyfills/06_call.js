

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
function greet() {
    console.log(`Hello, my name is ${this.name}`);
}

const person = {
    name: "Alice",
    fn: "some existing value", // No conflict because we use Symbol()
};

greet.myCall(person);
console.log(person.fn); // Still "some existing value" - no overwriting!

