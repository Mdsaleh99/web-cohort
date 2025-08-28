# BullMQ — Zero to Hero (2025 Edition)

> For **Champion** 💪 — complete, production-minded guide with **ESM-only** Node examples that fit a MERN stack. Bullet points, clean code, and real-world patterns.

---

## Table of Contents

1. [What is BullMQ?](#what-is-bullmq)
2. [Install & Setup](#install--setup)
3. [Core Concepts & Architecture](#core-concepts--architecture)
4. [Quickstart (Producer + Worker)](#quickstart-producer--worker)
5. [Queues & Job Options](#queues--job-options)
6. [Delays, Retries, Backoff, Priorities, LIFO](#delays-retries-backoff-priorities-lifo)
7. [Scheduling (Job Schedulers — 2025 way)](#scheduling-job-schedulers--2025-way)
8. [Events & Observability](#events--observability)
9. [Concurrency & Scaling](#concurrency--scaling)
10. [Sandboxed Processors (CPU-heavy work)](#sandboxed-processors-cpu-heavy-work)
11. [Rate Limiting](#rate-limiting)
12. [Flows (Parent/Child Pipelines)](#flows-parentchild-pipelines)
13. [State Management & Admin Ops](#state-management--admin-ops)
14. [Graceful Shutdown & Resilience](#graceful-shutdown--resilience)
15. [Integration Patterns (MERN)](#integration-patterns-mern)
16. [Docker Compose (Redis + Workers)](#docker-compose-redis--workers)
17. [Troubleshooting & Pitfalls](#troubleshooting--pitfalls)
18. [Cheat Sheet](#cheat-sheet)
19. [References](#references)

---

## What is BullMQ?

- A **Redis-backed** job queue for Node.js — background jobs, async workflows, scheduling, and message-passing.
- Successor to **Bull**; more modular and robust. Uses Lua scripts + atomic operations on Redis for consistency.
- Fits **MERN** perfectly for: email & SMS, image/video processing, webhooks, payment webhooks, data imports, analytics, AI jobs.

---

## Install & Setup

```bash
# ESM project
npm i bullmq redis
```

**package.json**
```json
{
  "type": "module",
  "dependencies": {
    "bullmq": "^5.58.0",
    "redis": "^4.6.14"
  }
}
```

**Redis**: use local Redis/Redis Stack for dev; set `maxmemory-policy allkeys-lru` in dev to avoid OOM while testing.

Env you’ll use:
```bash
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

Connection config (shared):
```js
// src/queues/connection.js
export const connection = {
  host: process.env.REDIS_HOST ?? "127.0.0.1",
  port: Number(process.env.REDIS_PORT ?? 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  // Retry strategy example (exponential backoff, 1s..20s)
  retryStrategy: (times) => Math.max(Math.min(Math.exp(times), 20000), 1000),
};
```

---

## Core Concepts & Architecture

- **Queue**: where you add jobs.
- **Worker**: consumes jobs; returns success/fail.
- **Job**: name + data + options (attempts, backoff, delay, priority, etc.).
- **States**: `waiting`, `delayed`, `active`, `completed`, `failed`, `paused`, `stalled`.
- **Events**: `waiting`, `active`, `completed`, `failed`, `progress`, `drained`, etc.
- **Flows**: DAG-like trees of jobs (parent waits until all children finish).
- **No QueueScheduler (modern BullMQ)**: stalled handling & delays are automatic in v2+.

---

## Quickstart (Producer + Worker)

**1) Make a queue and add a job (producer)**

```js
// src/queues/email.queue.js
import { Queue } from "bullmq";
import { connection } from "./connection.js";

export const emailQueue = new Queue("email", { connection });

// simple job adder
export async function enqueueWelcomeEmail({ userId, to }) {
  return emailQueue.add("welcome", { userId, to }, {
    removeOnComplete: 1000,         // auto-clean up
    removeOnFail: 1000,
    attempts: 5,                    // retry up to 5
    backoff: { type: "exponential", delay: 1000 }, // 1s,2s,4s,...
  });
}
```

**2) Create a worker (consumer)**

```js
// src/workers/email.worker.js
import { Worker } from "bullmq";
import { connection } from "../queues/connection.js";

export const emailWorker = new Worker(
  "email",
  async (job) => {
    if (job.name === "welcome") {
      // your email logic here
      console.log("Sending welcome email to:", job.data.to);
      // simulate IO
      await new Promise(r => setTimeout(r, 200));
      return { sent: true };
    }
  },
  { connection, concurrency: 10 }   // run up to 10 jobs in parallel
);
```

**3) Boot**

```js
// src/index.js
import { enqueueWelcomeEmail } from "./queues/email.queue.js";
import "./workers/email.worker.js"; // keep the worker alive

await enqueueWelcomeEmail({ userId: "u_1", to: "c@example.com" });
console.log("Job enqueued!");
```

---

## Queues & Job Options

Common options when `.add(name, data, opts)`:

- `attempts`: max retries on failure.
- `backoff`: `{ type: "fixed"|"exponential"|string, delay: ms, jitter?: ms }`.
- `delay`: schedule once (ms in the future).
- `priority`: **1..2,097,152** (1 = highest).
- `lifo`: true (add to right instead of left).
- `removeOnComplete` / `removeOnFail`: `true|false|number|{ age, count }`.
- `jobId`: deterministic IDs (dedupe). If same ID exists → job is skipped.
- `sizeLimit`: cap payload size (bytes).
- `rateLimiterKey`: per-job limiter key if queue-level limiter enabled.

Set **default job options** on the queue:

```js
new Queue("email", {
  connection,
  defaultJobOptions: {
    removeOnComplete: { age: 60 * 60, count: 1000 }, // 1h or 1k jobs
    removeOnFail: 1000,
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
  },
});
```

---

## Delays, Retries, Backoff, Priorities, LIFO

- **Delay**: run later once (`delay: 60000` → 1 min).
- **Retry**: auto when worker throws; retry count = `attempts`.
- **Backoff**:
  - `fixed`: constant ms between tries.
  - `exponential`: grows by attempt (1s, 2s, 4s…).
  - **Custom**: register a custom backoff strategy by name if you need special behavior.
- **Priority**: smaller number = higher priority. Use sparingly (extra CPU).
- **LIFO**: `lifo: true` processes recent jobs first.

Example with most knobs:
```js
await emailQueue.add("digest", { to: "c@example.com" }, {
  delay: 5_000,
  attempts: 7,
  backoff: { type: "fixed", delay: 10_000 },
  priority: 10,
  lifo: false,
  removeOnComplete: true,
});
```

---

## Scheduling (Job Schedulers — 2025 way)

Repeatable jobs evolved. **Use Job Schedulers** instead of legacy `repeat`:

```js
// src/schedulers/report.scheduler.js
import { Queue } from "bullmq";
import { connection } from "../queues/connection.js";

const reportQueue = new Queue("reports", { connection });

// every 1 minute
await reportQueue.upsertJobScheduler("sales-report-minutely", { every: 60_000 });

// cron example: every day at 09:15 IST
await reportQueue.upsertJobScheduler("sales-report-daily", { cron: "15 9 * * *" });

// remove a scheduler
// await reportQueue.removeJobScheduler("sales-report-daily");
```

Workers just process jobs as they arrive — no special worker code required.

> Legacy `repeat: { every|cron }` still exists but is being phased out in favor of schedulers.

---

## Events & Observability

**Listen to queue/worker events:**

```js
// src/queues/email.events.js
import { QueueEvents } from "bullmq";
import { connection } from "./connection.js";

const events = new QueueEvents("email", { connection });
events.on("completed", ({ jobId }) => console.log("✅ completed:", jobId));
events.on("failed", ({ jobId, failedReason }) => console.log("❌ failed:", jobId, failedReason));
events.on("progress", ({ jobId, data }) => console.log("📈 progress:", jobId, data));
events.on("drained", () => console.log("Queue drained"));
```

**Expose health endpoint**: count waiting/active/failed and alert in your dashboard.

```js
import express from "express";
import { Queue } from "bullmq";
import { connection } from "./connection.js";

const app = express();
const q = new Queue("email", { connection });

app.get("/health/queues/email", async (_, res) => {
  const counts = await q.getJobCounts("waiting","active","completed","failed","delayed","paused");
  res.json(counts);
});

app.listen(4000);
```

**Dashboards**: Bull Board works with BullMQ; or build a minimal page using the counts + events above.

---

## Concurrency & Scaling

- **Worker `concurrency`**: parallelism in a single process (default 1). IO-heavy jobs benefit most.
- **Horizontal scale**: run **multiple worker processes** (K8s/PM2/Docker) — BullMQ coordinates via Redis.
- **Global throughput** = `sum(concurrency per worker across instances)`.
- **Hot CPU tasks**: prefer **sandboxed processors** (see next) to avoid stalled jobs.
- **Pausing**: `await queue.pause()` / `queue.resume()` to gate ingestion.

---

## Sandboxed Processors (CPU-heavy work)

Run the processor in a **separate Node process** to isolate crashes and avoid blocking the event loop.

**1) Worker that points to a file (sandbox):**
```js
// src/workers/image.worker.js
import { Worker } from "bullmq";
import { pathToFileURL } from "url";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { connection } from "../queues/connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const processorFile = pathToFileURL(join(__dirname, "./image.processor.js")).href;

export const imageWorker = new Worker("image", processorFile, {
  connection,
  concurrency: 4, // per process
});
```

**2) Actual processor file (executed in child process):**
```js
// src/workers/image.processor.js
export default async function (job) {
  // heavy sync/CPU work ok here (FFmpeg, sharp, etc.)
  for (let i = 0; i <= 100; i += 10) {
    await new Promise(r => setTimeout(r, 50));
    await job.updateProgress(i);
  }
  return { ok: true, id: job.id };
}
```

---

## Rate Limiting

Configure at **queue level** so workers never exceed a rate:

```js
import { Queue } from "bullmq";
import { connection } from "./connection.js";

export const apiQueue = new Queue("external-api", {
  connection,
  limiter: {
    max: 100,           // max jobs
    duration: 60_000,   // per minute
  },
});
```

- Add per-job **`rateLimiterKey`** to bucket by a key (e.g., customer ID) if you implement custom bucketing logic.
- **Note**: legacy **group-based rate limits** were removed from OSS BullMQ; they’re available in **BullMQ Pro**. For OSS, simulate groups by sharding queues or encoding your own limiter logic in Redis.

---

## Flows (Parent/Child Pipelines)

Use **FlowProducer** to build DAGs — parent waits until all children succeed.

```js
// src/flows/resize.flow.js
import { FlowProducer } from "bullmq";
import { connection } from "../queues/connection.js";

const flow = new FlowProducer({ connection });

await flow.add({
  name: "process-image",
  queueName: "image",
  data: { fileId: "f_123" },
  children: [
    { name: "resize:sm", queueName: "image", data: { size: 256 } },
    { name: "resize:md", queueName: "image", data: { size: 512 } },
    { name: "resize:lg", queueName: "image", data: { size: 1024 } },
  ],
});
```

**Options to know:** fail parent on child failure, continue parent on failures, etc. (tune per your workflow semantics).

---

## State Management & Admin Ops

Useful admin APIs on `Queue`:

```js
await queue.count();                                  // total jobs
await queue.getJobCounts();                           // by state
await queue.getJobs(["waiting","active"], 0, 50);     // pagination
await queue.clean(60_000, 1000, "completed");         // clean older than 60s
await queue.drain(true);                              // purge waiting (+delayed)
```

Per-job:
```js
const job = await queue.getJob(jobId);
await job.retry();            // requeue failed
await job.remove();           // remove (not active)
await job.progress(42);       // set progress from worker
const logs = await job.getLogs();
```

---

## Graceful Shutdown & Resilience

- Trap `SIGINT`/`SIGTERM` and **close workers first** (waits for active jobs), then close queues.
- Keep retry/backoff reasonable so bad jobs don’t thrash Redis.
- Use **removeOnComplete/Fail** to avoid Redis bloat.

```js
// src/utils/shutdown.js
export function setupGraceful(workerOrArray, queues = []) {
  const list = Array.isArray(workerOrArray) ? workerOrArray : [workerOrArray];
  const closeAll = async () => {
    for (const w of list) await w.close();
    for (const q of queues) await q.close();
    process.exit(0);
  };
  process.on("SIGINT", closeAll);
  process.on("SIGTERM", closeAll);
}
```

---

## Integration Patterns (MERN)

### 1) HTTP Producer + Worker (same repo)

```js
// src/server.js
import express from "express";
import { Queue } from "bullmq";
import { connection } from "./queues/connection.js";
import "./workers/email.worker.js";

const app = express();
app.use(express.json());
const q = new Queue("email", { connection });

app.post("/api/send-welcome", async (req, res) => {
  const { to, userId } = req.body;
  const job = await q.add("welcome", { to, userId }, {
    jobId: `welcome:${userId}`,        // dedupe per user
    removeOnComplete: true,
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
  });
  res.json({ jobId: job.id });
});

app.get("/api/jobs/:id", async (req, res) => {
  const job = await q.getJob(req.params.id);
  if (!job) return res.status(404).json({ message: "not found" });
  res.json({ id: job.id, state: await job.getState(), progress: job.progress, returnvalue: job.returnvalue });
});

app.listen(3001);
```

### 2) Frontend polling

```js
// React: poll job state
const poll = async (id) => {
  const res = await fetch(`/api/jobs/${id}`);
  const j = await res.json();
  // show j.state: waiting|active|completed|failed and progress
};
```

### 3) File processing with sandbox

- Producer uploads to S3 → queue job with file URL.
- Sandbox worker downloads + processes, updates `job.updateProgress(x)`.
- Send WebSocket or push status via polling endpoint → reflect in UI.

### 4) Scheduled reports

- `upsertJobScheduler("daily", { cron: "15 9 * * *" })`
- Worker generates report, stores into DB/S3, emails link.

---

## Docker Compose (Redis + Workers)

```yaml
# docker-compose.yml
version: "3.9"
services:
  redis:
    image: redis:7-alpine
    command: ["redis-server", "--appendonly", "yes", "--appendfsync", "everysec", "--maxmemory", "512mb", "--maxmemory-policy", "allkeys-lru"]
    ports: ["6379:6379"]
    volumes:
      - ./data/redis:/data

  # Worker process (example)
  email-worker:
    build: .
    command: ["node", "src/workers/email.worker.bootstrap.js"]
    env_file: .env
    depends_on: [redis]

  api:
    build: .
    command: ["node", "src/server.js"]
    env_file: .env
    ports: ["3001:3001"]
    depends_on: [redis]
```

`email.worker.bootstrap.js` could just import the worker and keep the process alive:

```js
import "./email.worker.js";
setInterval(() => {}, 1 << 30); // or better: expose a tiny HTTP server
```

---

## Troubleshooting & Pitfalls

- **Stalled jobs**: Happens if process dies, or event loop is blocked too long. Fix by sandboxing CPU tasks and keeping concurrency realistic.
- **Huge queues**: `drain()` on millions of jobs can hammer Redis. Prefer chunked deletes (`clean`) and back-pressure on producers.
- **Priority everywhere**: adds overhead. Use only where needed.
- **Forgot to close connections**: workers/queues keep Node alive → call `close()` on shutdown.
- **Repeatable migration**: migrate to **Job Schedulers** (`upsertJobScheduler/removeJobScheduler`).

---

## Cheat Sheet

- Add job: `queue.add(name, data, opts)`
- Worker: `new Worker(queueName, processor, { concurrency })`
- Progress: `await job.updateProgress(n)`
- Retry strategy: `attempts` + `backoff: { type: "exponential" | "fixed", delay }`
- Delay once: `delay: ms`
- Schedule repeat: `queue.upsertJobScheduler("id", { every|cron })`
- Events: `new QueueEvents(name)` → `completed/failed/progress/drained`
- Counts: `queue.getJobCounts()`
- Clean: `queue.clean(graceMs, limit, state)`
- Purge: `queue.drain(true)`
- Pause/resume: `queue.pause()` / `queue.resume()`
- Graceful shutdown: `await worker.close(); await queue.close();`

---

## References

- **Queues / Worker basics** (BullMQ docs) — priorities, remove-on-complete, etc.
- **QueueScheduler**: deprecated/unused in modern versions.
- **Rate Limiting**: queue-level limiter; group-based rate limits are **Pro** feature now.
- **Job Schedulers**: `upsertJobScheduler`, `removeJobScheduler`, `getJobSchedulers`.
- **Events**: QueueEvents + worker events.
- **Flows**: `FlowProducer` trees/pipelines.
- **Sandboxed processors**: run processor file in its own process.

> Tip: Docs evolve fast. If something behaves oddly, confirm your installed version (`npm ls bullmq`) and check the exact matching docs.

---

### Fin — Shipping Notes

- Keep producers thin; keep processors idempotent (safe to retry).
- Use deterministic `jobId` to dedupe (e.g., `user:${id}:welcome`).
- For multi-tenant apps, **namespace queues** (e.g., `tenantX:email`).

Ship it, Champion. You’ve got this. 🚀
