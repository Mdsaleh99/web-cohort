/*

Problem statement

A lost-and-found department stores each report as an object with (name, item). Return a list of all unique item names reported, sorted alphabetically.

Input
An array of objects like:

[{name: "Avi", item: "Phone"}, {name: "Bea", item: "Wallet"}, {name: "Avi", item: "Phone"}]

Return an array of unique item names, sorted alphabetically.

*/

function solve(input) {
  // Get unique item values from input array:
  // 1. input.map(...) extracts all 'item' values
  // 2. new Set(...) removes duplicates
  // 3. [...new Set(...)] spreads unique values into a new array
  const uniqueItems = [...new Set(input.map((entry) => entry.item))];
  return uniqueItems.sort();
}

console.log(
  solve([
    { name: "Avi", item: "Phone" },
    { name: "Bea", item: "Wallet" },
    { name: "Avi", item: "Phone" },
  ])
);
