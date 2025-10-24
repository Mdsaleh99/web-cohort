# **1. What are `call`, `apply`, and `bind`?**

All three are **methods of functions** in JavaScript that allow you to **control what `this` points to** when a function is invoked.

* **`this`** normally depends on how a function is called.
* Using **`call`, `apply`, or `bind`**, you can **explicitly set `this`**.

---

# **2. `call`**

**Definition:**
`call` invokes a function **immediately** and allows you to pass **arguments one by one**.

**Syntax:**

```js
func.call(thisArg, arg1, arg2, ...);
```

**Example:**

```js
const person = {
    name: "Saleh",
    greet: function(age) {
        console.log(`Hello, I am ${this.name} and I am ${age} years old.`);
    }
};

const anotherPerson = { name: "Ayesha" };

// Using call
person.greet.call(anotherPerson, 25); 
// Hello, I am Ayesha and I am 25 years old.
```

**Explanation:**

* `this` inside `greet` now refers to `anotherPerson`.
* Arguments (`age`) are passed **individually**.

---

# **3. `apply`**

**Definition:**
`apply` is almost identical to `call`, but arguments are passed as an **array** instead of individually.

**Syntax:**

```js
func.apply(thisArg, [arg1, arg2, ...]);
```

**Example:**

```js
person.greet.apply(anotherPerson, [30]); 
// Hello, I am Ayesha and I am 30 years old.
```

**Explanation:**

* Works like `call` but arguments are provided as an **array**.
* Useful when you already have an array of arguments.

---

# **4. `bind`**

**Definition:**
`bind` **does not invoke the function immediately**.
It **returns a new function** with `this` bound to the given object.

**Syntax:**

```js
let newFunc = func.bind(thisArg, arg1, arg2, ...);
```

**Example:**

```js
const greetAyesha = person.greet.bind(anotherPerson, 28);
greetAyesha(); 
// Hello, I am Ayesha and I am 28 years old.
```

**Explanation:**

* `greetAyesha` is a new function where `this` is **permanently bound** to `anotherPerson`.
* Arguments can also be preset (28 in this case).
* Can be called later, unlike `call` or `apply`.

---

# **5. Quick Comparison Table**

| Method  | Invokes Function? | How Arguments Are Passed | Key Feature                            |
| ------- | ----------------- | ------------------------ | -------------------------------------- |
| `call`  | Yes               | Individually             | Sets `this` explicitly                 |
| `apply` | Yes               | As array                 | Sets `this` explicitly                 |
| `bind`  | No                | Individually or preset   | Returns new function with bound `this` |

---

# **6. Practical Example**

```js
function introduce(city, country) {
    console.log(`${this.name} lives in ${city}, ${country}.`);
}

const user = { name: "Saleh" };

// call
introduce.call(user, "Mumbai", "India");

// apply
introduce.apply(user, ["Delhi", "India"]);

// bind
const introduceSaleh = introduce.bind(user, "Kolkata", "India");
introduceSaleh();
```

**Output:**

```
Saleh lives in Mumbai, India.
Saleh lives in Delhi, India.
Saleh lives in Kolkata, India.
```

**Explanation:**

* `call` → invokes immediately with individual args.
* `apply` → invokes immediately with array args.
* `bind` → returns a function that can be called later.

---

✅ **Tip:**

* Use `call`/`apply` when you want **immediate execution** with a specific `this`.
* Use `bind` when you want **to create a new function** with `this` fixed for later use.

---

# **1. Function Borrowing**

**Definition:**
Function borrowing is when one object **uses a method of another object** without rewriting it. This is usually done using **`call`, `apply`, or `bind`**.

**Why use it?**

* To **reuse code**.
* Avoid duplicating methods across objects.

**Example with `call`:**

```js
const person1 = {
    name: "Saleh",
    greet: function(age) {
        console.log(`Hello, I am ${this.name} and I am ${age} years old.`);
    }
};

const person2 = {
    name: "Ayesha"
};

// Borrowing greet method from person1
person1.greet.call(person2, 25); 
// Output: Hello, I am Ayesha and I am 25 years old.
```

**Explanation:**

* `person2` doesn’t have `greet` method.
* We **borrowed** `person1.greet` using `call`.
* `this` inside `greet` now refers to `person2`.

**Example with `apply`:**

```js
person1.greet.apply(person2, [30]); 
// Output: Hello, I am Ayesha and I am 30 years old.
```

**Example with `bind`:**

```js
const greetAyesha = person1.greet.bind(person2, 28);
greetAyesha(); 
// Output: Hello, I am Ayesha and I am 28 years old.
```

✅ **Summary:**
Function borrowing = using **another object’s function** on your object.

---

# **2. Currying**

**Definition:**
Currying is the process of **transforming a function with multiple arguments into a sequence of functions**, each taking **one argument at a time**.

**Why use it?**

* Useful for **partial application** of functions.
* Helps in **functional programming**.

**Example:**

```js
function multiply(a) {
    return function(b) {
        return a * b;
    }
}

const multiplyBy2 = multiply(2);
console.log(multiplyBy2(5)); // 10
console.log(multiplyBy2(10)); // 20
```

**Explanation:**

* `multiply(2)` returns a new function that multiplies its argument by 2.
* Each function takes **one argument at a time**.

**ES6 Arrow Function Syntax:**

