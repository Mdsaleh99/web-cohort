## TypeScript Discriminated (Tagged) Unions — Simple Guide

This file explains the idea of discriminated unions in plain, simple words. Short, clear examples show how to use them safely.

### What is a discriminated union?

A discriminated union is a group of object types that all share one common property with literal values. That shared property (often `type`, `kind`, or `status`) is the "tag" or "discriminator." TypeScript uses this tag to know which object shape you have at runtime.

Example idea: a payment can be `initiated`, `processing`, `failed`, or `success`. Each state can have different fields.

### Why use them?

-   They make your code safer. The compiler knows exactly which fields exist for each state.
-   They help prevent runtime errors (no more guessing if a property exists).
-   They make code easier to read and maintain.

---

### Simple (original) example

This is the example from your TypeScript file. It uses one type with optional fields:

```ts
type Payment = {
    status: "initiated" | "processing" | "failed" | "success";
    attempts?: number;
    reason?: string;
    txnId?: number;
};

function processPayment(payment: Payment) {
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
```

Note: this works, but the `!` (non-null assertion) is needed because TypeScript can't be sure which fields exist.

---

### Better: explicit discriminated union (safer)

Define one type for each state. The `status` field is the discriminator and tells the compiler which fields are present.

```ts
type Initiated = { status: "initiated" };
type Processing = { status: "processing"; attempts: number };
type Failed = { status: "failed"; reason: string };
type Success = { status: "success"; txnId: number };

type PaymentState = Initiated | Processing | Failed | Success;

function process(payment: PaymentState) {
    switch (payment.status) {
        case "initiated":
            console.log("payment initiated");
            break;

        case "processing":
            // attempts is guaranteed here
            console.log("attempts:", payment.attempts + 1);
            break;

        case "failed":
            // reason is guaranteed here
            console.log("reason:", payment.reason.toUpperCase());
            break;

        case "success":
            // txnId is guaranteed here
            console.log("transaction completed:", payment.txnId.toFixed());
            break;
    }
}
```

No `!` needed. Each branch has the exact fields required.

---

### How narrowing works (short)

When you check `payment.status === 'success'`, TypeScript narrows the type of `payment` to the `Success` variant. That means you can use `payment.txnId` safely inside that branch.

Use `switch` on the discriminant for clear code and good compiler help.

---

### Exhaustiveness (make sure you handle every case)

To get a compile-time error when you forget a state, use an `assertNever` helper in the `default` branch:

```ts
function assertNever(x: never): never {
    throw new Error("Unexpected value: " + x);
}

function processStrict(p: PaymentState) {
    switch (p.status) {
        case "initiated":
            return;
        case "processing":
            return;
        case "failed":
            return;
        case "success":
            return;
        default:
            return assertNever(p);
    }
}
```

If you add a new `status` later, TypeScript will force you to update this `switch`.

---

### Quick tips (plain language)

-   Use one clear discriminator property: `status`, `type`, or `kind`.
-   Make each variant list only the fields it guarantees.
-   Prefer `switch` + `assertNever` for safety.
-   Avoid optional fields for different variants. Use distinct variant types instead.
-   Use `as const` when you create literal objects so the `status` stays a literal type.

---

### When to use discriminated unions

-   State machines (loading/success/error flows).
-   AST nodes or message types with different payloads.
-   When different states require different data and you want compile-time checks.

If you want, I can:

-   add a small runnable `.ts` example showing a compile-time error when a case is missing,
-   or add a short unit test demonstrating exhaustiveness.

File: `d:\\web dev cohort 25\\03-Phase\\typescript\\ts-discriminated-unions.md`
