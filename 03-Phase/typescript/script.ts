// data types
//  i) primitive data type -> Number, Boolean, undefined, string, character, bigInt
//  ii) Refrence data type -> objects, functions, class, arrays, tupels

// Typescript is same like javascript and in typescript more feature is there
// Basic Types
//    Number, String, Boolean
//    Arrays, Tuples
//    Any, Unknown, Never, Void
//    Enums

// let a; // Variable a implicitly has an 'any' type, but a better type may be inferred from usage. we have to make sure we doesn't want to use 'any' type. isse bachne k liye type define karo

let a: number;
let arr: [];
let Variable: string;

// tuple Represents an array with a fixed number of elements of specified types.
let arr1: [number, string] = [12, "hi"]; // in this there is loop hole that is we can push anything in this arr1 even after defining type and limit here arr1 only 2 values number and string but we can push any value in this means only string and number

arr1.push(4);
console.log(arr1);

// compiling => tsc <filename> after compiling typescript file it creates javascript file

let variable: any; // Represents any type and is used when the type is unknown or dynamic.
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean

let vari: unknown; // Represents a value that could be any type, safer than any because it requires type checking before usage.
let noSure: unknown = 4;
noSure = "maybe a string instead";
noSure = false; // okay, definitely a boolean

if (typeof noSure === "string") {
  let str: string = noSure; // TypeScript knows it's a string now
}

// Never Represents the type of values that never occur, used for functions that always throw an error or never return. never type ka function chalne k baad aage ka code nhi chalega
function error(message: string): never {
  throw new Error(message);
}

// error("hello")

console.log("hi");

// Void Represents the absence of any type, commonly used as the return type of functions that do not return a value.
function warnUser(): void {
  console.log("This is my warning message");
}

// Enums Represents a way to define a set of named constants and we can make group.
enum Direction {
  up = "up",
  down = "down",
  right = "right",
  left = "left",
}

console.log(Direction.up);

// Type Inference
// Type inference in TypeScript is the process by which the TypeScript compiler automatically infers the types of variables, function return types, and other expressions based on the values or the operations involved, without requiring explicit type annotations from the developer.

// Variable Declarations: If you declare a variable and assign it a value, TypeScript will infer the type of that variable based on the assigned value.
let x = 10; // TypeScript infers x as number
let names = "John"; // TypeScript infers name as string
let z;

// union and intersection type
// A union type allows a value to be one of several types. It is defined using the | (pipe) symbol. and it gives in built function which is common for both type but in case we need all both type(eg. number, string)function we whave to use function with conditional statement
let value: number | string;

value = 10; // Valid: value is a number
value = "Hello"; // Valid: value is a string
// value = true;     // Error: value can only be a number or string

function abcd(val: string | number) {
  if (typeof val === "string") {
    val.toUpperCase();
  } else if (typeof val === "number") {
    val.toFixed(2);
  }
}
abcd(12);
abcd("12");

// An intersection type combines multiple types into one. It is defined using the & (ampersand) symbol. The resulting type must satisfy all the combined types simultaneously.
type Classmates = {
  section: string;
};

type Students = {
  name: string;
};

type ClassmatesInStudents = Classmates & Students;

let r: ClassmatesInStudents = {
  section: "a",
  name: "john",
};

// tsconfig.json is a configuration file that allows you to specify various compiler options and file settings for your TypeScript project.           tsc --init

// The outDir option in tsconfig.json specifies the output directory where the compiled JavaScript files will be placed.

// Once you have a tsconfig.json file set up, you can compile your entire project by simply running: this is when u specify folder in outDir     command->  tsc
/**
 * tsc <filename>.ts: Compiles a single TypeScript file.
    tsc --init: Creates a tsconfig.json file.
    outDir in tsconfig.json: Specifies where the compiled JavaScript files should go.
    tsc: Compiles the entire project based on tsconfig.json settings.
 * 
 * 
 */

// The --watch flag in TypeScript is a powerful tool that enables the TypeScript compiler to automatically recompile files whenever changes are detected. This is particularly useful during development, as it allows you to see the results of your changes immediately without having to manually run the tsc command each time.   command  (tsc --watch)

// The type keyword in TypeScript is used to define custom types, also known as type aliases. It allows you to create more descriptive and reusable types for your code.
type UserID = string;
type Point = { x: number; y: number };

let userId: UserID = "abc123";
let point: Point = { x: 10, y: 20 };

type StringOrNumber = string | number;

let value4: StringOrNumber;

value4 = "Hello"; // Valid
value4 = 42; // Valid
// value4 = true;     // Error: Type 'boolean' is not assignable to type 'StringOrNumber'.

// The typeof operator in TypeScript (and JavaScript) is used to get the type of a variable or expression at runtime. In TypeScript, typeof can also be used in type contexts to refer to the type of a variable or object.
let t = "Hello";
console.log(typeof x); // "string"

let y = 42;
console.log(typeof y); // "number"

// --------------------------------------------------------------------------------------

