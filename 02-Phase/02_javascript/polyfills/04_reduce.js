const arr = [1, 2, 3, 4, 5, 6];


if (!Array.prototype.myReduce) {
  Array.prototype.myReduce = function (cb, initialize = undefined) {
    let accumulator = initialize || this[0];
    const startIndex = initialize ? 0 : 1;
    for (let i = startIndex; i < this.length; i++) {
      accumulator = cb(accumulator, this[i]);
    }
    return accumulator;
  };
}

const result = arr.reduce((acc, currVal) => acc + currVal);
const result2 = arr.myReduce((acc, currVal) => acc + currVal)
console.log(result);
console.log(result2);
