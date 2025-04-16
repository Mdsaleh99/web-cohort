/*

Problem statement
You are developing an online store system where each product has the following properties:
name: The name of the product (e.g., "Laptop").
price: The price of the product (a positive integer).
stock: The available stock (a non-negative integer).

Your task is to implement the following methods:
1. applyDiscount(percent)
Reduces the price of the product by the given percentage.
The final price should be rounded to the nearest integer (use Math.round).
• Example: If a product costs $1000 and a 10% discount is applied, the new price should be $900.
2. purchase(quantity)

Challenge
• If the requested quantity is available in stock, reduce the stock accordingly.
• If not enough stock is available, return "Not enough stock".
• Example: If 5 items are in stock and the user buys 3, the new stock should be 2.

Implernent the Product constructor with name, price, and stock properties.
Attach applyDiscount (percent) and purchase (quantity) methods to the prototype (for memory efficiency).
Ensure integer values for price after applying a discount.
Handle edge cases like zero stock or excessive purchases.

*/

function Product(name, price, stock) {
  // Initialize name, price, and stock properties
  this.name = name;
  this.price = price;
  this.stock = stock;
}

// Define applyDiscount method on Product's prototype
Product.prototype.applyDiscount = function (percent) {
  this.price = Math.round(this.price - this.price * (percent / 100));
  return this.price;
};

// Define purchase method on Product's prototype
Product.prototype.purchase = function (quantity) {
  if (quantity > this.stock) {
    return "Not enough stock";
  } else {
    return this.stock - quantity;
  }
};
