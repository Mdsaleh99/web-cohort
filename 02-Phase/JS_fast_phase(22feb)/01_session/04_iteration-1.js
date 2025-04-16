// reduce function is important and it also important in machine coding round

let salesData = [
  { product: "Laptop", price: 1200 },
  { product: "Smartphone", price: 800 },
  { product: "Headphones", price: 150 },
  { product: "Keyboard", price: 80 },
];

let totalSales = salesData.reduce((acc, sale) => acc + sale.price, 0);
// reduce function loops over the given array or object etc.. to add the values here.
// array1.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);
// accumulator k pass initialValue hoti hai starting me uske baad har iteration me accumulator me price ki value add hoti jayegi. e.g 0+1200+800+150+80=2230
// console.log(totalSales);


// ******************************************************************************************

// Advance part of reduce function
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#function_sequential_piping
// this above concept most commonly asked in interviews as it is puchi jaati hai. like "BUILD YOUR OWN PIPE IN JAVASCRIPT"
// what is pipe => "saleh".toUpperCase().indexOf("e")   yah jo ek k baad ek function lihke hai wahi piping hoti hai

// ******************************************************************************************


// Items less than 50
let inventory = [
  { name: "Widget A", stock: 30 },
  { name: "Widget B", stock: 120 },
  { name: "Widget C", stock: 45 },
  { name: "Widget D", stock: 70 },
];

let lowStockItems = inventory.filter((item) => {
  // filter() - Returns the elements of an array that meet the condition specified in a callback function.
  return item.stock < 50;
});
// filter se jo hamein output milta hai woh atleast array hota hai chahe empty ho oh array hi hota hai
// console.log(lowStockItems); // o/p => [ { name: 'Widget A', stock: 30 }, { name: 'Widget C', stock: 45 } ]


// This is tipically like interview question
let userActivity = [
  { user: "Alice", activityCount: 45 },
  { user: "Bob", activityCount: 72 },
  { user: "Charlie", activityCount: 33 },
];
// find most active user using reduce function and no other functions


let mostActiveUser = userActivity.reduce((maxUser, user) => 
  user.activityCount > maxUser.activityCount ? user : maxUser
)
// maxUser is accumulator and user is current value or current user
console.log(mostActiveUser); // o/p => { user: 'Bob', activityCount: 72 }
// reduce me jo currentValue hai uska kaam hi yeh hai ki oh har value k paas jaayega and maxUser jo hai oh hai accumulator jo apne aap me ek function hota hai
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#parameters
// Read from above url to know more about reduce()
/*
accumulator
The value resulting from the previous call to callbackFn. On the first call, its value is initialValue if the latter is specified; otherwise its value is array[0].

currentValue
The value of the current element. On the first call, its value is array[0] if initialValue is specified; otherwise its value is array[1].

currentIndex
The index position of currentValue in the array. On the first call, its value is 0 if initialValue is specified, otherwise 1.

initialValue (Optional)
A value to which accumulator is initialized the first time the callback is called. If initialValue is specified, callbackFn starts executing with the first value in the array as currentValue. If initialValue is not specified, accumulator is initialized to the first value in the array, and callbackFn starts executing with the second value in the array as currentValue. In this case, if the array is empty (so that there's no first value to return as accumulator), an error is thrown.

*/
