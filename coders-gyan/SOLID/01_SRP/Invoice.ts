import { Product } from "./Order";

export class Invoice {
    generateInvoice(products: Product[], amount: number) {
        console.log(`
Invoice Date: ${new Date().toDateString()}
-------------------------------
Product Name\tPrice
        `);

        products.forEach((product) => {
            console.log(`${product.name}\t\t${product.price}`);
        });
        console.log("-------------------------------");
        console.log(`Total: ${amount}`);
    }
}