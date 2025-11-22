import "reflect-metadata";
// Decorators are special function.

/**
 * Method Decorator Parameters:
 *
 * @param target - The class prototype (for instance methods)
 *                 or the class constructor (for static methods).
 *
 * @param key - The name of the method being decorated.
 *
 * @param descriptor - A PropertyDescriptor object for the method.
 *                     descriptor.value contains the actual function body.
 *                     You can wrap/modify the method by changing descriptor.value.
 */
function Log(target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
        console.log(`The ${key} has been called`);

        return originalMethod.apply(this, args);
    };
}

function Role(...outerArgs: unknown[]) {
    console.log(outerArgs);
    
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: unknown[]) {
            if (!outerArgs.includes(args[0].user.role)) {
                console.log("Not allowed!");
                return;
            }

            return originalMethod.apply(this, args);
        };
    };
}

class ProductController {
    @Role('admin', 'manager')
    create(req: { user: { role: string } }) {
        console.log("Product created!");
    }

    @Log
    update() {
        console.log("helo");
    }
}

const pc = new ProductController();
// pc.update()

const req = {
    user: {
        role: "admin",
    },
};

pc.create(req);
