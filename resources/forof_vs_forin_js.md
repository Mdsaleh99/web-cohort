## `for...of` vs `for...in` in JavaScript

JavaScript provides two distinct looping constructs — `for...in` and `for...of` — and each serves a specific purpose. Here's a structured comparison to help you understand their differences and best use cases.

---

### 🔁 `for...in` — Loop over **keys** (property names)

- Used to **iterate over the keys (property names)** of an object or indexes in arrays.
- Works on **enumerable properties**, including inherited ones.

#### ✅ Syntax

```js
for (const key in object) {
    // key is a string representing a property name
}
```

#### ✅ Example with Object

```js
const person = { name: "Alice", age: 25 };

for (const key in person) {
    console.log(key); // "name", "age"
    console.log(person[key]); // "Alice", 25
}
```

#### ⚠️ `for...in` with Arrays

```js
const arr = ["a", "b", "c"];

for (const i in arr) {
    console.log(i); // 0, 1, 2 (indexes as strings)
    console.log(arr[i]); // "a", "b", "c"
}
```

👉 Not recommended for arrays because it can iterate over **inherited or custom properties**.

---

### 🔁 `for...of` — Loop over **values**

- Used to iterate **directly over iterable values** like arrays, strings, Maps, Sets, etc.
- Gives you the **value** directly, not the key or index.

#### ✅ Syntax

```js
for (const value of iterable) {
    // value is the item itself
}
```

#### ✅ Example with Array

```js
const arr = ["a", "b", "c"];

for (const val of arr) {
    console.log(val); // "a", "b", "c"
}
```

#### ✅ Example with String

```js
for (const char of "Hi") {
    console.log(char); // H, i
}
```

---

### 🧠 Summary Table

| Feature                    | `for...in`                       | `for...of`                      |
| -------------------------- | -------------------------------- | ------------------------------- |
| Iterates over              | Keys (property names or indexes) | Values in iterable              |
| Works with                 | Objects, Arrays                  | Arrays, Strings, Maps, Sets     |
| Returns                    | Keys (as strings)                | Actual values                   |
| Best for                   | Enumerating object properties    | Looping through array/iterables |
| Can access inherited props | ✅ Yes                           | ❌ No                           |

---

### 🚨 Use Cases

- Use `for...in` when looping through an **object’s keys**.
- Use `for...of` when looping through **iterable values** like arrays, strings, etc.

---

Let me know if you'd like this in PDF or with visual examples!
