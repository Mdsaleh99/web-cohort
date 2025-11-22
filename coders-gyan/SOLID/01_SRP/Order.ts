export class Product {
    id: string;
    name: string;
    price: number;

    constructor(id: string, name: string, price: number) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}

export class Order {
    private products: Product[] = [];

    addProduct(product: Product) {
        this.products.push(product);
    }

    getProducts() {
        return this.products;
    }

    removeProduct(productId: string) {
        this.products = this.products.filter((p) => p.id !== productId);
    }
}
// export class Product {
//     id: string;
//     name: string;
//     price: number;

//     constructor(id: string, name: string, price: number) {
//         this.id = id;
//         this.name = name;
//         this.price = price;
//     }
// }

// export class Order {
//     private products: Product[] = [];

//     addProduct(product: Product) {
//         this.products.push(product);
//     }

//     getProducts() {
//         return this.products;
//     }

//     removeProduct(productId: string) {
//         this.products = this.products.filter((p) => p.id !== productId);
//     }

//     calulateTotal() {
//         return this.products.reduce(
//             (total, product) => total + product.price,
//             0
//         );
//     }

//     generateInvoice(products: Product[]) {
//         console.log(`
// Invoice Date: ${new Date().toDateString()}
// -------------------------------
// Product Name\tPrice
//         `);

//         products.forEach((product) => {
//             console.log(`${product.name}\t\t${product.price}`);
//         });
//         console.log("-------------------------------");
//         console.log(`Total: ${this.calulateTotal()}`);
//     }

//     processPayment() {
//         console.log("Processing payment...");
//         console.log("Payment processed successfully!");
//         console.log("Added to accounting system!");
//         console.log("Email sent to customer!");
//     }
// }