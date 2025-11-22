// OCP -> Open/Closed Principle
// A class should be open for extension but closed for modification.

// class PaymentProcessor {
//     processPayment(amount: number, paymentType: string) {
//         if (paymentType === "creditCard") {
//             console.log(`Processing credit card payment of $${amount}`);
//         } else if (paymentType === "paypal") {
//             console.log(`Processing PayPal payment of $${amount}`);
//         } else {
//             new Error("Unsupported payment type");
//         }
        // Agar hume naye payment methods add karne hain toh hume is class ko modify karna padega, jo ki OCP ke against hai. so we use constructor and dependency injection to follow OCP.
//     }
// }

// const processor = new PaymentProcessor()
// processor.processPayment(100, "creditCard")

interface IPaymentProcessor {
    processPayment(amount: number): void
}

class PaymentProcessor {
    processor: IPaymentProcessor;
    constructor(paymentProcessor: IPaymentProcessor) {
        this.processor = paymentProcessor;
    }
    processPayment(amount: number) {
        this.processor.processPayment(amount)
    }
}

class CreditCardPaymentProcessor implements IPaymentProcessor {
    processPayment(amount: number) {
        console.log(`Processing credit card payment of $${amount}`);
    }
}

class PayPalPaymentProcessor implements IPaymentProcessor {
    processPayment(amount: number) {
        console.log(`Processing PayPal payment of $${amount}`);
    }
}

const creditCardProcessor = new CreditCardPaymentProcessor()
const processor = new PaymentProcessor(creditCardProcessor)
processor.processPayment(100)