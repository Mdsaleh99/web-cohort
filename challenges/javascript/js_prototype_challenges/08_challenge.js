/*

Problem statement
Create a Library constructor that initializes a books array. Implement:
addBook(book): Adds a book to the books array.
findBook(title): Searches for a book by title and returns "Book found" or "Book not found".

Challenge
Implement Library constructor with a books array.
Attach addBook (book) and findBook (title) methods to the prototype

*/

function Library() {
  // Initialize books property
  this.books = [];
}

// Define addBook method on Library's prototype
Library.prototype.addBook = function (book) {
  this.books.push(book);
};

// Define findBook method on Library's prototype
Library.prototype.findBook = function (title) {
  if (this.books.includes(title)) {
    return "Book found";
  } else {
    return "Book not found";
  }
};
