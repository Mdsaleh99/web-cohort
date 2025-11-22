import { Invoice } from "./Invoice";
import { Order, Product } from "./Order"
import { PaymentProcessor } from "./PaymentProcessor";
import { PricingCalculator } from "./PricingCalculator";

// SOLID

//* 1. Single Responsibility Principle (SRP)
// A class should have only one reason to change, meaning class change hone ka ek single reason hona chahiye, single responsibility honi chahiye. e.g: inventory management, invoicing, payment processing alag alag classes me hone chahiye. inventory management k functions (addProduct, removeProduct, getProduct) issi class me hone chahiye. invoicing k functions (generateInvoice) alag class me hone chahiye. payment processing k functions (processPayment) alag class me hone chahiye. 

const product1 = new Product("1", "Laptop", 1000);
const product2 = new Product("2", "Phone", 500);

const order = new Order();
order.addProduct(product1);
order.addProduct(product2);

const pricingCalculator = new PricingCalculator();
const total = pricingCalculator.calulateTotal(order.getProducts())
// order.generateInvoice(order.getProducts());

const invoice = new Invoice();
invoice.generateInvoice(order.getProducts(), total);
// order.processPayment();

const paymentProcessor = new PaymentProcessor();
paymentProcessor.processPayment(order);