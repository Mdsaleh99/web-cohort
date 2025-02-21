// object literal
const obj1 = {
  fname: "Saleh",
  lname: "Mulla",
  getFullName: function () {
    return `${this.fname} ${this.lname}`;
  },
};

// object literal
const obj2 = {
  fname: "Abdulla",
  lname: "Mulla",
  getFullName: function () {
    return `${this.fname} ${this.lname}`;
  },
};

// object literal
const obj3 = {
  fname: "Abdulla",
  lname: "Mulla",
};

obj3.__proto__ = obj2
// obj3 k pass getFullName function nahi hai so ye obj3 k __proto__ me check karega ki getFullName function agar hai to ye run hoga. __proto__ default is object class
// __proto__ jab tak null nahi hota tab tak ye check karega ki oh function hai ya nahi prototype me. these all known as Prototype inheritence

console.log(obj1);
console.log(obj2.getFullName());
console.log(obj3.getFullName());

// above we voilating the coding principle which is DRY (Do not Repeat Yourself) and in this it is difficult to find bug
// So we use classes to avoid this

class Person {
  constructor(fname, lname) {
    this.fnamess = fname;
    this.lname = lname;
  }
  getFullName() {
    return `${this.fnamess} ${this.lname}`;
  }
}

const p1 = new Person("Saleh", "Mulla");
const p2 = new Person("Abdulla", "Mulla");
console.log(p1.getFullName());
console.log(p2.getFullName());
p1.fnamess;
