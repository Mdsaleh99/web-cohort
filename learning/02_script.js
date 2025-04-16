// // this : 

// // this --> global object ---> window
// // console.log(this);
// // console.log(window);


// // "use strict";
// // function func () {
// //     console.log("Inside func", this);
// // }

// // window = {
// //     alert() {},
// //     func() {},
// // };

// // func();
// // window.func();

// // var, let, const
// // num = 10;
// // var num = 10;

// // Implicit Binding of "this" keyword


// // Explicit Binding of "this" keyword.
// // call, apply, bind


// // function func(hobby) {
// //     console.log("Hello", hobby);
// // }

// // func("Sleeping");
// // func.call();

// let myName = "Arun";
// const usr1 = {
//     myName: "Ankit",
//     about(hobby, desig) {
//         console.log(this.myName, hobby, desig);
//     },
// };

// const usr2 = {
//     myName: "Amit",
// }


// // ... (Spread operator)
// // ... (Rest param)
// // usr1.about.call(usr2, "Sleeping", "SWE");
// // // usr1.about("Sleeping");

// // usr1.about.apply(usr1, ["Sleeping", "SDE"]);

// // const fn = usr1.about.bind(usr2, "Writting", "SSE");
// // fn();

// // Function.prototype.myApply = function (obj, args) {
// //     const fn = this;

// //     const context = {...obj};
// //     context.func = fn;
// //     // obj.func = fn;

// //     context.func(...args);
// //     // obj.func(...args);
// // }



// // const arr = [1,2,3,4]
// // function f(nums) {
// //     console.log(...nums);
// // }
// // f([1,2,3,4,5])




// code ( problem )
// code refactor


// const usr1 = {
//     myName: "Shakib Ansari",
//     email: "sh@co.in",
//     age: 24,
//     about() {
//         console.log(`My name is ${this.myName}`);
//     },
//     is18() {
//         return this.age >= 18;
//     }
// };
// const usr2 = {
//     myName: "Aman Shahani",
//     email: "as@co.in",
//     age: 17,
//     about() {
//         console.log(`My name is ${this.myName}`);
//     },
//     is18() {
//         return this.age >= 18;
//     }
// };

// const userMethods = {
//     about() {
//         console.log(`My name is ${this.myName}`);
//     },
//     is18() {
//         return this.age >= 18;
//     },
//     abc() {},
//     xyz() {},
// };
// function createUser (nm, email, age) {
//     const obj = {};

//     obj.myName = nm;
//     obj.email = email;
//     obj.age = age;
//     // obj.about = function () {
//     //     console.log(`My name is ${this.myName}`);
//     // };
//     // obj.is18 = function () {
//     //     return this.age >= 18;
//     // };
//     obj.about = userMethods.about;
//     obj.is18 = userMethods.is18;
//     obj.abc = userMethods.abc;
//     // obj.xyz = userMethods.xyz;

//     return obj;
// }
// // const user1 = createUser("Shakib", "sh@co.in", 24);
// // console.log(user1);


// const obj1 = {
//     key1: "value1",
//     key2: "value2",
// };
// // const obj2 = {
// //     key3: "value3",
// // };
// const obj2 = Object.create(obj1);
// obj2.key3 = "value3"

// // __proto__
// // [[Prototype]]
// // obj2.__proto__ = obj1;

// // obj1.key1;
// // obj1.key2;
// // obj2.key3;
// console.log(obj2);
// console.log(obj2.key1);

// Prototypal Inheritance




// const userMethods = {
//     about() {
//         console.log(`My name is ${this.myName}`);
//     },
//     is18() {
//         return this.age >= 18;
//     },
// };
// function createUser (nm, email, age) {
    // const obj = {};
//     const obj = Object.create(userMethods);

//     obj.myName = nm;
//     obj.email = email;
//     obj.age = age;
    // obj.about = userMethods.about;
    // obj.is18 = userMethods.is18;

//     return obj;
// }
// const user1 = createUser("Shakib", "sh@co.in", 24);
// console.log(user1);


// function hello() {}
// console.log(hello.name);

// hello.hobby = "Sleeping";
// console.log(hello.hobby);

// prototype - {}

// console.log(hello.prototype);
// hello.prototype.myNm = "Sahil";
// console.log(hello.prototype);




// const userMethods = {
//     about() {
//         console.log(`My name is ${this.myName}`);
//     },
//     is18() {
//         return this.age >= 18;
//     },
// };
// function CreateUser (nm, email, age) {
//     this.myName = nm;
//     this.email = email;
//     this.age = age;

// }
// CreateUser.prototype.about = function () {
//     console.log(`My name is ${this.myName}`);
// }
// CreateUser.prototype.is18 = function () {
//     return this.age >= 18;
// }
// const user1 = new CreateUser("Shakib", "sh@co.in", 24);
// console.log(user1);

// new keyword
// 1. Creates an empty object ---> this = {};
// 2. assign ths __proto__ of the respective object to the prototyope of the function.
//          this = Object.create(<function>.prototype)
// 3. return the obhect ---> return this

// Classes in JS are fake

class CreateUser {
    constructor (nm, email, age) {
        this.myName = nm;
        this.email = email;
        this.age = age;
    }
    about() {
        console.log(`My name is ${this.myName}`);
    }
    is18() {
        return this.age >= 18;
    }

}
const user1 = new CreateUser("Shakib", "sh@co.in", 24);
console.log(CreateUser.prototype);
console.log(user1.__proto__);
console.log(Object.getPrototypeOf(user1));