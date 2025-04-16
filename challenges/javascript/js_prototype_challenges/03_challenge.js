/*

Problem statement
You need to create a Counter constructor function that initializes a count property to 0. The counter should have two prototype
methods:
increment() increases the count by 1.
decrement () decreases the count by 1.

Challenge
Implement a constructor function Counter that initializes count to 0
Attach increment() and decrement() methods to the prototype.

*/

function Counter() {
  // Initialize count property
  let count = 0;
  this.count = count;
}

// Define increment method on Counter's prototype
Counter.prototype.increment = function () {
  this.count += 1;
  return this.count;
};

// Define decrement method on Counter's prototype
Counter.prototype.decrement = function () {
  this.count -= 1;
  return this.count;
};
