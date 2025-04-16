let fruits = ["apple", "cherry", "banana"]
let intFruits = new Array("kiwi", "avacado")

console.log(fruits[0]);
console.log(fruits.length);
fruits[0] = "blueberry"
console.log(fruits[0]);
console.log(fruits.length);

fruits.unshift("new item")  // add at first in array
fruits.push("grapes")
fruits.pop()

let myArray = [1, 4, 2, 3, 5, 6]

function sumOfNumber(numbers) {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum = sum + numbers[i];
        // sum += numbers[i]
    }
    return sum
}

console.log(sumOfNumber(myArray));
