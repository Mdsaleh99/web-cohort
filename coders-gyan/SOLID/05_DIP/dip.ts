// ! Most used principle in development
// DIP - Dependency Inversion Principle
    // 1. High-level modules (business logic, controllers, services) should not import anything from low-level modules (repository, data layer). Both should depend on abstractions.
    // 2. Abstractions should not depend on details. Details should depend on abstractions.
    
// class UserController {
//     constructor(private userService: UserService) {}
//     save() {
//         this.userService.save();
//     }
// }

// class UserService {
//     constructor(private userRepository: UserRepository) {}
//     save() {
//         this.userRepository.save();
//     }
// }

// class UserRepository {
//     save() {
//         console.log("save user to db");
//     }
// }

// THis is a violation of DIP because UserService depends on UserRepository directly, which is a low-level module.

// To adhere to DIP, we can introduce an abstraction (interface) for the UserRepository.

// const userRepository = new UserRepository();
// const userService = new UserService(userRepository);
// const userController = new UserController(userService);
// userController.save();


interface Repository {
    save(): void;
}

interface Service {
    save(): void;
}

class UserController {
    constructor(private service: Service) {}
    save() {
        this.service.save();
    }
}

class UserService {
    constructor(private repository: Repository) {}
    save() {
        this.repository.save();
    }
}

class UserPostgresRepository implements Repository {
    save() {
        console.log("save user to postgres db");
    }
}

class UserMongoRepository implements Repository {
    save() {
        console.log("save user to mongodb");
    }
}

class UserFakeRepository implements Repository {
    save() {
        console.log("save user to fake db");
    }
}

// const userRepository = new UserPostgresRepository();
const userRepository = new UserMongoRepository();
const userFakeRepository = new UserFakeRepository(); 
// const userService = new UserService(userRepository);
const userService = new UserService(userFakeRepository);
const userController = new UserController(userService);
userController.save();