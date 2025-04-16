const arr = [1, 2, 3, 4, 5, 6]

function proxy_revision(targetArr) {
    return new Proxy(targetArr, {
        get(target, prop) {
            return target[prop]
        },
        set(target, prop, value) {
            target[prop] = `${value}📗`;
        }
    })
}

// proxy_revision(arr)

// console.log(`original array `, arr); // o/p => original array  [ 1, 2, 3, 4, 5, 6 ]
// arr[1] = 111
// console.log(`updated array `, arr); // o/p => updated array  [ 1, 111, 3, 4, 5, 6 ]

// const proxyArr = proxy_revision(arr);
const proxyArr = proxy_revision([...arr]);


console.log(`original array `, arr);
console.log(`proxyArr array `, proxyArr);

proxyArr[1] = 112;

console.log(`updated array `, arr);
console.log(`proxyArr updated array `, proxyArr);

// proxyArr[1] = 112 jab ye kiya tab original arr me bhi value update huyi because array stored in heap memory and 'targetArr' ko 'arr' ka reference mila means 'arr' ka memory address mila so output of both arr and proxyArr is [ 1, '112📗', 3, 4, 5, 6 ]. if we want to prevent this copy we have to pass argument as new array with spread operator [...arr]. [...arr] this means we did new array and in that new array we spreaded original array values