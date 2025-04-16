// There are 2 types machine coding challenges
// 1. task based machine coding (e.g: design a quiz)
// 2. concept based machine coding (e.g: negative index)

// proxy concept => this concept helps to solve the negativeIndex qs and different qs which is based on proxy concept in machine coding round
const user = {
    name: "saleh",
    age: 23,
    password: "123"
}

const proxyUser = new Proxy(user, {
    get(target, prop) { // target k pass puri original object hoti hai and prop is property iske pass key hoti hai objects ki (e.g name, age etc) and array ki property index hoti hai
        if (prop === "password") {
            throw new Error("Access Deined")
        }

        return target[prop]
    },
    // set(target, prop, value){}
})
// console.log(proxyUser.password);


let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function negativeIndex(arr) {
    
    return new Proxy(arr, {
        get(target, prop) { // array k liye property (prop) index hoti hai
            const index = Number(prop)
            if (index < 0) {
                return target[target.length + index]
            }
            return target[index]
        },
        set(target, prop, value) {
            const index = Number(prop)
            if (index < 0) {
                target[target.length + index] = value
            } else {
                target[index] = value
            }

            return true
        }
    })
}

let newArr = negativeIndex(arr)
console.log(arr[-1]);
console.log(newArr[-1]);

newArr[-1] = 22
console.log(newArr); // [1, 2, 3, 4,  5, 6, 7, 8, 9, 22]
console.log(arr); // [1, 2, 3, 4,  5, 6, 7, 8, 9, 22]
// both output are same because it is about coping which we studied shallow and deep copy. and study about this

// Read about this => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#description



/*
-Debouncing: Delays a function call until a pause in actions
- Delaying: Runs a function after a set time
- Throttling: Limits a function call to a fixed rate
*/