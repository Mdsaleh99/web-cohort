// debugger me jo breakpoint laga te hai (red color) uska matlab oh line execute nhi huyi hai abhi and uss line k execute hone se pehle debugger rukega

/*
Lexical scope in JavaScript is a convention that deter-mines how variables are accessible in a block of code. also known as static scoping.

How does lexical scope work?
• It's based on the physical location of variables and code blocks in the source code
• It's determined when the code is created, not when it's run
• Inner functions can use variables from the outer functions they're inside of
*/

// https://app.eraser.io/workspace/Smjc59df1hVTTdSzNqZK

// Global scope
let globalVar = "I'm a global variable";

function outerFunction() {
    // Outer function scope
    let outerVar = "I'm in outerFunction";

    function innerFunction() {
        // Inner function scope
        let innerVar = "I'm in innerFunction";

        console.log(globalVar); // Accessible (Lexical scope allows access to parent scopes)
        console.log(outerVar);  // Accessible (Defined in parent function)
        console.log(innerVar);  // Accessible (Defined in the same function)
    }
    innerFunction();
    // console.log(innerVar); Error! Not accessible outside innerFunction
}

outerFunction();
// console.log(outerVar); Error! Not accessible outside outerFunction

// Lexical Scope means that a function can access variables from its own scope and all parent scopes but not from child scopes.




// let fname = "Mohammed"

// function sayName() {
//     let lname = "Saleh"
//     console.log("In sayName: ", fname, lname);
// }

// console.log('value of fname: ', fname);
// sayName()