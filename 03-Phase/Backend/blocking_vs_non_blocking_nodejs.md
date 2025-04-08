
# ✅ 1. Blocking vs Non-Blocking Code

## 🔹 Blocking Code
**Definition:** Code that blocks the execution of further instructions until the current one finishes.

**Example in Node.js:**
```js
const fs = require('fs');
const data = fs.readFileSync('file.txt', 'utf8');
console.log(data);
console.log("This line waits for the file read to finish.");
```
🔸 Here, `fs.readFileSync()` is blocking.  
The program halts at this line until the file is fully read, then moves to the next line.

## 🔹 Non-Blocking Code
**Definition:** Code that does not block the execution and allows other operations to continue.

**Example in Node.js:**
```js
const fs = require('fs');
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
console.log("This line runs without waiting for file read.");
```
🔸 `fs.readFile()` is non-blocking.  
It registers a callback and moves on immediately to the next line.

## 📌 Key Differences:

| Feature     | Blocking       | Non-Blocking         |
|------------|----------------|----------------------|
| Execution  | Sequential     | Asynchronous         |
| Performance| Slower with I/O operations | Faster, especially with I/O |
| Scalability| Poor for concurrent users | Ideal for high concurrency |
| Use Case   | Scripts, CLI tools | Web servers, APIs |

# ✅ 2. Async Code in Node.js

Node.js is asynchronous and non-blocking by design, especially suited for I/O-heavy operations like APIs, database calls, and file system operations.

💡 **Why Asynchronous?**  
Because Node.js runs on a single thread using the event loop, blocking the thread with slow I/O (like file/database access) will make it unresponsive.

To manage async operations, Node.js provides:

# ✅ 3. Callbacks

## 🔸 Definition:
A callback is a function passed as an argument to another function to be executed later, usually after an asynchronous operation.

## 🔸 Example:
```js
function fetchData(callback) {
  setTimeout(() => {
    callback("Data received");
  }, 2000);
}

fetchData((result) => {
  console.log(result); // Logs after 2 seconds
});
```

⚠️ **Callback Hell:**  
Nesting multiple callbacks leads to unreadable code.

```js
loginUser(user, (err, userData) => {
  getPosts(userData.id, (err, posts) => {
    getComments(posts[0].id, (err, comments) => {
      console.log(comments);
    });
  });
});
```

# ✅ 4. Promises

## 🔸 Definition:
A Promise is an object representing the eventual completion or failure of an asynchronous operation.

## 🔸 States of a Promise:
- Pending
- Fulfilled
- Rejected

## 🔸 Example:
```js
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Data received");
    }, 2000);
  });
};

fetchData()
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

## 🔸 Rewriting Callback Hell with Promises:
```js
loginUser(user)
  .then(userData => getPosts(userData.id))
  .then(posts => getComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error(err));
```

# 🔥 BONUS: Async/Await (built on Promises)
Makes async code look synchronous and cleaner.

```js
async function showComments() {
  try {
    const userData = await loginUser(user);
    const posts = await getPosts(userData.id);
    const comments = await getComments(posts[0].id);
    console.log(comments);
  } catch (err) {
    console.error(err);
  }
}
```

# 🧠 Summary

| Concept      | Type         | Syntax Style       | Pros                     | Cons                          |
|--------------|--------------|--------------------|--------------------------|-------------------------------|
| Callback     | Non-blocking | Nested             | Simple to start          | Callback Hell                 |
| Promise      | Non-blocking | Chaining (.then)   | Avoids nesting, better structure | Can still get complex      |
| Async/Await  | Non-blocking | Synchronous style  | Clean, readable          | Requires error handling (try/catch) |
