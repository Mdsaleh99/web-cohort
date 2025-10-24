# Understanding this keyword in js
The this keyword in JavaScript refers to the context in which a function is executed. Its value is determined at runtime, based on how the function is called, rather than where it is defined.

Whenever `this` is used, it refers to the context (`संदर्भ` ) in which a piece of code is executed.

> ***kab aur kaha function call hoga uspe this depend karega uska context kya hoga***
> 

```jsx
const person = {
  name: "Ram",
  greet() {
    console.log(this.name); // here this has context of person obj in "***regular function***"
  }
};

person.greet(); // output will be Ram
```

## How this behaves in global space (global scope) ?

```jsx
// what is global space ?
console.log(this) 
// here the console log this is in global space 
function test(){
console.log(this)
}
// and the console this inside function is in the funtional space
```

The value of `this` in the global scope is the global object, which depends on the runtime environment in which it is executed.

### In Browsers

The value of `this` in the global scope refers to the global object, which is `window` in browsers.

- **See here** 👇
    
    ![image.png](imgs/image.png)
    

### But why ?

JavaScript is used to add dynamicity to web pages, and with JavaScript, we can manipulate the DOM. The main global object that provides methods in the browser is `window`, so by default, everything in the global scope points to `window`. That’s why the execution context inside the browser is the `window` object

```jsx
// guess the output
console.log(this === window)
<button onclick="console.log(this.tagName)">Click me</button>
// Please try by yourself first !!!
```

### **In Nodejs**

The value of `this` in the global scope of Node.js doesn't refer to the global object. Node.js is based on a module system where different modules are created and isolated from each other. This means they can't share anything (variables) unless they explicitly do so by exporting from a particular module. 

In this context, `this` will depend on module exports, which by default is an empty object `{}`

![image.png](imgs/image%201.png)

### Behind the scenes (require module)

When you create a file in Node.js (jaise `index.js`), Node.js **automatically wraps** the entire file inside a special function. 

**You don't see this function in your code**, but it looks something like this:

```jsx
(function (exports, require, module, __filename, __dirname) {
    // Your module code is actually running inside this function!
});
```

- 📝 **Code Example**
    
    ```jsx
    console.log(this); 
    console.log(this === module.exports); 
    // Now guess the output
    ```
    
- 📝**Code Example**
    
    ```jsx
    console.log(this); // {}
    console.log(this === module.exports); // true
    console.log(this === global); // false
    
    // --------------------------------------------------------------------
    
    function greet() {
      console.log(this);
    }
    
    function sayHello() {
      console.log(this);
    }
    
    module.exports = {
      greet,
      sayHello,
    };
    
    // false, because we reassign module.exports to an
    // entirely new object { greet, sayHello } and this is still pointing to {}
    console.log(this === module.exports);
    
    // --------------------------------------------------------------------
    
    // module.exports.greet = function greet() {
    //   console.log(this);
    // };
    
    // module.exports.sayHello = function sayHello() {
    //   console.log(this);
    // };
    
    // // true, because this time we didn't reassigned
    // // module.exports a completely new object
    // console.log(this === module.exports);
    ```
    

### For (import / export)

### **No Function Wrapping in ES Modules**

- Node.js **does not** wrap ES Modules in a function.
- Instead, **ES Modules are executed in strict mode by default** (`'use strict'` is **always enabled**).
- `this` in ES Modules **is `undefined`** at the top level (instead of an empty `{}` like in CommonJS).

## How this behaves in functions ?

If a function has a `this` reference inside it, that `this` reference usually points to an object. But which object it points to depends on how the function was called.

## Standalone Functions (In strict mode and Non strict mode)

`this` keyword behave differently in strict and non-strict mode.

When regular function is invoked as standalone function the this inside the function will point to global object window for browser and global object global for nodejs in non strict mode 

```jsx
// Non strict mode
// try in your browser
function insideBrowser(){
    console.log(this)
}

insideBrowser();
```

In None strict mode the this inside function is window object

- **See in Browser**
    
    ![image.png](imgs/image%202.png)
    

```jsx
// Non Strict Mode 
// try this in node js env
function insideNode(){
    console.log(this)
}

insideNode();
```

- **See in Node environment**
    
    ![image.png](imgs/image%203.png)
    

In **Node.js (non-strict mode)**, the global object is `global`, not `window`. However, it **does not include browser APIs** like `document` or `window`. Instead, it contains Node.js-specific APIs.

### What is global ?

The `global` object in Node.js serves as the **global namespace** that contains built-in functions, variables, and modules accessible from anywhere in the application.

## Now Understanding what magic is happening in strict mode?

When **`"use strict"`** is applied in both the browser and the Node.js runtime environment, you will see that the value of **`this`** is **`undefined`** inside a function.

