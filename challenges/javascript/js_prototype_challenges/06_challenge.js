/*

Problem statement
Create a BankAccount constructor that initializes:
A balance property representing the account balance.
A transactions array to log all deposit and withdrawal activities.
Implement the following methods on the prototype:
1. deposit (amount):
Increases the balance by the given amount.
Adds a transaction log in the format: "Deposited X" (where X is the amount).

2. withdraw(amount):
Decreases the balance by the given amount.
Prevents overdraft (cannot withdraw if balance is insufficient).
If withdrawal is successful, log: "Withdrew X".
If balance is insufficient, log: "Insufficient balance".

3. getTransactionHistory():

Challenge
Returns the list of all transactions as an array of strings in the order they occurred.
Implement BankAccount constructor with balance and transactions.
Attach deposit (amount), withdraw (amount), and getTransactionHistory() methods to the prototype.

*/
function BankAccount(balance) {
  // Initialize balance and transactions properties
  let transactions = [];
  this.balance = balance;
  this.transactions = transactions;
}

// Define deposit method on BankAccount's prototype
BankAccount.prototype.deposit = function (amount) {
  this.balance += amount;
  this.transactions.push(`Deposited ${amount}`);
};

// Define withdraw method on BankAccount's prototype
BankAccount.prototype.withdraw = function (amount) {
  if (amount > this.balance) {
    return this.transactions.push("Insufficient balance");
  } else {
    this.balance -= amount;
    this.transactions.push(`Withdrew ${amount}`);
  }
};

// Define getTransactionHistory method on BankAccount's prototype
BankAccount.prototype.getTransactionHistory = function () {
  // let allTransactions = this.transactions.forEach((item) => item)
  // return allTransactions
  return this.transactions;
};
