# 🚀 **Decorators in TypeScript — Complete Deep Dive**

Decorators in TypeScript are **special functions** that let you **annotate**, **modify**, or **extend** classes and their members (methods, properties, accessors, parameters).

They allow **meta-programming**, meaning you can change class behavior *without modifying the class logic directly*.

They are heavily used in:

* **NestJS** (e.g., `@Controller`, `@Get`)
* **Angular** (e.g., `@Component`)
* **Class-validator / class-transformer**
* **ORMs** (e.g., TypeORM’s `@Entity`, `@Column`)

---

# ✅ 1. **Enabling Decorators**

To use decorators, enable the following in `tsconfig.json`:

```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```

`emitDecoratorMetadata` is optional but required for frameworks like NestJS & TypeORM that use reflection.

---

# 🎯 2. **Types of Decorators**

| Decorator Type          | Usage                        |
| ----------------------- | ---------------------------- |
| **Class Decorator**     | Modifies entire class        |
| **Method Decorator**    | Modifies a method            |
| **Property Decorator**  | Applied to properties        |
| **Accessor Decorator**  | For getters/setters          |
| **Parameter Decorator** | Applied to method parameters |

---

# 🧠 3. **How Decorators Work Internally?**

A decorator is just a function:

```ts
function MyDecorator(target: any) {
  console.log(target);
}
```

Apply it like:

```ts
@MyDecorator
class Test {}
```

Decorators run **when the class is defined**, NOT at object creation.

---

# 🔥 4. **Class Decorators**

### ➤ Example: Add a new property to a class

```ts
function AddRole(role: string) {
  return function (constructor: Function) {
    constructor.prototype.role = role;
  };
}

@AddRole("admin")
class User {}

const u = new User();
console.log(u.role); // "admin"
```

---

# 🔥 5. **Method Decorators**

They receive:

* `target` → class prototype
* `propertyKey` → method name
* `descriptor` → property descriptor

### ➤ Example: Log every method call

```ts
function Log() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      console.log(`[${propertyKey}] Called with:`, args);
      return original.apply(this, args);
    };

    return descriptor;
  };
}

class MathLib {
  @Log()
  add(a: number, b: number) {
    return a + b;
  }
}
```

---

# 🔥 6. **Property Decorators**

Used for validation/metadata injection.

```ts
function MinLength(len: number) {
  return function (target: any, propertyKey: string) {
    let value: string;

    const getter = () => value;
    const setter = (newVal: string) => {
      if (newVal.length < len) {
        throw new Error(`Minimum length is ${len}`);
      }
      value = newVal;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
    });
  };
}

class User {
  @MinLength(4)
  username: string = "";
}
```

---

# 🔥 7. **Accessor Decorators**

Modify `get/set`.

```ts
function Readonly(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.writable = false;
}

class Config {
  private _env = "prod";

  @Readonly
  get env() {
    return this._env;
  }
}
```

Now the getter cannot be overwritten.

---

# 🔥 8. **Parameter Decorators**

Useful for NestJS-like frameworks.

```ts
function LogParam(target: any, methodName: string, parameterIndex: number) {
  console.log(`Parameter decorator on ${methodName}, index ${parameterIndex}`);
}

class Demo {
  test(@LogParam message: string) {}
}
```

---

# ⭐ 9. **Decorator Factories**

A decorator factory is a function that returns a decorator:

```ts
function Auth(role: string) {
  return function (constructor: Function) {
    constructor.prototype.role = role;
  };
}

@Auth("admin")
class Controller {}
```

Factories allow dynamic configuration.

---

# 🏗 10. **Multiple Decorators**

Order matters.

```ts
@A
@B
class Test {}
```

Execution order:

1. **Decorator factories** top → bottom
2. **Decorators** bottom → top

---

# 🤖 11. **Using Reflect Metadata (Advanced)**

Install:

```
npm install reflect-metadata
```

Import once:

```ts
import "reflect-metadata";
```

### ➤ Example

```ts
function Type(type: string) {
  return (target, key) => {
    Reflect.defineMetadata("custom:type", type, target, key);
  };
}

class Car {
  @Type("string")
  model: string;
}

console.log(Reflect.getMetadata("custom:type", Car.prototype, "model"));
```

---

# 🧩 12. **Real-World Example: Validate Class Fields**

```ts
const validators = new Map();

function Required(target: any, key: string) {
  validators.set(key, "required");
}

class User {
  @Required
  name: string;

  constructor(name: string) {
    if (validators.get("name") === "required" && !name) {
      throw new Error("name is required");
    }
    this.name = name;
  }
}

new User(""); // ❌ Error
```

---

# 🧨 13. **Real Use Cases in Modern Frameworks**

### ✔ **NestJS Controllers**

```ts
@Controller("users")
class UsersController {
  @Get()
  getAll() {}
}
```

### ✔ **Angular Component**

```ts
@Component({
  selector: "app-home",
  templateUrl: "./home.html",
})
class HomeComponent {}
```

### ✔ **TypeORM Models**

```ts
@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
}
```

### ✔ **class-validator**

```ts
class LoginDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
```

---

# 🏁 **Summary**

Decorators allow you to *modify class behavior at definition time*.
They are powerful because they give you:

* Metadata reflection
* Dependency injection patterns
* Runtime validation
* Routing and mapping
* ORM entity schemas
* Logging / tracing
* Clean and modular code

---
