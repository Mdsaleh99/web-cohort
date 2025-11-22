// LSP -> Liskov Substitution Principle
// Subtypes must be substitutable for their base types.

// Agar humare paas ek function hai jo base class ka object leta hai, toh hum us function me derived class ka object bhi pass kar sakte hain bina kisi issue ke.

class BaseBird {
    makeSound() {}
}

class Bird {
    fly() {
        console.log("Flying");
    }

    makeSound() {}
}

class Sparrow extends Bird {
    makeSound(): void {
        console.log("Chirp Chirp");
    }

    fly(): void {
        console.log("Sparrow is flying");
    }
}

// class Penguin extends Bird {
//     makeSound(): void {
//         console.log("Honk Honk");
//     }
     // Penguin class me fly method ko override karna LSP ke against hai kyunki penguins fly nahi kar sakte.
//     fly(): void {
//         throw new Error("Penguins cannot fly");
//     }
// }

// Correct implementation without violating LSP
class Penguin extends BaseBird {
    makeSound(): void {
        console.log("Honk Honk");
    }
}
// Note: We should make sure that, everything parent class does, child class also must have those abilities
function makeBirdFly(bird: Bird) {
    bird.fly();
}
makeBirdFly(new Sparrow()); // Valid
// makeBirdFly(new Penguin()); // LSP violation: Runtime error
// makeBirdFly(new Penguin()); // we can't do this now because Penguin is no longer a subtype of Bird

const penguin = new Penguin();
penguin.makeSound(); // Valid 
