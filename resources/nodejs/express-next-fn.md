# Express.js `next` Function

## 🔹 What is `next` in Express?
In **Express.js**, `next` is a function that you call to pass control from one middleware function to the next one in the stack.

Example:

```js
app.use((req, res, next) => {
  console.log("Middleware 1");
  next(); // Pass control to the next middleware
});

app.use((req, res, next) => {
  console.log("Middleware 2");
  res.send("Hello World");
});
```

➡️ The `next()` function is provided by Express itself, and it tells Express:  
**“I’m done with this middleware, move on to the next one.”**

---

## 🔹 Why is `next` important?
1. **Chaining middlewares**  
   Without `next()`, the request would get stuck in the current middleware.

2. **Error handling**  
   If you pass an argument to `next(err)`, Express knows something went wrong and will skip to error-handling middleware.

   ```js
   app.use((req, res, next) => {
     const err = new Error("Something broke!");
     next(err); // Skip normal middlewares, go to error handler
   });

   app.use((err, req, res, next) => {
     res.status(500).send(err.message);
   });
   ```

3. **Selective flow control**  
   You can decide whether to call `next()` (continue) or stop the chain by sending a response.

---

## 🔹 Types of `next` usage
1. **Normal next:** `next()`  
   → Goes to the next matching middleware/route.

2. **Error next:** `next(err)`  
   → Goes to error-handling middleware.

---

## 🔹 Example with Routes
```js
app.get("/user/:id", (req, res, next) => {
  if (req.params.id === "0") {
    next("route"); // skip this route handler, go to next matching route
  } else {
    next(); // continue in this route
  }
}, (req, res) => {
  res.send("User ID is valid");
});

app.get("/user/:id", (req, res) => {
  res.send("User not found");
});
```

---

## ✅ In short
The `next` function in Express is the mechanism that makes middleware chaining possible. It tells Express whether to continue to the next handler, or jump to error handling.
