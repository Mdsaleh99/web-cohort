/*

Problem Statement
You are building an online shopping platform. Some products have discounts, and some don't. You need to check whether a product object contains a discount property.

Challenge
Write a function that checks if a product object has a discount property and returns true or false.

Constraints
product should be a valid object.

*/

function hasDiscount(product) {
  // Check if product has discount property
  if (product.hasOwnProperty("discount")) {
    return true;
  }
  return false;
}
