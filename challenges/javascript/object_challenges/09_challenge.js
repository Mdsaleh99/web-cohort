/*

Problem Statement
You are working on a web application where objects contain nested properties. JavaScript's built-in assignment (=) creates a shallow copy, meaning changes to the copied object will also affect the original. To prevent this, you need to create a deep copy of an object, ensuring that nested objects are also cloned properly.

Challenge
Write a function that takes an object and returns a deep copy of it.

Constraints
The input should be a valid object.
The function should work with nested objects and arrays inside objects.
The function should not modify the original object

*/

function deepClone(obj) {
  // Return a deep copy of obj
  const jsonStr = JSON.stringify(obj);
  return JSON.parse(jsonStr);
}

/*

A deep copy creates a completely independent clone of an object or array, including all nested objects. Changes made to the copied object do not affect the original object.

Shallow Copy vs. Deep Copy:
Shallow Copy → Copies only the first level. Nested objects are still linked (by reference).
Deep Copy → Recursively copies all levels, breaking any references to the original.


Deep Copy Solution
Using JSON.parse() and JSON.stringify():

const original = { name: "Alice", details: { age: 25 } };
const deepCopy = JSON.parse(JSON.stringify(original));
deepCopy.details.age = 30;
console.log(original.details.age); // ✅ Output: 25 (original is safe)
⚠️ Limitation: Doesn’t handle functions, undefined, Date, or circular references.



Example: Shallow Copy Issue
const original = { name: "Alice", details: { age: 25 } };
const shallowCopy = { ...original }; // Using spread operator
shallowCopy.details.age = 30;
console.log(original.details.age); // 🔴 Output: 30 (original changed!)
Why? The details object is still referenced, not copied.

*/