// Interface
// In TypeScript, an interface is a way to define the structure of an object, describing its properties and their types. It is a contract for a class or an object to follow, ensuring that it contains the defined properties with the specified types. Here's a basic example:

// Syntax
// interface InterfaceName {
//   property1: Type;
//   property2: Type;
//   method1(param: Type): ReturnType;
// }

interface Person {
  name: string;
  age: number;
  greet(): string;
}

const person: Person = {
  name: "John",
  age: 30,
  greet() {
    return `Hello, my name is ${this.name}.`;
  },
};

function Human(persons: Person) {
  persons.name.toUpperCase();
}

console.log(Human(person));

console.log(person.greet()); // Output: Hello, my name is John.

interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// --------------------------------------------------------------------------------------

// Classes
// In TypeScript, a class is a blueprint for creating objects with specific properties and methods. It allows for encapsulation of data and behavior. TypeScript classes are similar to those in other object-oriented programming languages, but with strong type-checking.

class Airpods {
  // name: string;
  price = 25000;
  image = "xy/img";
  color = "black";

  playMusic() {
    console.log("Music is playing.....");
  }
}

class Person {
  name: string; // it gives error like this Property 'name' has no initializer and is not definitely assigned in the constructor. if we remove constructor
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }
}

const john = new Person("John", 30);
console.log(john.greet()); // Output: Hello, my name is John and I am 30 years old.

/**
 * Key Features
Properties and Methods: Classes can have properties (fields) and methods (functions) defined within them. Type annotations ensure the correct types are used.

Constructor: The constructor is a special method that is called when an instance of the class is created. You can pass arguments to set the initial state of the object.

Access Modifiers: TypeScript supports public, private, and protected access modifiers to control the visibility of properties and methods:

public: Accessible everywhere (default).
private: Accessible only within the class.
protected: Accessible within the class and its subclasses.

--------------------------------------------------------------------------------------


1. public (Default)
Members with the public modifier (or no modifier) can be accessed anywhere—inside the class, outside the class, and by other classes or functions.
By default, all class members in TypeScript are public unless explicitly specified otherwise.
Example:

class Employee {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }
}

const emp = new Employee("Alice");
console.log(emp.name);      // Accessible outside the class
console.log(emp.getName()); // Accessible outside the class



2. private
Members with the private modifier are only accessible within the class in which they are declared. They cannot be accessed or modified from outside the class, including from derived classes (subclasses).
Example:

class Employee {
  private salary: number;

  constructor(salary: number) {
    this.salary = salary;
  }

  private getSalary(): number {
    return this.salary;
  }

  showSalary(): number {
    return this.getSalary(); // Can be accessed within the class
  }
}

const emp = new Employee(5000);
console.log(emp.showSalary()); // Accessible via public method
// console.log(emp.salary);      // Error: 'salary' is private
// console.log(emp.getSalary()); // Error: 'getSalary' is private


3. protected
Members with the protected modifier are accessible within the class and its subclasses. However, they are not accessible from outside the class.
protected is useful in inheritance when you want to allow access to a property or method from a subclass, but not directly from outside the class.
Example:

class Employee {
  protected position: string;

  constructor(position: string) {
    this.position = position;
  }

  protected getPosition(): string {
    return this.position;
  }
}

class Manager extends Employee {
  showPosition(): string {
    return this.getPosition(); // Accessible in subclass
  }
}

const manager = new Manager("Manager");
console.log(manager.showPosition()); // Accessible via method in subclass
// console.log(manager.position);    // Error: 'position' is protected
// console.log(manager.getPosition()); // Error: 'getPosition' is protected
*/

// In TypeScript, getters and setters allow you to control access to the properties of a class. A getter retrieves the value of a property, while a setter allows you to set or update the value. They provide a way to encapsulate logic when accessing or modifying the class properties, instead of directly interacting with them.

// class Person {
//   private _age: number;

//   constructor(age: number) {
//     this._age = age;
//   }

//   // Getter for age
//   get age(): number {
//     return this._age;
//   }

//   // Setter for age
//   set age(value: number) {
//     if (value >= 0) {
//       this._age = value;
//     } else {
//       console.log("Age must be a positive number");
//     }
//   }
// }

// const person = new Person(25);
// console.log(person.age); // Getter is called, Output: 25

// person.age = 30; // Setter is called to update the value
// console.log(person.age); // Output: 30

// person.age = -5; // Invalid value, triggers validation logic in the setter
// // Output: Age must be a positive number

// ------------------------------------------------------------------------------------------

// Functions
// 1. Named Function: A named function is a function with an explicit name and can be called by its name in the code.
function greet(name: string): string {
  return `Hello, ${name}`;
}
console.log(greet("John")); // Output: Hello, John

// 2. Anonymous Function: An anonymous function does not have a name and is typically used as a value (e.g., assigned to a variable or passed as an argument).
const greetee = function (name: string): string {
  return `Hello, ${name}`;
};
console.log(greetee("Alice")); // Output: Hello, Alice

// 3. Arrow Function: An arrow function is a shorter syntax for writing functions. It automatically binds the this context and is more concise.
const greetes = (name: string): string => `Hello, ${name}`;
console.log(greetes("Bob")); // Output: Hello, Bob

