function greet(greeting, name) {
  console.log(`${greeting}, ${name}! My name is ${this.username}.`);
}

const user = { username: "Alice" };

Function.prototype.myBind = function (context, ...args) {
  const func = this;
    return function (...callArgs) {
      const obj = { ...context };
      obj.fn = func;
      return obj.fn.apply(obj, [...args, ...callArgs]);
  }
  
};

const greetAlice = greet.bind(user, "Hello");
greetAlice("Bob"); // Output: Hello, Bob! My name is Alice.

const greetJohn = greet.myBind(user, "Hi buddy!");
greetJohn("Alice");

/*

Why do we use apply?

✅ Because:

We want to call the original function

We want to set the value of this

And we want to pass all the arguments together (those from .bind() and those passed later)

*/