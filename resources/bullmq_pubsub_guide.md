
# BullMQ Pub/Sub In-Depth Guide

BullMQ, while primarily a job queue, also supports a **Pub/Sub**-like mechanism using Redis and queue events. It enables real-time feedback about job status and queue activity by leveraging events emitted by `Worker`, `QueueEvents`, and other BullMQ classes.

---

## 🧠 What is Pub/Sub in BullMQ?

- BullMQ doesn't implement traditional Redis Pub/Sub.
- It emits events (internally via Redis Pub/Sub) that clients can subscribe to using `QueueEvents` and `Worker`.

These events notify when jobs are added, completed, failed, stalled, etc.

---

## 🔧 Setup

```bash
npm install bullmq
```

---

## 📦 Creating a Queue and Worker

```js
// producer.js
const { Queue } = require('bullmq');
const queue = new Queue('notifications');

(async () => {
  await queue.add('send-notification', { user: '123', message: 'Hello!' });
})();
```

```js
// worker.js
const { Worker } = require('bullmq');
const worker = new Worker('notifications', async job => {
  console.log('Processing job:', job.name, job.data);
});
```

---

## 📡 Listening to Events (Pub/Sub Mechanism)

```js
// events.js
const { QueueEvents } = require('bullmq');

const queueEvents = new QueueEvents('notifications');

queueEvents.on('completed', ({ jobId }) => {
  console.log(`✅ Job ${jobId} completed`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.log(`❌ Job ${jobId} failed: ${failedReason}`);
});

queueEvents.on('waiting', ({ jobId }) => {
  console.log(`⏳ Job ${jobId} is waiting`);
});
```

> QueueEvents works using Redis Streams under the hood, so it persists and delivers events reliably.

---

## 🧪 Real-World Use Case

### Notifying Frontend on Job Completion

1. Backend creates a job in a queue.
2. Frontend opens a WebSocket connection to the server.
3. Server uses `QueueEvents` to listen for events.
4. When a job completes, server emits message to frontend via WebSocket.

```js
queueEvents.on('completed', ({ jobId }) => {
  io.to(userSocketId).emit('job:completed', { jobId });
});
```

---

## 📋 Available Events

| Event Name     | Description                          |
|---------------|--------------------------------------|
| `waiting`     | Job is waiting in queue              |
| `active`      | Job has started processing           |
| `completed`   | Job finished successfully            |
| `failed`      | Job failed                           |
| `stalled`     | Job got stuck and retried            |
| `progress`    | Job sent progress update             |
| `drained`     | All jobs have been processed         |

---

## 🚨 Important Notes

- `QueueEvents` must be kept alive as long as you want to receive events.
- Use `QueueScheduler` to ensure delayed/repeatable jobs emit events.
- Redis connection is required and must be stable for real-time events.

---

## 🧹 Clean Shutdown

```js
process.on('SIGINT', async () => {
  await queueEvents.close();
  console.log('QueueEvents connection closed.');
  process.exit(0);
});
```

---

## 📚 References

- [BullMQ Events Docs](https://docs.bullmq.io/guide/events)
- [Redis Streams](https://redis.io/docs/data-types/streams/)
- [WebSocket Integration Example](https://github.com/taskforcesh/bullmq#integration)

---

## ✅ Summary

BullMQ’s Pub/Sub-like capabilities using `QueueEvents` allow you to:
- React to job lifecycle events in real-time
- Notify other systems or users
- Build interactive systems that depend on background task outcomes

Perfect for applications like real-time notifications, user progress feedback, and system orchestration.
