let numberOfGuest = 4

let pizzaSize
if (numberOfGuest <= 2) {
    pizzaSize = "small"
} else if (numberOfGuest <= 5) {
    pizzaSize = "medium"
} else {
    pizzaSize = "large"
}

console.log(pizzaSize);
