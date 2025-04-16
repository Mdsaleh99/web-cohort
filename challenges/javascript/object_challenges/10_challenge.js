/*

Problem Statement
In many applications, data is stored in deeply nested objects. Accessing a property from a deeply nested object requires multiple checks to avoid errors. Instead of manually checking each level, we need a function that safely retrieves a value from a nested object using a dot-separated key path.

Challenge
Write a function that takes a nested object and a key path string (e.g., "user.address.city") and returns the value. If any part of the path is missing, return "Key not found".

Constraints
The input object should be valid.
The key path should be a string with dot notation (.) separating keys.
If a key is missing, return "Key not found".
The function should handle deeply nested objects.

*/


function getNestedValue(obj, keyPath) {
  // Return the value from the nested object based on keyPath
  let keys = keyPath.split(".");
  let current = obj;

  for (let key of keys) {
    if (current[key] === undefined) {
      return "Key not found";
    }
    current = current[key];
  }

  return current;
}