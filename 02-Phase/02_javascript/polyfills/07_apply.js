function greet(name, age) {
  console.log(
    `Hello, my name is ${this.username}, I am ${age} years old and my friend's name is ${name}.`
  );
}

const user = { username: "Alice" };

Function.prototype.myApply = function (context, [...args]) {
  const func = this;
  const obj = { ...context };
  obj.fn = func;
  // obj.fn([...args]); // if i do like this the function receives one argument (an array), not multiple individual values. that's why we getting undefined for age
  obj.fn(...args)
};

greet.apply(user, ["Bob", 25]); // Output: Hello, my name is Alice, I am 25 years old and my friend's name is Bob.

greet.myApply(user, ["John", 30]);
