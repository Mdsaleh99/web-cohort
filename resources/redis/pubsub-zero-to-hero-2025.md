# Pub/Sub — Zero to Hero (2025 Edition)

> For **Champion** 💪 — an end-to-end, practical guide to Publish/Subscribe from basics to advanced. Real-world MERN patterns, ESM-only Node.js, production checklists, and Docker recipes.

---

## Table of Contents

1. [Pub/Sub in One Minute](#pubsub-in-one-minute)  
2. [Why Pub/Sub (and when not to use it)](#why-pubsub-and-when-not-to-use-it)  
3. [Core Concepts & Terminology](#core-concepts--terminology)  
4. [Delivery Semantics](#delivery-semantics) — at-most/at-least/exactly-once, idempotency  
5. [Ordering & Partitioning](#ordering--partitioning)  
6. [Durability, Retention & Replays](#durability-retention--replays)  
7. [Backpressure & Flow Control](#backpressure--flow-control)  
8. [Protocols & Ecosystem](#protocols--ecosystem) — HTTP/SSE, WebSocket, MQTT, AMQP, Kafka, NATS, Redis  
9. [Design Patterns](#design-patterns) — fan-out, request-reply over pub/sub, outbox, saga  
10. [Schema & Compatibility](#schema--compatibility) — JSON vs Avro/Protobuf, versioning rules  
11. [Reliability Toolkit](#reliability-toolkit) — retries, DLQ, dedup, timeouts, circuit breakers  
12. [Security](#security) — TLS/mTLS, ACL, multi-tenant isolation  
13. [Observability](#observability) — logs, metrics, traces, what to alert on  
14. [Capacity Planning](#capacity-planning) — throughput math, partition strategy, message size  
15. [Tech Comparison (Quick Matrix)](#tech-comparison-quick-matrix)  
16. [Node.js (ESM) Code — Ready to Paste](#nodejs-esm-code--ready-to-paste)  
    - [A. Redis Pub/Sub (ephemeral)](#a-redis-pubsub-ephemeral)  
    - [B. Redis Streams (durable, consumer groups)](#b-redis-streams-durable-consumer-groups)  
    - [C. Kafka with KafkaJS](#c-kafka-with-kafkajs)  
    - [D. NATS & JetStream](#d-nats--jetstream)  
    - [E. RabbitMQ (AMQP, topic exchange)](#e-rabbitmq-amqp-topic-exchange)  
    - [F. Web Clients: WebSocket + SSE bridge](#f-web-clients-websocket--sse-bridge)  
    - [G. Outbox Pattern with MongoDB](#g-outbox-pattern-with-mongodb)  
17. [Docker Compose (Dev Kits)](#docker-compose-dev-kits)  
18. [Cheat Sheets](#cheat-sheets)  
19. [Common Pitfalls](#common-pitfalls)  
20. [Prod Checklist](#prod-checklist)  

---

## Pub/Sub in One Minute

- **Publish/Subscribe** decouples **senders (publishers)** from **receivers (subscribers)** using **topics/subjects**.  
- Publishers emit messages to a broker; subscribers get messages for topics they’re interested in.  
- Benefits: **loose coupling**, **horizontal scale**, **fan-out**, **resilience**.  
- Trade-offs: **eventual consistency**, **debug complexity**, **ordering & duplication handling**.

---

## Why Pub/Sub (and when not to use it)

**Use Pub/Sub when:**  
- Multiple services need the **same event** (fan-out).  
- You want **async** workflows: emails, payments, notifications, analytics.  
- You need **decoupling** and **independent deployability**.

**Avoid / reconsider when:**  
- You need strict **synchronous request/response** semantics (use HTTP/gRPC).  
- You require **strong transactionality** across services (consider outbox + saga).  
- Single consumer, trivial workflow → a **work queue** may be simpler.

---

## Core Concepts & Terminology

- **Broker**: server mediating messages (Kafka, NATS, RabbitMQ, Redis).  
- **Topic/Subject/Channel/Stream**: named route for messages.  
- **Partition**: shard of a topic for parallelism & scaling (Kafka).  
- **Consumer Group**: set of consumers sharing work; each message goes to **one** member (Kafka, Streams CG).  
- **Offset/Sequence/ID**: message position for replay/ack.  
- **Ack/Nack**: positive/negative acknowledgment.  
- **Retention**: how long messages are kept for replay.  
- **Ephemeral vs Durable**: ephemeral drops when offline; durable stores & can replay.

---

## Delivery Semantics

- **At-most-once**: No retries; may lose messages; no duplicates.  
- **At-least-once**: Retries on failure; **may duplicate**; most common; requires **idempotency**.  
- **Exactly-once**: Hard in distributed systems; typically achieved with **transactions + idempotency + dedup** at the app level.  
- **Idempotency recipe**: store **idempotency keys** or last-processed offsets per consumer; ensure handlers are side-effect safe.

---

## Ordering & Partitioning

- **Global ordering** doesn’t scale well. Aim for **per-key (per-partition)** ordering.  
- Choose partition key: e.g., `orderId` to ensure all events for the order hit the same partition.  
- Hot keys → uneven load; mitigate via sharded keys or sticky partitioner with cap.  
- In systems without partitions (e.g., Redis Pub/Sub), ordering is **best-effort**, not guaranteed across consumers.

---

## Durability, Retention & Replays

- **Ephemeral** (Redis Pub/Sub, raw NATS sub): offline consumers miss messages.  
- **Durable** (Kafka, RabbitMQ persistent queues, Redis Streams, NATS JetStream): messages stored until consumed or TTL/retention exceeded.  
- Replays: consumers can **seek by offset** (Kafka), **claim pending** (Streams), or **deliver last N** (JetStream).

---

## Backpressure & Flow Control

- **Pull**-based (Kafka) → consumers control rate via poll size.  
- **Push**-based (RabbitMQ, Pub/Sub) → use prefetch/credits to limit inflight.  
- **Client-side buffering** & **bounded queues** in your app to avoid OOM.  
- Drop, shed, or buffer with TTL if downstream is slow.

---

## Protocols & Ecosystem

- **HTTP/SSE**: server → browser one-way stream; simple, proxies friendly.  
- **WebSocket**: full-duplex; great for real-time UIs.  
- **MQTT**: IoT, low overhead, QoS levels.  
- **AMQP (RabbitMQ)**: routes via exchanges (direct, topic, fanout).  
- **Kafka protocol**: partitions, consumer groups, retention-first design.  
- **NATS**: subjects with wildcards; **JetStream** adds durability.  
- **Redis**: light pub/sub; **Streams** for durability + groups.

---

## Design Patterns

- **Fan-out**: one event → many subscribers (email, analytics).  
- **Request-Reply over Pub/Sub**: include `replyTo` subject + correlation id.  
- **Outbox**: write event to DB outbox **in the same transaction** as state change; async relay publishes from outbox to broker.  
- **Saga**: long-running workflows either **orchestrated** (central brain) or **choreographed** (events drive next steps).  
- **Event-Carried State**: publish enough info to avoid synchronous DB lookups (mind PII).

---

## Schema & Compatibility

- Payloads: **JSON** (simple), **Avro/Protobuf** (binary, schema-first).  
- Versioning:
  - **Additive** fields are safe (forward compatible).  
  - Avoid breaking removals/renames; use defaults.  
  - Include `schemaVersion` in messages.  
- Consider a **schema registry** for strong contracts.

---

## Reliability Toolkit

- **Retries** with **exponential backoff + jitter**.  
- **Dead-Letter Queue (DLQ)** after N failures.  
- **Poison message detection** (repeating failure).  
- **Deduplication** using idempotency keys / hashes.  
- **Timeouts + Circuit Breakers** for downstream calls.  
- **Exactly-once-ish** via (idempotent producer + transactional consumer + dedup store).

---

## Security

- **TLS/mTLS** on broker & clients.  
- **AuthN/Z**: per-topic ACLs, JWT/OAuth for multi-tenant.  
- **Network isolation** (VPC, SGs).  
- **PII/Secrets**: encrypt or avoid publishing; scrub logs.

---

## Observability

- **Logs**: structured; include `messageId`, `topic`, `partition`, `offset`.  
- **Metrics**: publish rate, consume lag, retries, DLQ size, processing latency, handler error rate.  
- **Traces**: propagate **trace/span ids** in headers; OpenTelemetry FTW.  
- **Dashboards**: lag & error-rate SLOs.

---

## Capacity Planning

- **Throughput** = msgSize × msgs/sec × replicas.  
- **Partitions (Kafka)**: start with 3–12; scale with traffic; more partitions → more parallelism **and** overhead.  
- **Message size**: keep small (< 1 MB). Put blobs in object storage; publish URLs.  
- **Retention**: long retention → more disk; plan accordingly.

---

## Tech Comparison (Quick Matrix)

| Feature \ Tech | **Kafka** | **RabbitMQ** | **NATS+JetStream** | **Redis Pub/Sub** | **Redis Streams** | **MQTT** |
|---|---:|---:|---:|---:|---:|---:|
| Durability | ✅ | ✅ | ✅ | ❌ | ✅ | QoS 1/2 |
| Ordering | Per-partition | Queue order | Stream order | Best-effort | Stream order | Topic order |
| Consumer Groups | ✅ | ✅ (prefetch) | ✅ | ❌ | ✅ | ✅ |
| Replay | ✅ | Limited | ✅ | ❌ | ✅ | Limited |
| Scale | Massive | Medium | High | High (ephemeral) | High | IoT |
| Complexity | High | Medium | Low/Med | Low | Low/Med | Low |

---

## Node.js (ESM) Code — Ready to Paste

> All snippets assume `"type": "module"` in `package.json` and modern Node 18+.

### A. Redis Pub/Sub (ephemeral)

```js
// pubsub/redis-basic.js
import { createClient } from "redis";

const pub = createClient();
const sub = createClient();
pub.on("error", console.error);
sub.on("error", console.error);

await Promise.all([pub.connect(), sub.connect()]);

await sub.subscribe("orders.created", (raw) => {
  const msg = JSON.parse(raw);
  console.log("SUB got:", msg);
});

// Publish
await pub.publish("orders.created", JSON.stringify({ id: 123, total: 1519 }));
```

### B. Redis Streams (durable, consumer groups)

```js
// pubsub/redis-streams.js
import { createClient } from "redis";
const r = createClient(); r.on("error", console.error); await r.connect();

// Create consumer group (idempotent)
try { await r.xGroupCreate("orders", "g1", "$", { MKSTREAM: true }); }
catch (e) { if (!String(e.message).includes("BUSYGROUP")) throw e; }

// Producer
await r.xAdd("orders", "*", { ev: "created", id: "o123", total: "1519" });

// Worker (consumer group)
const consumer = `c-${process.pid}`;
while (true) {
  const res = await r.xReadGroup("g1", consumer, [{ key: "orders", id: ">" }], { COUNT: 10, BLOCK: 5000 });
  if (!res) continue;
  for (const stream of res) {
    for (const m of stream.messages) {
      try {
        // handle
        console.log("process", m.id, m.message);
        await r.xAck("orders", "g1", m.id);
      } catch (err) {
        console.error("fail", err);
        // leave unacked -> can be retried or claimed later
      }
    }
  }
}
```

### C. Kafka with KafkaJS

```js
// pubsub/kafka-basic.js
import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({ clientId: "shop", brokers: ["localhost:9092"], logLevel: logLevel.NOTHING });
const producer = kafka.producer({ allowAutoTopicCreation: true, idempotent: true });
const consumer = kafka.consumer({ groupId: "orders-workers" });

await producer.connect();
await consumer.connect();
await consumer.subscribe({ topic: "orders", fromBeginning: false });

// Producer
await producer.send({
  topic: "orders",
  messages: [{ key: "order:o123", value: JSON.stringify({ id: "o123", total: 1519 }) }],
});

// Consumer with retries + DLQ
await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const payload = JSON.parse(message.value.toString());
    try {
      // handle
      console.log("order", payload.id);
    } catch (err) {
      console.error("handler error", err);
      // send to DLQ
      await producer.send({ topic: "orders.DLQ", messages: [{ key: message.key, value: message.value }] });
    }
  },
});
```

### D. NATS & JetStream

```js
// pubsub/nats-basic.js
import { connect, StringCodec } from "nats";
const sc = StringCodec();
const nc = await connect({ servers: "nats://localhost:4222" });

// Pub/Sub (ephemeral)
nc.subscribe("orders.*", { callback: (err, msg) => console.log("got", msg.subject, sc.decode(msg.data)) });
nc.publish("orders.created", sc.encode(JSON.stringify({ id: "o123" })));

// JetStream (durable)
const js = nc.jetstream();
await js.publish("ORDERS.created", sc.encode(JSON.stringify({ id: "o999" })));
const jsm = await nc.jetstreamManager();
try { await jsm.streams.add({ name: "ORDERS", subjects: ["ORDERS.*"] }); } catch {}
const sub = await js.subscribe("ORDERS.created", { durable: "w1", ack_policy: "explicit" });
for await (const m of sub) { console.log("JET", sc.decode(m.data)); m.ack(); }
```

### E. RabbitMQ (AMQP, topic exchange)

```js
// pubsub/rabbitmq-basic.js
import amqp from "amqplib";

const conn = await amqp.connect("amqp://localhost");
const ch = await conn.createChannel();
const ex = "orders-ex"; const q = "orders-q"; const rk = "orders.created";

await ch.assertExchange(ex, "topic", { durable: true });
await ch.assertQueue(q, { durable: true });
await ch.bindQueue(q, ex, "orders.*");

ch.consume(q, (msg) => {
  const data = JSON.parse(msg.content.toString());
  console.log("order", data);
  ch.ack(msg);
});

// publish
ch.publish(ex, rk, Buffer.from(JSON.stringify({ id: "o123" })), { persistent: true });
```

### F. Web Clients: WebSocket + SSE bridge

```js
// pubsub/ws-bridge.js
import express from "express";
import { WebSocketServer } from "ws";
import { createClient } from "redis";

const app = express();
const wss = new WebSocketServer({ noServer: true });
const rsub = createClient(); await rsub.connect();
await rsub.subscribe("orders.created", (raw) => {
  const msg = JSON.parse(raw);
  for (const client of wss.clients) if (client.readyState === 1) client.send(JSON.stringify(msg));
});

const server = app.listen(4000, () => console.log("HTTP on 4000"));
server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req));
});

// SSE endpoint
app.get("/sse/orders", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.flushHeaders();
  const handler = (raw) => res.write(`data: ${raw}\n\n`);
  rsub.pSubscribe("orders.*", handler);
  req.on("close", () => rsub.pUnsubscribe("orders.*", handler));
});
```

**Client (React)**
```jsx
// src/hooks/useOrdersSSE.js
import { useEffect, useState } from "react";
export default function useOrdersSSE() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const es = new EventSource("http://localhost:4000/sse/orders");
    es.onmessage = (e) => setEvents((prev) => [JSON.parse(e.data), ...prev].slice(0, 50));
    return () => es.close();
  }, []);
  return events;
}
```

### G. Outbox Pattern with MongoDB

```js
// pubsub/outbox.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: String, total: Number, status: String,
}, { timestamps: true });

const OutboxSchema = new mongoose.Schema({
  aggregateId: String, type: String, payload: Object, processedAt: Date,
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
const Outbox = mongoose.model("Outbox", OutboxSchema);

export async function createOrderWithOutbox(order) {
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const doc = await Order.create([order], { session });
    await Outbox.create([{
      aggregateId: doc[0]._id.toString(),
      type: "orders.created",
      payload: { id: doc[0]._id, total: doc[0].total }
    }], { session });
  });
  session.endSession();
}

// relay worker
export async function relayOutbox(publish) {
  const batch = await Outbox.find({ processedAt: { $exists: false } }).limit(100).lean();
  for (const evt of batch) {
    await publish(evt.type, evt.payload);
    await Outbox.updateOne({ _id: evt._id }, { $set: { processedAt: new Date() } });
  }
}
```

---

## Docker Compose (Dev Kits)

> Pick what you need. Start Redis for quick tests; use Kafka/NATS for durability/scale.

```yaml
# docker-compose.redis.yml
version: "3.9"
services:
  redis:
    image: redis:7-alpine
    command: ["redis-server", "--appendonly", "yes"]
    ports: ["6379:6379"]
```

```yaml
# docker-compose.nats.yml
version: "3.9"
services:
  nats:
    image: nats:2
    command: ["-js"]
    ports: ["4222:4222", "8222:8222"]
```

```yaml
# docker-compose.kafka.yml (single-broker dev)
version: "3.9"
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:7.6.1
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
  kafka:
    image: confluentinc/cp-kafka:7.6.1
    depends_on: [zookeeper]
    ports: ["9092:9092"]
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

---

## Cheat Sheets

- **Redis**: `SUBSCRIBE topic`, `PUBLISH topic payload`, `XREADGROUP ...`  
- **Kafka**: create topic `kafka-topics --create --topic orders --bootstrap-server localhost:9092 --partitions 6 --replication-factor 1`  
- **NATS**: `nats sub orders.*`, `nats pub orders.created '{...}'`  
- **RabbitMQ**: declare exchange `topic`, bind queue, `basic.publish`.

Key metrics to watch: **consumer lag**, **handler error rate**, **DLQ size**, **end-to-end latency**, **broker CPU/memory**.

---

## Common Pitfalls

- Relying on global ordering; use **per-key** ordering.  
- No idempotency → duplicate side effects.  
- Publishing large blobs in messages.  
- Missing DLQ & backoff → infinite poison loops.  
- Over-trusting “exactly once”; always **design for duplicates**.  
- Forgetting **QueueScheduler** (RabbitMQ prefetch / Streams PEL management / Kafka consumer heartbeats).

---

## Prod Checklist

- [ ] Topics named & partitioned by access patterns.  
- [ ] Delivery semantics decided; idempotency keys stored.  
- [ ] Retry + backoff + DLQ designed & tested.  
- [ ] Schema versioning strategy defined.  
- [ ] TLS/mTLS + broker ACL configured.  
- [ ] Metrics + logs + traces + alerts wired.  
- [ ] Run load & chaos tests (kill workers/broker failover).  
- [ ] Disaster recovery: backups and replay plan.  

---

### Final Pro Tips

- Aim for **at-least-once + idempotency**; it’s the pragmatic sweet spot.  
- Keep messages small and **self-contained enough** to avoid sync fan-out.  
- Use **outbox** to bridge DB transactions to events safely.  
- Expose events to the **browser** via **SSE** or **WebSocket** bridge for real-time UX.  
- Keep going, Champion — with clean events and solid tooling, your MERN apps feel instant. 🚀
