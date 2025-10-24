# 🔎 `??` — Nullish Coalescing Operator

The **nullish coalescing operator** (`??`) was introduced in **ES2020**.
It’s used to provide a **default value** when the left-hand side is `null` or `undefined`.

---

## ✅ Basic Example

```js
let name = null;
let displayName = name ?? "Guest";

console.log(displayName); // "Guest"
```

Here:

* `name` is `null`.
* `??` checks: *is `name` either `null` or `undefined`?*
* Yes → use `"Guest"` instead.

---

## 🔄 Difference from `||` (OR operator)

This is where people often get confused.

### With `||`

```js
let count = 0;
console.log(count || 10); // 10 (because 0 is falsy)
```

### With `??`

```js
let count = 0;
console.log(count ?? 10); // 0 (because 0 is NOT null/undefined)
```

👉 `||` treats *any falsy value* (`0`, `""`, `false`, `NaN`) as “empty”.
👉 `??` only treats `null` and `undefined` as “empty”.

So `??` is **safer when 0, false, or "" are valid values**.

---

## 🧠 Real-World Use Case

### Settings / Config fallback

```js
function createUser(name, age) {
  return {
    name: name ?? "Anonymous",
    age: age ?? 18
  };
}

console.log(createUser(null, undefined));
// { name: "Anonymous", age: 18 }
```

---

## ⚠️ Operator Precedence

`??` has **low precedence**, so parentheses are often needed.

❌ Wrong:

```js
let result = 1 + 2 ?? 10; // SyntaxError
```

✅ Correct:

```js
let result = (1 + 2) ?? 10; 
console.log(result); // 3
```

---

# 🎯 Recap

* `??` → returns right-hand side if left-hand side is `null` or `undefined`.
* Unlike `||`, it **doesn’t treat `0`, `false`, or `""` as empty**.
* Great for providing default values safely.
