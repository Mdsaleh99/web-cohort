/**
 * I should have a fn increment()
 * on call of the fn it should increment the number
 * and return the current count
 * 
 * e.g:
 *     console.log( increment() ) o/p => 1
 *     console.log( increment() ) o/p => 2
 *     console.log( increment() ) o/p => 3
*/

let count = 0

function increment() {
    count++
    return count
}

// console.log(increment());
// console.log(increment());

// count = 30
// console.log(increment());
// console.log(increment());

// in above code bhar se koyi b developer count ki value change karsakta hai but we don't want like this


// function increment() {
//   let count = 0;
//   count++;
//   return count;
// } 
// console.log(increment()); // 1
// console.log(increment()); // 1
// console.log(increment()); // 1
// console.log(increment()); // 1
// // here output will be always 1 because for each call the count value initialise with 0 and then increments to 1



function createCounter() {
    let count = 0

    // closure function (A Function binded by its lexical scope)
    return function () {
        count++
        return count
    }
}

// closure ==>  In JavaScript, a closure is a function that has access to the variables of its outer function, even after the outer function has finished executing

const x = createCounter() // x is a function because we returning a function from createCounter()
const y = createCounter() // y is a function because we returning a function from createCounter()
console.log(x()); // 1
console.log(x()); // 2
console.log(x()); // 3
console.log(y()); // 1
console.log(y()); // 2
console.log(x()); // 4
console.log(y()); // 3



