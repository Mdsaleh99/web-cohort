let p1 = "hitesh";
let p2 = p1;

console.log(p2);

let obj1 = {
  fname: "hitesh",
  lname: "garg",
};
let obj2 = obj1; // copying the address of object
console.log(obj1);
console.log(obj2);

obj2.fname = "saleh";
console.log(obj1);
console.log(obj2);

obj2 = obj1; // copying the address of object
// so now we need copy of whole object not address
let p3 = {
  fname: p1.fname,
  lname: p1.lname,
};
console.log(p3);

let p4 = {
  fname: "hitesh",
  lname: "garg",
  address: {
    // it is a nested object so it store a address not copy in shallow copy(upper upper se copy karo)
    //   (...) -> shallow copy in object
    h: 3,
    l: 1,
  },
};

let p5 = {
  ...p4,
};
console.log(p4);
console.log(p5);

p4.address.h = 1;
console.log(p4);
console.log(p5); // address nested object hai isliye oh address of memory store karega because it is shallow copy means upper upper se copy karega but nested objects ka copy nhi karega
