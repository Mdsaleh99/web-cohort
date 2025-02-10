// polyfill 
const arr = [1, 2, 3, 4, 5, 6]
// 1) forEach
// when we have to write polyfill for any function first we have to understand the function how  it works
// Real signature ko samjo means ek function kya input aur output leta hai and kis tarike ka uska format hai aur kya behaviour hai uss function ka

// ********* forEach signature => no return, function input as parameters, 1st parameter value, 2nd parameter index, and function kaam karta hai-calls my function for every value *********

// const ret = arr.forEach(function (value, index) {
//     console.log(value, index);
// })
// console.log(ret); // here output is undefined so it does not return anything


if (!Array.prototype.myForEach) { // initailly this function is not there myForEach. so condition will be true
    Array.prototype.myForEach = function (userFn) {
        const originalArr = this // here 'this' current object ki taraf point karta hai. 'this' matlab here jis bhi array k upper user call karra hai. for e.g = here 'arr' is 'this' here

        for (let i = 0; i < originalArr.length; i++){
            userFn(originalArr[i], i)
        }
    }
}

arr.myForEach(function (value, index) {
    console.log(`myForEach function value ${value} and index is ${index}`);
})



// .map
// signature of map => return new array, iterate over each element in given array, userFn, does not modify original array
if (!Array.prototype.myMap) {
    Array.prototype.myMap = function (userFn) {
        const result = []
        for (let i = 0; i < this.length; i++){
            const value = userFn(this[i], i)
            result.push(value)
        }
        return result
    }
}
const n = arr.map((e, index) => e * 2)
const n2 = arr.myMap((e) => e * 2)
console.log(`original map function output: ${n}`);
console.log(`myMap function output: ${n2}`);



// filter
// signature: return new array | input: userFn | new array kiss basis pe banta hai = ans: agar user ka function True written karta hai toh current value ko new array me include kar leta hai

if (!Array.prototype.myFilter) {
    Array.prototype.myFilter = function (userFn) {
        const result = []
        for (let i = 0; i < this.length; i++){
            if ((userFn(this[i]))) {
                result.push(this[i])
            }
        }
        return result
    }
}
const n3 = arr.filter((e) => e % 2 === 0);
const n4 = arr.myFilter((e) => e % 2 === 0)
console.log(n3);
console.log(n4);