```js
const multiply = a => b => a * b;

console.log(multiply(3)(4)); // 12
```

Absolutely! We can combine **`bind`** with **currying** in JavaScript. Using `bind`, you can **preset arguments** to a function, which is essentially a form of **currying** (partial application).

---

# **Example: Currying using `bind`**

```js
function multiply(a, b) {
    return a * b;
}

// Using bind to preset the first argument
const multiplyBy2 = multiply.bind(null, 2); // null because we don't care about 'this' here

console.log(multiplyBy2(5)); // 10
console.log(multiplyBy2(10)); // 20

const multiplyBy5 = multiply.bind(null, 5);
console.log(multiplyBy5(4)); // 20
```

**Explanation:**

1. `multiply` is a normal function taking **two arguments**.
2. `bind(null, 2)` → creates a **new function** where `a = 2` is **preset**.
3. The new function `multiplyBy2` now only needs **the second argument**.
4. This is essentially **currying via `bind`**.

---

# **Another Example: Greeting**

```js
function greet(message, name) {
    console.log(`${message}, ${name}!`);
}

// Currying with bind
const sayHello = greet.bind(null, "Hello");
const sayHi = greet.bind(null, "Hi");

sayHello("Saleh"); // Hello, Saleh!
sayHi("Ayesha");   // Hi, Ayesha!
```

**Explanation:**

* `bind` presets the **first argument** (`message`).
* The returned function only needs the **second argument** (`name`).
* Very similar to traditional currying.

---

✅ **Key Point:**
* `bind` can be used for **partial application of functions**, which is **currying in practice**.
* Advantage: You don’t need nested functions; `bind` automatically returns a new function with preset arguments.


✅ **Summary:**

* Currying = breaking a function into **smaller functions** that each take **one argument**.
* Function borrowing = **reusing a function from another object** using `call`, `apply`, or `bind`.

---


# **bind(), call(), apply() Problem Sets For Javascript**

1. **Basic Bind Usage**
Create a function that logs a provided property from an object using the **`this`** keyword. Now, use the **`bind`** method to bind this function to an object and execute it.
2. **Call in Action**
Create two objects with a property called **`message`**. Now, write a function that logs the message from the **`this`** context. Use the **`call`** method to execute the function in the context of both objects.
3. **Apply with Arrays**
Construct a function that accepts multiple arguments and logs them. Now, create an array of arguments and use the **`apply`** method to execute this function with the items in the array as its arguments.
4. **bind for Partial Application**
Create a function that accepts multiple arguments and logs them. Use the **`bind`** method to pre-fill some of these arguments, creating a new function. Execute the new function with the remaining arguments.
5. **Bind vs. Call**
Using an example, demonstrate the difference between using **`bind`** and **`call`**. Make sure to include how and why you'd use one over the other.
6. **Constructor Theft with Call**
Create two constructor functions, Parent and Child. Use the **`call`** method to allow the Child to inherit properties from the Parent during instantiation.
7. **Bind in Event Handlers**
Create an HTML button. Add an event listener to it. Inside the event listener, try to log the **`this`** keyword. Now, use the **`bind`** method to ensure the **`this`** keyword refers to a custom object when the event handler is called.
8. **Array Max with Apply**
Without using the Math.max method directly on an array, find the maximum value in an array using the **`apply`** method.
9. **Dynamic Function Execution**
Create a set of functions that log different messages. Store these functions in an array. Randomly use **`call`** or **`apply`** to execute one of these functions with a specific context.
10. **Re-binding with Bind**
Bind a function to a specific context using **`bind`**. Then, try to re-bind the already bound function to a new context. Test to see if the original binding or the new binding takes precedence.
11. **Bind's Return Type**
Explore what is returned when the **`bind`** method is used on a function. Is it the same function, a new function, or something else? Provide evidence for your conclusion.
12. **Parameters with Call and Apply**
Detail the differences in how parameters are passed when using the **`call`** and **`apply`** methods. Demonstrate with an example function that takes multiple parameters.
13. **Delayed Execution with Bind**
Use **`setTimeout`** to delay the execution of a function. Ensure that the function logs properties of an object. Use **`bind`** to make sure the function retains the correct context when it eventually executes.
14. **Function Borrowing**
Create two objects, each having methods that log specific data about them. Use **`call`** or **`apply`** to borrow one object's method and run it in the context of the other object.
15. **Chain Bind, Call, and Apply**
Create a scenario where you have to use **`bind`**, **`call`**, and **`apply`** in conjunction to achieve a specific result. Detail why each method was necessary for your solution.
16. **Immutable Binding**
Demonstrate a scenario where a function bound with **`bind`** can't be rebound to another object using either **`call`** or **`apply`**.
17. **Array-like Object with Apply**
Create an array-like object (i.e., an object with numeric keys and a length property). Demonstrate how you can use the **`apply`** method to utilize array methods on this array-like object.
18. **Context Loss in Array Methods**
Showcase a scenario where the context (**`this`**) is lost when using an array method, and demonstrate how to solve this issue using **`bind`**.
19. **Multiple Bind Calls**
Bind a function to an object using **`bind`**. Now, attempt to bind the already bound function to another object. What do you observe?
20. **Deconstruct and Apply**
Create a function that takes multiple arguments. Use array destructuring to pass elements of an array as individual arguments to this function using the **`apply`** method.