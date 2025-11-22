class BaseUser {
    getRole() {
        console.log("user role");
    }
}

class User extends BaseUser {
    getAccessLevel() {
        console.log("User access level");
    }

    getRole() {
        console.log("user role");
    }
}

class Admin extends User {
    getAccessLevel() {
        console.log("Admin access level");
    }

    getRole() {
        console.log("admin role");
    }
}

class Manager extends User {
    getAccessLevel(){
        console.log("Manager access level");
    }
    getRole() {
        console.log("manager role");
    }
}

// class Customer extends User {
//     getAccessLevel() {
//         throw new Error("Customers do not have access levels");
//     }
//     getRole() {
//         throw new Error("Customers do not have roles");
//     }
// }

class Customer extends BaseUser {
    getRole() {
        console.log("customer role");
    }
}

function getUserAccessLevel(user: User) {
    user.getAccessLevel()
}

getUserAccessLevel(new User()); // Valid
getUserAccessLevel(new Admin()); // Valid
getUserAccessLevel(new Manager()); // Valid
// getUserAccessLevel(new Customer()); // LSP violation: Runtime error
// getUserAccessLevel(new Customer()); // we can't do this now because Customer is no longer a subtype of User

const customer = new Customer();
customer.getRole(); // Valid