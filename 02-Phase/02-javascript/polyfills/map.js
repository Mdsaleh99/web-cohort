// .map
// signature of map => return new array, iterate over each element in given array, userFn, does not modify original array
if (!Array.prototype.myMap) {
  Array.prototype.myMap = function (userFn) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
      const value = userFn(this[i], i);
      result.push(value);
    }
    return result;
  };
}
const n = arr.map((e, index) => e * 2);
const n2 = arr.myMap((e) => e * 2);
console.log(`original map function output: ${n}`);
console.log(`myMap function output: ${n2}`);
