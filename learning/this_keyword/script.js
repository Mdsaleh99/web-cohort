"use strict";

console.log(window); // window is a global object for browser
console.log(this); // 'this' keyword always refer to global object. for browser global object is window so 'this' keyword points to window

function func() {
  console.log("hi, this is func", this);
}

// func()
window.func();
// jab function ya method me 'this' keyword hai tab oh 'this' point karega jo uss function ya method ko invoke ya access karne ki koshish karra hai wahi hoga hamara 'this'. jaise ki func() k andar 'this' jo hai woh window ko point karega because we accessing using window.func() like that
// NOTE: windows k andar jo methods hai usko hum direct b likh sakte hai ya window. karke b likh sakte hai koyi problem nhi hai  (e.g: alert("hello"), window.alert("hi"), func(), window.func())

func(); // jab javascript strict mode me run karte hai tab 'this' keyword ki value iss function me undefined aati hai because we are directly accessing func() here if we access with window at that time the 'this' points to window. kisi k through access nhi karre hai func() ko directly access karre hai isliye undefined hai

// iss pore ko kehte hai 'Implicit binding of this keyword'. by default this keyword yese hi kaam karta hai

// ----------------------------------------------------------------------------------------

// Explicit binding of this keyword
// for explicitly bind this keyword done using => call(), apply(), bind()

const myName = "abdulla";
const user = {
  myName: "saleh",
  about(hoby, design) {
    console.log(this);
    // console.log(`Hi my name is ${myName}`);
    // console.log(`Hi my name is ${user.myName}`);
    console.log(
      `Hi my name is ${this.myName} and i like ${hoby} and ${design}`
    );
  },
};

const user2 = {
  myName: "asim",
};

console.log(user.myName); // "saleh"
user.about(); // abdulla because in about myName is indiviual property and it is taking from outside myName, if we want inside myName we have to use 'this' keyword or we have to do 'user.myName'
// 'user.myName' yese baar baar likhne se accha hai 'user.' ki jagah 'this.' likho

user.about(); // here this ki value user object ka myName because uske through access karre hai

// user.about.call(user2) // call help karta hai explicitly bind karne k liye, we want jo about method hai usme jo 'this' keyword hai oh represent kare user2 ko. so yahi karne k liye    call() use karte hai

user.about.call(user2, "sleeping", "SDE");
user.about.apply(user2, ["sleeping", "SDE"]); // internally apply() jo hai oh call() ko hi use karta hai
// call and apply onspot means immidiately execute karte hai.

// jabhi call, apply, bind use karte hai tab first humko batana padega ki 'this' keyword kis ki taraf point kare. for e.g:  user object ka about() me jo 'this' hai oh user2 ko point karra hai

// bind() hai oh immidiately execute nhi hota lekin jis function ya method pe muje lagaya hai mai wahi method return karunga, but iss bar uska jo 'this' hoga uski binding me pehla argument k saath karke hi return karunga
// bind() ek naya function return karega

const fn = user.about.bind(user2, "sleeping", "SDE");
console.log("fn", fn);
fn();

// ---------------------------------------------------------------------------------------

function about(hoby, design) {
    console.log(this);
    // console.log(`Hi my name is ${myName}`);
    // console.log(`Hi my name is ${user.myName}`);
    console.log(`Hi my name is ${this.myName} and i like ${hoby} and ${design}`);
}

// about("sleep", "SDE"); // here 'this.myName' is undefined because myName property window object me nhi hai
about.call(user2, "sleep", "SDE");

// -------------------------------------------------------------
// Arrow functions do not have their own 'this'
// instead it inherits the value of 'this' from its outer or parent normal function
const user3 = {
  myName: "saleh",
  about: (hoby, design) => {
    console.log(this);
    // console.log(`Hi my name is ${myName}`);
    // console.log(`Hi my name is ${user.myName}`);
    console.log(
      `Hi my name is ${this.myName} and i like ${hoby} and ${design}`
    );
  },
};

user3.about("writing", "sales") // 'this.myName' undifined hoga because arrow function ka 'this' nhi hota hai
user3.about.call(user2, "writing", "sales") // 'this.myName' undifined hoga because arrow function ka 'this' nhi hota hai
user3.about.apply(user2, ["writing", "sales"]) // 'this.myName' undifined hoga because arrow function ka 'this' nhi hota hai
const fnn = user3.about.bind(user2, "writing", "sales") // 'this.myName' undifined hoga because arrow function ka 'this' nhi hota hai
fnn()

const user4 = {
    myName: "saleh",
    about: function (hoby, design) {
        // this --> user4
        const ab = (hoby, design) => {
            // no self this
            console.log(this);
            // console.log(`Hi my name is ${myName}`);
            // console.log(`Hi my name is ${user.myName}`);
            console.log(
            `Hi my name is ${this.myName} and i like ${hoby} and ${design}`
            );
        }
        ab(hoby, design);
    }
};

// ab() arrow function hai aur uska parent ek normal function hai so ab() inherit karega this from parent normal function

user4.about("write", "mern")

/*

    'this' keyword k 3 golden rules
    1. global phase me this keyword global object ko refer karta hai. (e.g: browser k case me global object window object hai toh woh window ko refer karega)
    2. function ya method k andar jo this keyword hai woh jo method ya function usko invoke karne ki koshish karra hai usko refer karega
    3. arrow function ka apna 'this' nhi hota oh apna parent normal function ka hi 'this' access karre hote hai

*/