// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect

let p1 = {
    fname: "john",
    lname: "doe",
    age: 40
}

const p1Proxy = new Proxy(p1, {
    get(target, prop) {
        // console.log({ target, prop });
        console.log(`Accessing property: ${prop}`);
        // if(prop in target) return target[prop]
        if(prop in target) return Reflect.get(target, prop)
        return false
    },

    set(target, prop, value) {
        if (!(prop in target)) throw new Error(`${prop} does not exists`)
        switch (prop) {
            case 'fname':
            case 'lname':
                if (typeof value !== "string")
                  throw new Error(`${prop} must be a string`);
            break
        
            case 'age':
                if (typeof value !== 'number') throw new Error(`${prop} must be a number`)
                if(value <= 0) throw new Error(`${prop} must be > 0`)
        }
        
        // target[prop] = value // we are doing default behaivour how javascript sets value, it is buggy code and in some case it can crash. so we use Reflect using this Reflect we can give default behaviour with no worries

        Reflect.set(target, prop, value)
    }
})

console.log(p1Proxy.lname); // Output: Accessing property: lname, doe
// p1Proxy.age = "10" // Error: age must be a number
p1Proxy.age = 10
console.log(p1Proxy);

// Reflect: A built-in JavaScript object that provides methods for interacting with objects.It helps perform operations like getting, setting, and checking properties dynamically
/*
target:
This parameter refers to the original object that the Proxy is wrapping. It's the object whose behavior is being intercepted and potentially modified by the Proxy.

prop:
This parameter represents the name of the property that is being accessed or modified on the target object. It can be a string or a Symbol.
*/
