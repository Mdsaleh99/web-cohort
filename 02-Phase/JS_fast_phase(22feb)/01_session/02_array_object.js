let chaiTypes = ["Masala Chai", "Ginger chai", "Green Tea", "Lemon Tea"];

// console.log(chaiTypes[2]);

// console.log(`Total chai Types: ${chaiTypes.length}`);

chaiTypes.push("Herbal Tea");
const data = chaiTypes.pop(); // pop() functions returns the deleted value and it delete from last
console.log(data); // o/p => Herbal Tea

let index = chaiTypes.indexOf("Green-Tea"); // the output is -1 because in array there is no match to "Green-Tea" so indexOf function return -1
// let index = chaiTypes.indexOf("Green Tea"); // output => 2
console.log(index);

if (index !== -1) {
  chaiTypes.splice(index, 1); // The splice() method of Array instances changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.
}

// console.log(chaiTypes); // o/p => 

chaiTypes.forEach((chai, index) => {
  console.log(`${index + 1}: ${chai}`);
});

let moreChaiTypes = ["Oolong Tea", "White Tea"];

let allChaiTypes = chaiTypes.concat(moreChaiTypes);

let newChaiTypes = [...chaiTypes, "Chamolina Tea"];// unpacking the chaiTypes (...chaiTypes) and adding "Chamolina Tea"
// console.log(newChaiTypes);

// ******************************************************************************************

// Objects

let chaiRecipe = {
  name: "Masala Chai",
  ingredients: {
    teaLeaves: "Assam Tea",
    milk: "Full Cream Milk",
    sugar: "Brown sugar",
    spices: ["Daalchini", "Ginger"],
  },
  instruction: "Boil water, add tea leaves, milk, sugar and spices",
};

// console.log(chaiRecipe.ingredients.spices[1]);

let updatedChaiRecepie = {
  ...chaiRecipe,
  instruction: "Boil water, add tea leaves, mil, sugar, spices with some love",
};

// let { name, myingredients } = chaiRecipe; // object destructring. o/p of myingredients is undefined because there is no property called myingredients in chaiRecipe... In object destructring name name should be proper which given as in object and In array destructuring we can give any name like below see array destructring
let { name, ingredients } = chaiRecipe; // object destructring
let [firstChai, secondChai] = chaiTypes; // array destructuring

// console.log(myingredients); // o/p => undefined
console.log(ingredients); 
console.log(secondChai);
