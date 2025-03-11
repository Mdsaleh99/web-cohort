const obj = {
    name: "saleh",
    greet: function () {
        console.log(`Hello, ${this.name}`);
    }
}
console.log("hello");

setTimeout(obj.greet, 2 * 1000) // o/p => Hello, undefined
// here undefined because when "bye bye" executes then from call stack all code will be removed and when setTimeOut is pushed from queue to call stack there is no 'name' and all code is removed so it is undefined. so fix this we use bind()
setTimeout(obj.greet.bind(obj), 2*1000)
// https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
// https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
console.log("Bye Bye");

// js visualizer => https://www.jsv9000.app/

// interview qs => what is starvation? Read this article => https://medium.com/@sumedhakoranga/starvation-in-javascript-0a98f0824272

// Read this article => https://www.freecodecamp.org/news/what-is-the-temporal-dead-zone/
// Read this article => https://developer.mozilla.org/en-US/docs/Glossary/Hoisting