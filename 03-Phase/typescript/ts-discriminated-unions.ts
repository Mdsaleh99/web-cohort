// Discriminated Unions let you combine multiple object types into one, using a common "type" property so TypeScript can automatically detect the exact type and keep your code safe and error-free.

type Payment = {
    status: "initiated" | "processing" | "failed" | "success";
    attempts?: number;
    reason?: string;
    txnId?: number;
};

type DisPayment = 
    | { status: "initiated" }
    | { status: "processing", attempts: number }
    | { status: "failed", reason: string }
    | { status: "success", txnId: number };


function processPayment(payment: DisPayment) {
    if (payment.status === "initiated") {
        console.log("payment initiated");
    }
    if (payment.status === "processing") {
        console.log("attempts:", payment.attempts! + 1);
    }
    if (payment.status === "failed") {
        console.log("reason:", payment.reason!.toUpperCase());
    }
    if (payment.status === "success") {
        console.log("transaction completed:", payment.txnId!.toFixed());
    }
}
processPayment({ status: "success", txnId: 123456789 });
// processPayment({ status: "failed" }); // if i don't use reason here it gives an error
