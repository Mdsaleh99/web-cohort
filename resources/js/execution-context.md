# **JavaScript Execution Context (EC)**

## **1. What is Execution Context?**

An **Execution Context** is a **conceptual environment** where JavaScript code is evaluated and executed. It contains everything the JS engine needs to run your code: variables, functions, scope, and `this` value.

Every time a piece of JS code runs, it runs inside an execution context.

There are **three main types**:

1. **Global Execution Context (GEC)**

   * Created **once** when your JS program starts.
   * Default context in which your code runs.
   * Creates a **global object** (`window` in browsers, `global` in Node.js).
   * `this` points to the global object.

2. **Function Execution Context (FEC)**

   * Created **every time a function is invoked**.
   * Has its own **scope** and `this` value.
   * Executes the function’s code line by line.

3. **Eval Execution Context**

   * Created by the **`eval()` function** (rarely used).

---

## **2. Components of an Execution Context**

Every EC has **three main components**:

1. **Variable Environment (VE)**

   * Stores variables, function declarations, and arguments.
   * Handles **hoisting** (more on this below).

2. **Lexical Environment (LE)**

   * Similar to VE but also keeps track of **outer environments** for scope chains.

3. **`this` Binding**

   * Determines what `this` refers to inside that context.

---

## **3. Phases of Execution Context**

Each context goes through **two phases**:

1. **Creation Phase** (Memory Creation / Hoisting Phase)

   * **Variable and function declarations** are stored in memory.
   * Function declarations are stored **fully**; variables are initialized as `undefined`.
   * `this` is determined.

   Example:

   ```js
   console.log(a); // undefined
   var a = 10;

   foo(); // "Hello"
   function foo() { console.log("Hello"); }
   ```

   Here:

   * `a` is hoisted as `undefined`.
   * `foo` is fully hoisted as a function.

2. **Execution Phase** (Code Execution)

   * JS executes code line by line.
   * Variables get their assigned values, functions run, etc.

---

## **4. Execution Context Stack (Call Stack)**

* JS is **single-threaded**, so it uses a **stack** (LIFO) to manage contexts.
* The **Global Execution Context** is created first and pushed to the stack.
* Each function call pushes a new **Function Execution Context** on top.
* After the function executes, its context is **popped off**.

**Example:**

```js
function first() {
    console.log("First");
    second();
}

function second() {
    console.log("Second");
}

first();
console.log("Global");
```

**Execution Order:**

1. Global EC → pushed
2. `first()` EC → pushed
3. `second()` EC → pushed → executed → popped
4. `first()` EC → popped
5. Global EC → continues → popped

Output:

```
First
Second
Global
```

---

## **5. Hoisting & Scope**

Hoisting is closely related to execution context:

* **Variables declared with `var`** → hoisted and initialized as `undefined`.
* **Variables declared with `let`/`const`** → hoisted but in **temporal dead zone (TDZ)** until assignment.
* **Function declarations** → hoisted **completely**.

---

✅ **Key Takeaways:**

* Execution Context = Environment where JS code runs.
* GEC for global code, FEC for functions.
* Each EC has VE, LE, and `this`.
* Two phases: Creation (hoisting) & Execution.
* ECs managed using a stack (Call Stack).

---

# **1. Global Execution Context (GEC)**

**Definition:**
The **Global Execution Context** is the **default context** where your JavaScript code runs initially. Every JavaScript program has **exactly one GEC**.

**Characteristics:**

1. Created **first**, before any code runs.
2. Represents the **global scope**.
3. Creates a **global object**:

   * `window` in browsers
   * `global` in Node.js
4. Assigns `this` to the **global object**.
5. Handles **hoisting** for global variables and functions.

**Example:**

```js
var name = "Saleh";
function greet() {
    console.log("Hello " + name);
}

console.log(this); // window in browser
greet();           // Hello Saleh
```

**Explanation:**

* GEC is created when JS starts.
* `var name` is hoisted → initialized as `undefined`.
* `function greet` is hoisted → fully available.
* `this` in global context → `window`.

---

# **2. Function Execution Context (FEC)**

**Definition:**
Every time a function is invoked, a **Function Execution Context** is created. Each function has its **own EC**, even if called multiple times.

**Characteristics:**

1. Created when the function is **invoked**.
2. Has its own **Variable Environment** and **Lexical Environment**.
3. Handles **arguments**, parameters, and local variables.
4. `this` depends on how the function is called.
5. After execution, the context is **popped off the Call Stack**.

**Example:**

```js
var name = "Saleh";

function greet(person) {
    var greeting = "Hello";
    console.log(greeting + " " + person);
}

greet(name); // Hello Saleh
```

**Explanation:**

* When `greet(name)` is called:

  * A new FEC is created.
  * `person` = "Saleh" (parameter stored in VE).
  * `greeting` = "Hello" (local variable).
* `this` inside `greet()` → depends on how it's called (here global object in non-strict mode).
* After execution → FEC is destroyed.

**Nested Functions Example:**

```js
function outer() {
    var a = 10;
    function inner() {
        console.log(a);
    }
    inner();
}
outer(); // 10
```

* `outer()` EC → pushed first
* `inner()` EC → pushed second, has access to `outer`’s variables (closure)
* `inner()` EC → popped
* `outer()` EC → popped

---

# **3. Eval Execution Context**

**Definition:**
The **Eval Execution Context** is created when JavaScript code is executed **inside the `eval()` function**.

**Characteristics:**

1. Rarely used; generally **not recommended** for security and performance reasons.
2. Runs in its **own context**, with access to outer scope.
3. Can declare variables and functions **dynamically at runtime**.

**Example:**

```js
var x = 10;
eval("var y = 20; console.log(x + y);"); // 30
```

**Explanation:**

* The code inside `eval()` gets its **own execution context**.
* It can access `x` from the global context.
* `y` is created inside the eval context and accessible after execution in global scope (in non-strict mode).

**⚠️ Warning:**

* `eval()` can execute arbitrary code → **security risk**.
* Slows down performance → JS engine cannot optimize eval code.

---

# **Summary Table**

| Type                       | When Created  | Scope               | `this`                            | Key Feature                                     |
| -------------------------- | ------------- | ------------------- | --------------------------------- | ----------------------------------------------- |
| Global Execution Context   | Program start | Global              | global object (`window`/`global`) | One per program, hoists global vars & functions |
| Function Execution Context | Function call | Function-local      | Depends on call site              | Each function call has its own context          |
| Eval Execution Context     | `eval()`      | Lexical inside eval | Depends on outer scope            | Rarely used, dynamic code execution             |

---
