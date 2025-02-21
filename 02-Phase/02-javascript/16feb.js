Function.prototype.describe = function () {
  console.log(`Function name is ${this.name}`);
};

function masalaChai(){}
function gingerChai(){}

function greet(name) {
  return `Hello ${name}`;
}

greet()
greet.describe() // output => Function name is greet.   here greet is a name of the function 'this.name'
greet.describe('hitesh'); // output => 
masalaChai.describe()



function add(a, b){ // function declearation
    return a+b
}

const substract = function(a, b){ // function expression
    return a-b
}

const multiply = (a, b) => a*b // arrow function


function applyOperation(a, b, operation) { // first class function
    // ek function ko hum regular variable ki tarah treat karte hai jaise idher 'operation' variable hai
    return operation(a, b)
}

const result = applyOperation(5, 4, (x, y) => x/y)


function createCounter(){ // teffin concept
    let count = 0;
    return function () {
        count++;
        return count
    }
}
//console.log(count);

const counter = createCounter() // counter me ek function hoga because we returing a function
console.log(counter());


// =========================================================================================


function onef(){
    let myName = "hitesh"
}

console.log(myName);


// IFFE
(function(){
    console.log("hitesh");
    
})()

()()

(function(){

})()