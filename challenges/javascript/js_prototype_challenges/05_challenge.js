/*

Problem statement
Create a Shopping Cart system where items can be added with a price. Implement a method get TotalPrice() that calculates the total price of all items in the cart.

Challenge
Implement a constructor function ShoppingCart that initializes an empty items array.
Attach addItem(price) to the prototype to add items.
Attach getTotalPrice() to calculate the total price of items.

*/

function ShoppingCart() {
  // Initialize items property
  let items = [];
  this.items = items;
}

// Define addItem method on ShoppingCart's prototype
ShoppingCart.prototype.addItem = function (price) {
  return this.items.push(price);
};

// Define getTotalPrice method on ShoppingCart's prototype
ShoppingCart.prototype.getTotalPrice = function () {
  let totalPrice = this.items.reduce((sum, price) => sum + price, 0);
  return totalPrice;
};