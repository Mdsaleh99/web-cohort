# TypeScript Deep Dive: From Basics to Advanced

---

## 🟢 1. Introduction to TypeScript

TypeScript is a **strongly typed superset of JavaScript** developed by Microsoft. It brings **static typing**, **interfaces**, and **advanced type inference** to JavaScript, making it more predictable and maintainable for large-scale applications.

### Why TypeScript?

* **Static type checking:** Errors are caught at compile-time, not runtime.
* **Improved readability:** Code becomes self-documenting.
* **Better tooling:** IntelliSense, auto-completion, and refactoring are safer.
* **Large-scale maintainability:** Interfaces and types help teams collaborate efficiently.

### Example: JS vs TS

```js
// JavaScript
function add(a, b) {
  return a + b; // runtime error if b is a string
}
```

```ts
// TypeScript
function add(a: number, b: number): number {
  return a + b; // compile-time type safety
}
```

---

## 🟠 2. Basic Types in TypeScript

TypeScript provides primitive and special types that define what kind of values variables can hold.

| Type      | Description                            | Example                                                |
| --------- | -------------------------------------- | ------------------------------------------------------ |
| `string`  | Text data                              | `let name: string = 'Alice';`                          |
| `number`  | Numeric values                         | `let score: number = 42;`                              |
| `boolean` | Logical values                         | `let isActive: boolean = true;`                        |
| `any`     | Opt-out of type checking               | `let random: any = 'hello';`                           |
| `unknown` | Similar to `any` but safer             | `let data: unknown = 123;`                             |
| `void`    | Used for functions that return nothing | `function log(): void {}`                              |
| `never`   | Functions that never return            | `function error(): never { throw new Error('Fail'); }` |

### Why `unknown` over `any`?

`any` disables all type checking, while `unknown` forces you to **narrow** the type before use.

```ts
let val: unknown = 'TS';
if (typeof val === 'string') console.log(val.toUpperCase());
```

---

## 🟡 3. Arrays and Tuples

### Arrays

Arrays hold multiple values of the same type.

```ts
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['Alice', 'Bob'];
```

### Tuples

Tuples hold fixed-size collections of values of specific types.

```ts
let user: [string, number] = ['John', 25];
```

You can use tuples to represent key-value pairs or structured data.

---

## 🔵 4. Enums

Enums allow naming numeric or string constants for better readability.

```ts
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}

let move: Direction = Direction.Up;
```

### Why use Enums?

They make code more expressive and help avoid magic strings.

---

## 🟣 5. Interfaces and Objects

Interfaces define **the shape of an object**. They help you describe what an object must contain.

```ts
interface User {
  name: string;
  age: number;
  isAdmin?: boolean; // optional property
}

const user: User = { name: 'Alice', age: 25 };
```

Interfaces can extend other interfaces:

```ts
interface Employee extends User {
  department: string;
}

const emp: Employee = { name: 'Bob', age: 30, department: 'IT' };
```

### Interface vs Type Alias

```ts
interface IUser { name: string }
type TUser = { name: string }
```

* **Interfaces** can be extended and merged.
* **Type aliases** can represent primitives, unions, and intersections.

---

## ⚪ 6. Functions

### Function Declaration

```ts
function greet(name: string): string {
  return `Hello, ${name}`;
}
```

### Optional and Default Parameters

```ts
function register(user: string, isAdmin: boolean = false): void {
  console.log(user, isAdmin);
}
```

### Function Type Definition

```ts
let multiply: (x: number, y: number) => number;
multiply = (x, y) => x * y;
```

### Rest Parameters

```ts
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}
```

---

## 🔴 7. Union and Intersection Types

### Union Types

Used when a variable can hold multiple types.

```ts
let input: string | number;
input = '123';
input = 123;
```

### Intersection Types

Combine multiple types into one.

```ts
interface Person { name: string }
interface Contact { email: string }
let employee: Person & Contact = { name: 'Tom', email: 'tom@mail.com' };
```

---

## 🟢 8. Type Guards

Type guards help **narrow down** a union type.

```ts
function printId(id: string | number) {
  if (typeof id === 'string') console.log(id.toUpperCase());
  else console.log(id.toFixed(2));
}
```

### `in` and `instanceof` Guards

```ts
class Dog { bark() {} }
class Cat { meow() {} }

function sound(animal: Dog | Cat) {
  if (animal instanceof Dog) animal.bark();
  else animal.meow();
}
```

---

## 🟠 9. Generics

Generics allow you to create reusable components that work with any type.

```ts
function identity<T>(value: T): T {
  return value;
}
```

### Real-World Example

```ts
function wrapInArray<T>(item: T): T[] {
  return [item];
}
```

### Generic Constraints

You can restrict the types allowed.

```ts
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}
```

---

## 🟡 10. Classes and OOP

TypeScript supports full **object-oriented programming**.

```ts
class Person {
  constructor(private name: string, public age: number) {}

  greet() {
    console.log(`Hello, I’m ${this.name}`);
  }
}

const user = new Person('John', 30);
user.greet();
```

### Access Modifiers

* `public`: accessible everywhere (default)
* `private`: only inside class
* `protected`: inside class and subclasses

### Inheritance

```ts
class Employee extends Person {
  constructor(name: string, age: number, private salary: number) {
    super(name, age);
  }
}
```

---

## 🔵 11. Abstract Classes

Abstract classes act as blueprints and cannot be instantiated directly.