```jsx
"use strict"
function insideBrowser(){
    console.log(this)
}

insideBrowser();
// same for node js now try to run 
// output: undefined
```

**What does this signify?** 

What happens is the value of this inside function is undefined but in non strict mode it is forced to be a object because of **this substitution method** , 

`this` substitution method means that if the value of **`this`** is **`undefined`** or **`null`**, the **`this`** keyword will be replaced by the global object in **non-strict mode**. 

but what about other primitives datatypes what will the value of this when we call the string, number etc ,for any primitive value, the this primitive value is wrapped (or boxed) to there corresponding wrapper object by  **boxing method**

**boxing refers to the process where a primitive value (like a number, string, or boolean) is wrapped inside an there wrapper object.**

Example to understand better :

**In Non Strict mode**

```jsx
function checkThis() {
    console.log(this)
}

checkThis()                                    // Global Object (window in browser)
checkThis.call("Saurav")                       // String {'Saurav'             

```

**In Strict mode**

```jsx
"use strict"
function checkThis() {
    console.log(this)
}

checkThis()                                    // undefined
checkThis.call("Saurav")                       // 'Saurav'

```

In short whenever this is called inside function in non strict mode this substitution method takes place and when there is strict mode there no this substitution takes place.

## Normal Function inside Object

Inside an object, `this` refers to the object itself for regular function

```jsx
const postOnInstagram = {
  name: "Saurav Jha",
  post() {
    console.log(` ${this.name} has posted new reel`); // this.name => postOnInstagram.name
  },
};
postOnInstagram.post();
// output: Saurav jha has posted new reel
```

Function inside object will have the context of that object so the value of this inside the function will postOnInstagram obj.

- 📝**Guess the output**
    
    ```jsx
    const postOnInstagram = {
      name: "Saurav Jha",
      post() {
        console.log(` ${this.name} has posted new reel`); // this.name => postOnInstagram.name
      },
    };
    
    const randomUser = {
    name:"Ram"
    };
    
    Object.setPrototypeOf(randomUser,postOnInstagram);
    console.log(randomUser.post())
    
    ```
    

## this in Arrow Function

**Arrow functions do not have their own `this`**. Instead, they inherit `this` from their **outer lexical scope** (the surrounding context where they are defined).

```jsx
const obj = {
  name: "Saurav",
  greet: () => {
      console.log(`Welcome ${this.name}`); // undefined
    };,
};
```

But how can I modify this code so that it should work properly

- 📝**See the Solution**
    
    ```jsx
    const obj = {
      name: "Saurav",
      greet: function () {
        const runThis = () => {
          console.log(`Welcome ${this.name}`); 
        };
        runThis();
      },
    };
    console.log(obj.greet()); // welcome
    ```
    

### **this in Constructor Function**

The value of this inside constructor function will based on new instance created

```jsx
function Student(name) {
  this.name = name;
}
const s1 = new Student("Aman");
console.log(s1.name);
// output: Aman
```

- 📝 **Guess the output**
    
    ```jsx
    
    function User(name) {
      this.name = name;
      this.sayHello = function () {
        console.log("Hello, " + this.name);
      };
    
      setTimeout(function () {
        console.log("Inside setTimeout: " + this.name);
      }, 1000);
    }
    
    const u1 = new User("Saurav");
    u1.sayHello();
    // after guessing the output you will see unexpected so try to solve it
    ```
    

## Use Cases of this

**`call()`**

Call method immediately invokes the function with with a given `this` value and arguments .

> **Please Note:**
 arguments are passed to `call()` individually as a list
> 
- **📝 Code Example**
    
    ```jsx
    function jobProfile(age, role,exp) {
      console.log(`${this.name} is ${age} and his role is ${role} with ${exp} of experience`);
    }
    
    const person = { name: "Saurav" };
    jobProfile.call(person, 23, "Full stack developer",2);
    ```
    

**`apply()`**

apply method immediately invokes the function with a given `this` value and arguments. It is same as call

> **Please Note:**
 arguments are passed to `apply()` as array
> 
- **📝 Code Example**
    
    ```jsx
    function jobProfile(age, role,exp) {
      console.log(`${this.name} is ${age} and his role is ${role} with ${exp} of experience`);
    }
    
    const person = { name: "Saurav" };
    jobProfile.apply(person, [23, "Full stack developer",2]);
    ```
    

**`bind()`**

bind method returns a new function when called, calls this function with its `this` value and arguments.

> **Please Note:**
 arguments are passed to `bind()` individually as a list
> 
- **📝 Code Example**
    
    ```jsx
    function jobProfile(age, role,exp) {
      console.log(`${this.name} is ${age} and his role is ${role} with ${exp} of experience`);
    }
    
    const person = { name: "Saurav" };
    const getProfileDetails = jobProfile.bind(person, 23, "Full stack developer",2);
    getProfileDetails();
    ```