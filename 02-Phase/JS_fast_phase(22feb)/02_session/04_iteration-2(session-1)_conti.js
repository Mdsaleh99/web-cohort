// This file is continuation of session 1 04_iteration.js

//  In this we will revisting to the reduce function

let expenses = [
  { description: "Groceries", amount: 50, category: "Food" },
  { description: "Electricity Bill", amount: 100, category: "Utilities" },
  { description: "Dinner", amount: 30, category: "Food" },
  { description: "Internet Bill", amount: 50, category: "Utilities" },
];

// create a exprense report and user have to know about in which categroy they spend how much amount. e.g => for Food category the expense is 80
// reduce returns the accumlator datatype like if it is object it return object. if it is array it return array. if it is number it return number

let expenseReport1 = expenses.reduce((report, expense) => {
  report[expense.category] += expense.amount;
  return report;
}, {});

console.log("Expense Report", expenseReport1); // o/p => Expense Report { Food: NaN, Utilities: NaN } here values are NaN because we did'nt intialise that property value we just initialised empty object e.g {}, so to solve this we have to initialise the values like Food: 0, Utilities: 0

let expenseReport2 = expenses.reduce(
  (report, expense) => {
    report[expense.category] += expense.amount;
    return report;
  },
  { Food: 0, Utilities: 0 }
);
// this code gives proper output as we needed but in this code there is a catch that is the code is not dynamic if we add new category to expenses then we have to initailise that category in reduce like we initailsed "Food and Utilities"
// console.log("Expense Report", expenseReport2); // o/p => Expense Report { Food: 80, Utilities: 150 }

let expenseReport3 = expenses.reduce(
  (report, expense) => {
    report[expense.category] = (report[expense.category] || 0) + expense.amount;
    return report;
  },
  { Food: 0, Utilities: 0 }
);

console.log("Expense Report-3", expenseReport3);

// ***********************************************************************************

let tasks = [
  { description: "Write report", completed: false, priority: 2 },
  { description: "Send mail", completed: true, priority: 3 },
  { description: "Prepare presentation", completed: false, priority: 1 },
];
// it is a todo list
// give the task which is not completed and sort that tasks

let pendingSortedTasks = tasks
  .filter((task) => !task.completed)
  .sort((a, b) => a.priority - b.priority);

console.log(pendingSortedTasks);

// ***********************************************************************************

let movieRatings = [
  { title: "Movie A", ratings: [4, 5, 3] },
  { title: "Movie B", ratings: [5, 5, 4] },
  { title: "Movie C", ratings: [3, 4, 2] },
];
// find the average movie rating
// output should be like this => [{title: "Movie A", ratings: 3.21}, {title: "Movie B", ratings: 3.1}, {title: "Movie C", ratings: 3.2}]
let averageRatings = movieRatings.map((movie) => {
  let total = movie.ratings.reduce((sum, rating) => sum + rating, 0);
  let average = total / movie.ratings.length;
  //   movie.ratings = average;
  //   return movie;
  return { title: movie.title, averageMovieRating: average.toFixed(2) };
})

console.log(averageRatings);