```ts
abstract class Shape {
  abstract area(): number;
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }
  area(): number { return Math.PI * this.radius ** 2; }
}
```

---

## 🟣 12. Modules and Namespaces

### ES Modules

```ts
// math.ts
export const add = (a: number, b: number) => a + b;

// app.ts
import { add } from './math';
console.log(add(2, 3));
```

### Namespaces (legacy)

Used before ES Modules existed.

```ts
namespace Utils {
  export function log(msg: string) { console.log('LOG:', msg); }
}
Utils.log('Working!');
```

---

## 🟤 13. Utility Types

TypeScript has built-in utility types to transform existing types.

| Utility        | Purpose                  | Example                  |
| -------------- | ------------------------ | ------------------------ |
| `Partial<T>`   | Makes all props optional | `Partial<User>`          |
| `Required<T>`  | Makes all props required | `Required<User>`         |
| `Readonly<T>`  | Props become read-only   | `Readonly<User>`         |
| `Pick<T, K>`   | Select specific keys     | `Pick<User, 'name'>`     |
| `Omit<T, K>`   | Remove keys              | `Omit<User, 'age'>`      |
| `Record<K, T>` | Map keys to values       | `Record<string, number>` |

---

## ⚪ 14. Mapped & Conditional Types

Mapped types allow you to transform types dynamically.

```ts
type Optional<T> = {
  [K in keyof T]?: T[K];
};
```

Conditional types make logic-based type transformations.

```ts
type IsString<T> = T extends string ? 'yes' : 'no';
```

---

## 🔴 15. Discriminated Unions

Useful for defining multiple object shapes with a common field.

```ts
interface Square { kind: 'square'; size: number; }
interface Circle { kind: 'circle'; radius: number; }

type Shape = Square | Circle;

function area(shape: Shape) {
  switch (shape.kind) {
    case 'square': return shape.size ** 2;
    case 'circle': return Math.PI * shape.radius ** 2;
  }
}
```

---

## 🟢 16. Decorators

Decorators are metadata functions that modify class behavior (experimental feature).

```ts
function Logger(constructor: Function) {
  console.log('Logging class:', constructor.name);
}

@Logger
class User {
  constructor(public name: string) {}
}
```

### Real Use Case

In Angular, decorators like `@Component` and `@Injectable` are used to define metadata.

---

## 🟠 17. Type Inference

TypeScript often infers types automatically.

```ts
let count = 10; // inferred as number
```

However, explicit types are preferred for clarity in APIs or complex functions.

---

## 🟡 18. Advanced Features

### `keyof` and `typeof`

```ts
interface User { name: string; age: number }
type UserKeys = keyof User; // 'name' | 'age'

const person = { name: 'Tom', age: 25 };
type PersonType = typeof person; // { name: string; age: number }
```

### `infer`

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

### Template Literal Types

```ts
type Direction = 'left' | 'right';
type Move = `move-${Direction}`; // 'move-left' | 'move-right'
```

---

## 🧠 19. Common Mistakes and Gotchas

* Overusing `any` removes TypeScript’s benefits.
* Avoid type assertions unless absolutely needed.
* Always enable `strict` mode in `tsconfig.json`.
* Prefer interfaces for contracts, types for unions.

---

## ✅ 20. Real-World Example

```ts
interface ApiResponse<T> {
  status: number;
  data: T;
  error?: string;
}
```

This interface describes the **shape of an API response**.

* **`T` is a generic type**, meaning `data` can be **any type** (object, array, string, etc.)
* **`status`** → the HTTP status code (like `200`, `404`, `500`)
* **`data`** → the actual response data (type depends on `T`)
* **`error?`** → optional field that stores an error message (only present if something goes wrong)

This makes the response **strongly typed**, flexible, and safe.

---

### **2. `fetchData<T>` Function**

```ts
async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return { status: res.status, data };
  } catch (err: any) {
    return { status: 500, data: {} as T, error: err.message };
  }
}
```

This is a **generic API fetch function** that:

### ✔ **Takes a URL as input**

You pass the API endpoint you want to call.

### ✔ **Uses Generics (`<T>`)**

The caller decides what type of data they expect:

```ts
fetchData<User>(url);
fetchData<Product[]>(url);
```

This gives you **full type safety**.

### ✔ **Returns a promise of `ApiResponse<T>`**

Meaning the function always returns the same **structured object**, whether successful or failed.

---

### **What Happens Inside?**

#### **1. Try Block (Successful Request)**

* Calls `fetch(url)`
* Converts the response to JSON
* Returns:

```ts
{ status: res.status, data: <parsed json> }
```

Example successful output:

```ts
{
  status: 200,
  data: { id: 1, name: "Saleh" }
}
```

---

#### **2. Catch Block (If an Error Occurs)**

If network fails or JSON parsing fails:

* It returns:

```ts
{
  status: 500,
  data: {} as T,     // empty fallback data, typed as T
  error: err.message // description of error
}
```

This prevents the app from crashing and gives a **consistent response format**.

---

## 📝 **In Simple Words**

* `ApiResponse<T>` = a **template** describing what API responses look like.
* `fetchData<T>` = a **reusable, type-safe function** to fetch API data.
* It **always returns** the same shape: `status`, `data`, and maybe `error`.
* Makes your API calls **clean, predictable, and strongly typed**.

---

## 🏁 Conclusion

TypeScript isn’t just about types — it’s about writing **cleaner, safer, and maintainable JavaScript**. By mastering TypeScript, you gain confidence in code quality, scalability, and developer collaboration.
