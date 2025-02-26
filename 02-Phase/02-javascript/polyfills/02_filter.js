// Machine Coding

// filter
// signature: return new array | input: userFn | new array kiss basis pe banta hai = ans: agar user ka function True written karta hai toh current value ko new array me include kar leta hai
const arr = [1, 2, 3, 4, 5, 6];
if (!Array.prototype.myFilter) {
  Array.prototype.myFilter = function (userFn) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
      if (userFn(this[i])) {
        result.push(this[i]);
      }
    }
    return result;
  };
}
const n3 = arr.filter((e) => e % 2 === 0);
const n4 = arr.myFilter((e) => e % 2 === 0);
console.log(n3);
console.log(n4);
