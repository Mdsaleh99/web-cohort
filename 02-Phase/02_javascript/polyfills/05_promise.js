/*
Promise
• Jaise hi promise ka obj banate ho ek executor (callback) function do.
• executor function ke paas resolve and ek reject
• resolve ko call karne pr:
    • promise fullfill and
    • jitne bhi .then function voh run kar jate h
• reject ko call karne pr:
    • promise reject ho jata h and
    • sabhi catch functions call
• finally toh har bar karna hi hai
*/

// creating MyPromise class
class MyPromise {
  constructor(executorFn) {
    this._state = "pending";
    this._successCallBacks = []; // jitne bhi then() function user dega chains me toh o iss me push honge aur iske upper loop karke execute karenge baad me resloveFunction k ander
    this._errorCallBacks = [];
    this._finallyCallBacks = [];
    this.value = undefined; // this written because when promise instantly resolving the value is undefined so we passing this.value in cb() and user given value sets in the resolverFunction()
    executorFn( // we doing bind because we calling function from outside and we loosing context. when we do resolve() that is run from outside it does'nt know the context
      this.resolverFunction.bind(this),
      this.rejectorFunction.bind(this)
    );
  }

  then(cb) {
    if (this._state == "fulfilled") {
      console.log(`Apka promise toh pehle hi pura hogya, Run hi kar deta hu`);
      cb(this.value); 
      return this;
    }

    this._successCallBacks.push(cb);
    return this; // khud k hi instance return kardo. we returning because we have to do chanining
  }

  catch(cb) {
    if (this._state == "rejected") {
      console.log(`Apka promise toh pehle hi reject hogya, Run hi kar deta hu`);
      cb();
      return this;
    }

    this._errorCallBacks.push(cb);
    return this; // khud k hi instance return kardo. we returning because we have to do chanining
  }

  finally(cb) {
    if (this._state !== "pending") {
      cb();
      return this;
    }

    this._finallyCallBacks.push(cb);
    return this; // khud k hi instance return kardo. we returning because we have to do chanining
  }

  resolverFunction(value) {
    console.log(
      `Fullfilling Promise, Running ${this._successCallBacks.length} callbacks`
    );
    this._state = "fulfilled";
    this.value = value;
    this._successCallBacks.forEach((cb) => cb(value));
    this._finallyCallBacks.forEach((cb) => cb());
  }

  rejectorFunction(err) {
    this._state = "rejected";
    this._errorCallBacks.forEach((cb) => cb(err));
    this._finallyCallBacks.forEach((cb) => cb());
  }
}

// function wait(seconds) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => resolve(), seconds * 1000);
//   });
// }

// wait(5)
//   .then(() => console.log("successfully executed"))
//   .catch(() => console.log("Error occured"));

// function wait(seconds) {
//   return new MyPromise((resolve, reject) => {
//     setTimeout(() => resolve(), seconds * 1000);
//   });
// }

// wait(10)
//   .then(() => console.log("MyPromise: successfully executed"))
//   .catch(() => console.log("MyPromise: Error occured"))
//   .finally(() => console.log("MyPromise: finally executed"));

function wait(seconds) {
  const p = new MyPromise((resolve, reject) => {
    resolve("Hahaha"); 
  });
  return p;
}

const p = wait(5); // promise yahi pe hi resolve hogaya. promise register hone se pehle hi resolve hogaya means .then() ya catch() ya finally() run hone se pehle hi resolve hogaya toh yeh ek problem hai and we have to fix it. 
// so to fix it we have to check condition in then(),catch(),finally() agar promise pehle se hi 'fulfilled' pada hai toh then() me, toh direct cb() ko run kardo and successCallBacks me push karne ki zarurat nhi hai aur return kardo 'this'. same for catch() but _state should 'rejected' and same for finally() but _state should not be 'pending'

console.log("Registering Callbacks");

p.then((e) => console.log(`V1 Promise Resolved After 5 sec`, e))
  .catch(() => console.log(` V1Rejected after 5 sec`))
  .finally(() => console.log(` V1 Mei toh harr baar chalunga`));

p.then((e) => console.log(`V2 Promise Resolved After 5 sec`, e))
  .catch(() => console.log(`V2 Rejected after 5 sec`))
  .finally(() => console.log(`V2 Mei toh harr baar chalunga`));