// Machine Coding

const arr = [1, 2, 3, 4, 5, 6];
// 1) forEach
// when we have to write polyfill for any function first we have to understand the function how  it works
// Real signature ko samjo means ek function kya input aur output leta hai and kis tarike ka uska format hai aur kya behaviour hai uss function ka

// ********* forEach signature => no return, function input as parameters, 1st parameter value, 2nd parameter index, and function kaam karta hai-calls my function for every value *********

// const ret = arr.forEach(function (value, index) {
//     console.log(value, index);
// })
// console.log(ret); // here output is undefined so it does not return anything

if (!Array.prototype.myForEach) {
  // initailly this function is not there myForEach. so condition will be true
  Array.prototype.myForEach = function (userFn) {
    const originalArr = this; // here 'this' current object ki taraf point karta hai. 'this' matlab here jis bhi array k upper user call karra hai. for e.g = here 'arr' is 'this' here

    for (let i = 0; i < originalArr.length; i++) {
      userFn(originalArr[i], i);
    }
  };
}

arr.myForEach(function (value, index) {
  console.log(`myForEach function value ${value} and index is ${index}`);
});
