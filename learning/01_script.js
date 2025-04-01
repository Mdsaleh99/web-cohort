// console.log(this);
// console.log(window);

// this --> global object



// // function me () {
// //     console.log("Inside func", this);
// //     function a() {
// //         console.log("Indide a", this)
// //     }

// //     a();
// // }

// // // window = {
// // //     me,
// // // };


// // // window.me();

// // me();

// // // window.document.getElementById

// // //  function call ( invoke )
// // // me();


// // // const usr = {
// // //     about() {
// // //         this;
// // //     }
// // // }

// // // usr.about()







// // let myName = "Aman";
// // const user = {
// //     myName : "Ankit",
// //     about() {
// //         console.log(`My name is ${this.myName}`);
// //     },
// // };


// // user.myName
// // user["myName"]

// // implicit binding of this keyword
// // user.about();


// // explicit binding
// // call, apply, bind


// // const usr1 = {
// //     myName: "Ankit",
// //     about: function (desig, hobby) {
// //         console.log(`My name is ${this.myName}, ${desig}, ${hobby}`);
// //     },
// // };

// // const usr2 = {
// //     myName: "Arun",
// // };


// // Types of Functions
// // 1. Traditional Functions / Function Declaration
// // 2. Function Expression / Anonymous Function

// // 3. Arrow Functions / Fat Arrow Functions


// // usr1.myName;
// // usr1.about = about() {
//     //     console.log(`My name is ${this.myName}`);
//     // }
// // usr1.about("Writting")

// // usr1.about.call(usr2, "SWE", "Writting");
// // usr1.about.call(usr1, "SWE", "Writting");
// // usr1.about.call();


// // usr1.about.apply(usr2, ["SWE", "Writting"]);
// // usr1.about.apply(usr1, ["SWE", "Writting"]);


// // usr1.about.call(usr1, "SWE", "Writting");

// // const func = usr1.about.bind(usr2, "SWE", "Writting");
// // func();



// // Arrow functions do not have their own this,
// // instead it inherits the value of this from its outer(parent) normal function.

// const usr1 = {
//     myName: "Ankit",
//     about: function () {
//         console.log("About", this); // usr1


//         const a = () => {
//             console.log(`My name is ${this.myName}`); // usr1
//         }

//         a();

//         // function a () {
//         //     console.log("A", this);
//         // }

//         // a();
//     },
// };

// // usr1.about();

// // "use strict";
// // var, let, const
// // by default var
// // num = 10;




// // usr1.about.call(usr2, "SWE", "Writting");

// // ... (rest param)
// // ... (spread operator)



// Function.prototype.myCall = function (context, ...args) {
//     const func = this;

//     // context.fn = func;
//     const obj = {...context};
//     obj.fn = func;

//     obj.fn(...args);
// }



// // const arr = [1, 5, 7, 3, 10];
// // const res = Math.max.apply(null, arr);
// // Math.max(...[1, 3, 10, 5])
// // console.log(res);





// const user1 = {
//     fname: "Ankit",
//     lname: "Pandey",
//     email: "ankit@gmail.com",
//     age: 23,
//     about() {
//         console.log(`My name is ${this.fname} ${this.lname}`);
//     },
//     is18() {
//         return this.age >= 18;
//     }
// };

// const user2 = {
//     fname: "Aman",
//     lname: "Pandey",
//     email: "aman@gmail.com",
//     age: 20,
//     about() {
//         console.log(`My name is ${this.fname} ${this.lname}`);
//     },
//     is18() {
//         return this.age >= 18;
//     }
// };

// const userMethods = {
//     about() {
//         console.log(`My name is ${this.fname} ${this.lname}`);
//     },
//     is18() {
//         return this.age >= 18;
//     },
//     abc() {},
//     xyz() {},
// };

// function createUser (fnm, lnm, email, age) {
//     // const obj = {};
//     const obj = Object.create(createUser.prototype);

//     obj.fname = fnm;
//     obj.lname = lnm;
//     obj.email = email;
//     obj.age = age;

//     // obj.about = userMethods.about;
//     // obj.is18 = userMethods.is18;
//     // obj.abc = userMethods.abc;
//     // obj.xyz = userMethods.xyz;

//     return obj;
// }

// createUser.prototype.about = function () {
//     console.log(`My name is ${this.fname} ${this.lname}`);
// }

// createUser.prototype.is18 = function () {
//     return this.age >= 18;
// }

// const user1 = createUser("Ankit", "Pandey", "ap@co.in", 23);
// const user2 = createUser("Aman", "Gupta", "ag@co.in", 20);
// user1.about();
// console.log(user2.is18());



// objects
// functions --> objects

// function hello() {

// }

// console.log(hello.name);
// hello.myHobby = "Writting";
// console.log(hello.myHobby);

// prototype

// console.log(hello.prototype);
// hello.prototype.myHobby = "Writting";
// console.log(hello.prototype);





// const obj1 = {
//     key1: "value1",
//     key2: "value2",
// }
// const obj2 = {
//     key3: "value3",
// }
// const obj2 = {};
// const obj2 = Object.create(obj1);
// obj2.key3 = "value3";

// obj2.__proto__ = obj1;
// __proto__
// [[Prototype]]

// obj1.key2
// obj2.key3;
// console.log(obj2);
// console.log(obj2.key1);






// function CreateUser (fnm, lnm, email, age) {
//     // const this = Object.create(createUser.prototype);

//     this.fname = fnm;
//     this.lname = lnm;
//     this.email = email;
//     this.age = age;

//     // return this;
// }

// createUser.prototype.about = function () {
//     console.log(`My name is ${this.fname} ${this.lname}`);
// }
// createUser.prototype.is18 = function () {
//     return this.age >= 18;
// }
// const user1 = new CreateUser("Ankit", "Pandey", "ap@co.in", 23);
// user1.about();


// new keyword
// new Array()
// new Object()

// empty object initialize karna --> this = {};
// empty object --> __proto__ --> function prototype ke barabar set karna
//  --> this = Object.create(createUser.prototype)
// return empty object; --> return this

// const user1 = createUser("Ankit", "Pandey", "ap@co.in", 23);
// const user2 = createUser("Aman", "Gupta", "ag@co.in", 20);


// function CreateUser (fnm, lnm, email, age) {
//     // const this = Object.create(createUser.prototype);

//     this.fname = fnm;
//     this.lname = lnm;
//     this.email = email;
//     this.age = age;

//     // return this;
// }

// createUser.prototype.about = function () {
//     console.log(`My name is ${this.fname} ${this.lname}`);
// }
// createUser.prototype.is18 = function () {
//     return this.age >= 18;
// }
// const user1 = new CreateUser("Ankit", "Pandey", "ap@co.in", 23);
// user1.about();


class CreateUser {
    constructor(fnm, lnm, email, age) {
        this.fname = fnm;
        this.lname = lnm;
        this.email = email;
        this.age = age;
    }

    about () {
        console.log(`My name is ${this.fname} ${this.lname}`);
    }
    is18() {
        return this.age >= 18;
    }
}
const user1 = new CreateUser("Ankit", "Pandey", "ap@co.in", 23);
console.log(CreateUser.prototype);
console.log(user1.__proto__);
console.log(Object.getPrototypeOf(user1));