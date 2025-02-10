const arr = [1, 2, 3];

const str = "name";
console.log(str.prototype);

/**
 *Notes :
 * 1. .prototype detects the type and the puts all the related methods under a property called .prototype for any given variable
 * 2. Array contains prototype which contains all the properties and methods then in that case js will add __proto__ which will also have all the .prototype from base class
 * 3. Javascript checks for any property at root level, if not found at root then it checks recursively under .__proto__
 * 
 */
