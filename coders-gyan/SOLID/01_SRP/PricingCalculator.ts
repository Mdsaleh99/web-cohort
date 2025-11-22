import { Product } from "./Order";

export class PricingCalculator {
    calulateTotal(products: Product[]) {
        return products.reduce(
            (total, product) => total + product.price,
            0
        );
    }
}