// 4. Explicit Return Type: In TypeScript, you can explicitly specify the return type of a function to ensure it returns the correct type.
function add(a: number, b: number): number {
  return a + b;
}
console.log(add(5, 10)); // Output: 15

// 5. Implicit Return Type TypeScript can infer the return type based on the return statement. You don't need to explicitly specify the return type if it can be inferred.
function multiply(a: number, b: number) {
  return a * b; // TypeScript infers the return type as `number`
}
console.log(multiply(3, 4)); // Output: 12

// 6. Optional Parameters: Optional parameters allow you to declare parameters that are not required when calling a function. They are denoted with a ?.
function greete(name: string, greeting?: string): string {
  if (greeting) {
    return `${greeting}, ${name}`;
  } else {
    return `Hello, ${name}`;
  }
}
console.log(greet("David")); // Output: Hello, David

// 7. Default Parameters: Default parameters allow you to provide a default value if an argument is not provided. If no argument is passed, the default value is used.
function greets(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}`;
}
console.log(greets("Emma")); // Output: Hello, Emma (default "Hello" is used)
console.log(greets("Emma", "Hi")); // Output: Hi, Emma

// 8. Rest Parameters: Rest parameters allow you to handle an indefinite number of parameters by capturing them in an array. They are denoted with ....
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}
console.log(sum(1, 2, 3)); // Output: 6
console.log(sum(5, 10, 15, 20)); // Output: 50

// ------------------------------------------------------------------------------------------

// 1. Modules in TypeScript
// Modules help to organize code by splitting it into smaller, reusable files. In TypeScript, each file is considered a module. You can export classes, functions, interfaces, or variables from one module and import them into another.

// Exporting and Importing:
// Export: Use export to make functions, classes, variables, or interfaces available to other files.
// Import: Use import to bring in functionality from another module into the current file.

// math.ts
// export function add(a: number, b: number): number {
//   return a + b;
// }

export const PI = 3.14;

// main.ts
// import { add, PI } from './math';
console.log(add(5, 10)); // Output: 15
console.log(PI); // Output: 3.14

// Default Exports: When a module exports a single item (class, function, or object), use export default.
// calculator.ts
export default function subtract(a: number, b: number): number {
  return a - b;
}
// main.ts
// import subtract from './calculator';
console.log(subtract(10, 5)); // Output: 5

// ------------------------------------------------------------------------------------------

// 2. Type Assertions
// Type assertions allow you to override TypeScript’s inferred type when you know more about the type than TypeScript does. This is useful when working with dynamic data (like API responses) or when you're narrowing down a more general type to a specific one.

// Syntax:
// As-syntax: value as Type
// Angle-bracket syntax: <Type>value
// Both are equivalent, but the as-syntax is more common, especially when using JSX (since angle brackets conflict with JSX syntax).

// Example (Using as):
let someValue: any = "Hello, TypeScript";
// Type assertion
let strLength: number = (someValue as string).length;

console.log(strLength); // Output: 16
// Example (Using <Type>):

// let someValue: any = "Hello, TypeScript";

// // Type assertion
// let strLength: number = (<string>someValue).length;

console.log(strLength); // Output: 16

// --------------------------------------------------------------------------------------------

// 3. Literal Types
// Literal types allow you to specify exact values a variable can hold, instead of just general types like string or number. Literal types are useful for defining variables that should only take specific values.

// String Literal Types:
// You can restrict a variable to specific string values.

// type Direction = "up" | "down" | "left" | "right";

function move(direction: Direction) {
  console.log(`Moving ${direction}`);
}

// move("up");   // OK
// move("left"); // OK
// move("backward"); // Error: Argument is not assignable to 'Direction'

// Number Literal Types:
// You can restrict a variable to specific numeric values.
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

function rollDice(dice: DiceRoll) {
  console.log(`You rolled a ${dice}`);
}
rollDice(4); // OK
// rollDice(7); // Error: Argument is not assignable to 'DiceRoll'

// Boolean Literal Types:
// You can create a type that restricts a variable to true or false.
type IsLoading = true | false;

let loading: IsLoading = true;
loading = false; // OK
// loading = "true"; // Error: Argument is not assignable to 'IsLoading'

/*

 Enums
Enums allow you to define a set of named constants. They can be used for managing fixed sets of values in your Angular applications.

enum Status {
  Active,
  Inactive,
  Pending
}
let currentStatus: Status = Status.Active;


 Type Guards
Used to ensure the type safety of variables at runtime.

function isString(value: any): value is string {
  return typeof value === 'string';
}

isString("hello"); // true



Decorators
Angular uses decorators (e.g., @Component, @Injectable, @Input) for adding metadata to classes. Decorators help Angular identify components, services, etc.
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent { }



Generics
TypeScript generics allow the creation of reusable components that can work with any type, adding flexibility to Angular services and components.
function identity<T>(arg: T): T {
  return arg;
}
const result = identity<number>(10);


*/
