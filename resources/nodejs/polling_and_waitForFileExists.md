# 🧾 PDF Upload Flow with Polling and Queue (BullMQ)

## 📌 Overview

This guide explains the architecture and logic for processing PDF uploads using:

- **Express** (Node.js)
- **BullMQ** (Redis-based job queue)
- **Cloudinary** (PDF storage)
- **PDFLoader** (to extract content)
- **Polling strategy** (to handle race conditions)

---

## ⚙️ Flow Summary

1. **User uploads PDF** → via `upload.array()` in Express.
2. **PDF is added to BullMQ queue** → using `uploadPdfQueue.add()`.
3. **Worker picks up the job** and waits for the PDF to become available (polling).
4. **Once file exists**, it's loaded using `PDFLoader`.
5. **PDF content is extracted and saved/processed**.

---

## 🧪 Why Polling?

Cloud storage (like Cloudinary) might delay **actual file availability** even after upload completes.

### ❌ Problem (Race Condition):

Loader tries to read the file before it's fully available, resulting in:

### ✅ Solution: Polling with `waitForFileExists()`

Waits until file becomes available before loading it.

---

## 🧠 What is Polling?

Polling is a technique where you repeatedly check a condition (like whether a file exists), usually at set time intervals, until it succeeds or times out.

---

https://docs.bullmq.io/guide/workers

## 🛠 `waitForFileExists()` Function

```js
import fs from "fs/promises";

export async function waitForFileExists(path, timeout = 10000, interval = 500) {
    {
        const startTime = Date.now();

        while (true) {
            {
                try {
                    {
                        await fs.access(path);
                        return true; // ✅ File is accessible
                    }
                } catch (err) {
                    {
                        if (Date.now() - startTime > timeout) {
                            {
                                throw new Error(
                                    "File not found within timeout",
                                );
                            }
                        }
                        await new Promise((resolve) =>
                            setTimeout(resolve, interval),
                        );
                    }
                }
            }
        }
    }
}
```

### 💡 Why it works:

- Prevents the loader from trying too early.
- Waits and retries for a max of 10 seconds.
- Handles **eventual consistency** problems with cloud storage.

---

## ✅ Does This Solve Race Conditions?

Yes. It eliminates the timing issue between file upload completion and actual availability by introducing a **safe delay mechanism**.

---

## ✅ Best Practices

- Always use `try-catch` around polling.
- Keep timeout realistic (e.g., 10s).
- If using in a worker (BullMQ), you can retry the job on failure.

---
