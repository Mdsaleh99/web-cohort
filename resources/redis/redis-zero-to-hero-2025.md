# Redis — Zero to Hero (2025 Edition)

> For Champion 💪 — a full, **copy‑pasteable** crash‑to‑master guide. Snappy bullets, clean code (ESM only), and real‑world MERN recipes. Bookmark this .md and ship faster.

---

## Table of Contents

1. [What is Redis?](#what-is-redis)
2. [Install & Run (Fast)](#install--run-fast)
3. [Key Design + Naming](#key-design--naming)
4. [Core Data Types](#core-data-types)
   - [Strings](#strings)
   - [Hashes](#hashes)
   - [Lists](#lists)
   - [Sets](#sets)
   - [Sorted Sets (ZSET)](#sorted-sets-zset)
   - [Bitmaps](#bitmaps)
   - [HyperLogLog](#hyperloglog)
   - [Geospatial](#geospatial)
   - [Streams](#streams)
5. [TTL & Expiration](#ttl--expiration)
6. [Transactions & Optimistic Locking](#transactions--optimistic-locking)
7. [Pub/Sub & Keyspace Notifications](#pubsub--keyspace-notifications)
8. [Lua Scripting](#lua-scripting)
9. [Persistence (RDB/AOF)](#persistence-rdbaof)
10. [Memory & Eviction Policies](#memory--eviction-policies)
11. [Replication, Sentinel, Cluster](#replication-sentinel-cluster)
12. [Security (ACL, TLS, Protected Mode)](#security-acl-tls-protected-mode)
13. [Performance Patterns & Anti‑Patterns](#performance-patterns--anti-patterns)
14. [Monitoring & Troubleshooting](#monitoring--troubleshooting)
15. [Redis Stack (JSON, Search, Bloom, TS)](#redis-stack-json-search-bloom-ts)
16. [Node.js + Redis (ESM) — Recipes](#nodejs--redis-esm--recipes)
    - [Connect (Single + Cluster)](#connect-single--cluster)
    - [Cache‑Aside with MongoDB + Mongoose](#cache-aside-with-mongodb--mongoose)
    - [Rate Limiting (Token Bucket)](#rate-limiting-token-bucket)
    - [Queues with BullMQ](#queues-with-bullmq)
    - [Distributed Locks (Redlock, caveats)](#distributed-locks-redlock-caveats)
    - [Pub/Sub in Node](#pubsub-in-node)
    - [Using RedisJSON + Search](#using-redisjson--search)
17. [Docker Compose (Local Dev)](#docker-compose-local-dev)
18. [Cheat Sheet](#cheat-sheet)
19. [Common Pitfalls](#common-pitfalls)

---

## What is Redis?

- **In‑memory data structure store**: crazy fast reads/writes (sub‑ms), optional durability to disk.
- **Use‑cases**: caching, sessions, rate‑limiting, queues, leaderboards, pub/sub, real‑time analytics, event logs.
- **Data model**: keys → rich value types (strings, hashes, sets, zsets, streams, …).
- **Scaling**: replication, Sentinel (HA), Cluster (sharding across 16,383 hash slots).

---

## Install & Run (Fast)

### Docker (recommended)

```bash
# Vanilla Redis
docker run -p 6379:6379 --name redis -d redis:7-alpine

# Redis Stack (JSON + Search + more)
docker run -p 6379:6379 -p 8001:8001 --name redis-stack -d redis/redis-stack:7
# RedisInsight UI at http://localhost:8001
```

### macOS
```bash
brew install redis
brew services start redis
redis-cli ping
```

### Ubuntu/Debian
```bash
sudo apt-get update && sudo apt-get install -y redis-server
sudo systemctl enable --now redis-server
redis-cli ping
```

> Tip: For prod, mount a `redis.conf`, set `appendonly yes`, `appendfsync everysec`, and memory limits (see below).

---

## Key Design & Naming

- **Convention**: `app:domain:entity:id:field`  
  Examples: `shop:user:123`, `shop:cart:uid_42`, `shop:product:sku_ABC`.
- **Avoid spaces** in keys; keep them short (RAM matters).
- **Version keys**: `user:123:v2` to avoid hard migrations.
- **Use TTL** for caches & temp artifacts.

---

## Core Data Types

### Strings
Simple values, counters, JSON blobs (if you don’t use RedisJSON).

```bash
SET user:123:name "Champion"
INCR stats:pageviews
MSET a 1 b 2 c 3
GETRANGE big:value 0 99         # substring
SET session:abc "{}" EX 1800 NX  # set with TTL if not exists (30m)
```

### Hashes
Key–field–value maps. Great for “row”-like documents.

```bash
HSET user:123 name "Champion" email "c@ex.com"
HGETALL user:123
HINCRBY user:123 logins 1
HSCAN user:123 0 MATCH * COUNT 100
```

### Lists
Ordered lists (LPUSH/ RPUSH). Use for queues (with caution) or feeds.

```bash
LPUSH feed:global "post:1" "post:2"
LRANGE feed:global 0 9
BLPOP queue:email 0   # blocking pop (worker pattern)
```

### Sets
Unique, unordered. Tags, memberships.

```bash
SADD tag:spices "coriander" "turmeric"
SISMEMBER tag:spices "coriander"
SINTER user:likes:1 user:likes:2
```

### Sorted Sets (ZSET)
Score‑ordered. Leaderboards, ranked feeds, scheduling.

```bash
ZADD lb:score 1519 "Champion"
ZINCRBY lb:score 20 "Champion"
ZREVRANGE lb:score 0 9 WITHSCORES
# Delayed jobs: use timestamp as score
ZADD jobs:delayed 1690000000 "job:123"
```

### Bitmaps
Bit‑level flags. Compact “daily active users”, feature flags.

```bash
SETBIT dau:2025-08-22 123 1   # userId=123 was active today
BITCOUNT dau:2025-08-22
```

### HyperLogLog
Approximate cardinality (unique counts), RAM‑friendly.

```bash
PFADD uniques:today u1 u2 u3
PFCOUNT uniques:*
```

### Geospatial
Store geo points -> radius/box queries.

```bash
GEOADD store:locations 77.5946 12.9716 "BLR" 72.8777 19.0760 "BOM"
GEORADIUS store:locations 77.6 12.97 50 km WITHDIST
```

### Streams
Append‑only log with consumer groups (Kafka‑lite vibes).

```bash
XADD mystream * user 123 event "order.created"
XRANGE mystream - + COUNT 10
XGROUP CREATE mystream g1 $ MKSTREAM
XREADGROUP GROUP g1 c1 COUNT 10 BLOCK 0 STREAMS mystream >
XACK mystream g1 169000-0
XPENDING mystream g1
```

---

## TTL & Expiration

- Set expiry: `EXPIRE key 3600`, or atomically via `SET key val EX 3600 NX`.
- Read without refreshing TTL unless you re‑`SET` with `KEEPTTL` (Redis 6+).
- Use **jittered TTLs** to avoid cache stampede: randomize ±10–20%.

---

## Transactions & Optimistic Locking

- `MULTI ... EXEC`: all queued commands run atomically.
- `WATCH key`: abort if the key changed (optimistic).

```bash
WATCH balance:alice
val=$(redis-cli GET balance:alice)
if [ "$val" -ge 100 ]; then
  MULTI
  DECRBY balance:alice 100
  INCRBY balance:bob 100
  EXEC
else
  UNWATCH
fi
```

> For hot counters, prefer atomic ops (e.g., `INCRBY`) over `WATCH`.

---

## Pub/Sub & Keyspace Notifications

- Fire‑and‑forget events: `PUBLISH channel payload`, `SUBSCRIBE channel`.
- **Keyspace notifications** (`notify-keyspace-events`) emit events on key changes.

```bash
CONFIG SET notify-keyspace-events Ex
PSUBSCRIBE "__keyevent@0__:expired"   # listen to key expirations
```

---

## Lua Scripting

- Embed logic server‑side: atomic, low‑latency.

```bash
# Increment and set TTL atomically
EVAL "local v=redis.call('INCR', KEYS[1]); redis.call('EXPIRE', KEYS[1], ARGV[1]); return v" 1 rate:ip:1 60
```

> Keep scripts **deterministic** and small. Use `EVALSHA` for caching.

---

## Persistence (RDB/AOF)

- **RDB**: periodic snapshots (`BGSAVE`). Small, fast restart. Risk: last few seconds lost.
- **AOF**: append every write. Safer. Modes: `appendfsync always|everysec|no`.
- **Hybrid** (common): RDB + AOF (`everysec`) = performance + safety.
- AOF rewrite: compacts log (`auto-aof-rewrite-percentage`, `auto-aof-rewrite-min-size`).

**redis.conf (prod‑ish snippet):**
```conf
appendonly yes
appendfsync everysec
save 900 1
save 300 10
save 60 10000
```

---

## Memory & Eviction Policies

- Set memory limit: `maxmemory 2gb`
- Choose policy: `noeviction` | `allkeys-lru` | `allkeys-lfu` | `volatile-ttl` etc.
- Use `MEMORY USAGE key`, `MEMORY STATS`, `MEMORY DOCTOR`
- Avoid “big keys” (multi‑MB). Use `--bigkeys` or `SCAN` to find them.

---

## Replication, Sentinel, Cluster

- **Replication**: async replicas (`replicaof`) for reads/failover.
- **Sentinel**: HA monitor + auto failover for a single master topology.
- **Cluster**: shard by hash slots (0..16383), built‑in failover & scaling horizontally.

> Rule of thumb: Start single + replica; add Sentinel for HA; move to Cluster when **one box can’t hold** your working set + traffic.

---

## Security (ACL, TLS, Protected Mode)

- **Protected mode** on by default; **bind** to private interfaces.
- Use **ACLs** not just `requirepass`. Example:

```conf
# redis.conf
user default on >superSecret ~* &* +@all
```

- Enable TLS if exposed beyond private VPC.
- Don’t expose Redis directly to the Internet. Put behind firewall / security group.

---

## Performance Patterns & Anti‑Patterns

**Do:**
- Use **pipelining** / batching.
- Prefer **MGET/MSET** for multiple keys.
- Model related attributes in **HASH** for compactness.
- Add **jittered TTL** to spread expirations.
- Keep values small; compress large blobs (or use RedisJSON with paths).

**Avoid:**
- `KEYS *` in prod (use `SCAN`).
- Huge lists with `LRANGE 0 -1`.
- Unbounded streams without trimming (`XTRIM ~ 1000000`).
- Storing giant files; Redis ≠ object storage.

---

## Monitoring & Troubleshooting

- `INFO`, `SLOWLOG get`, `MONITOR` (careful), `LATENCY DOCTOR`.
- Track: memory, connected clients, ops/sec, hits vs misses, evictions.
- Tools: **RedisInsight** (UI), Prometheus + Grafana (exporter).

---

## Redis Stack (JSON, Search, Bloom, TS)

- **RedisJSON**: store & update JSON by path (`JSON.SET`, `JSON.GET`).
- **RediSearch / Query**: full‑text + secondary indexes (`FT.CREATE`, `FT.SEARCH`).
- **RedisBloom**: Bloom/CF/TopK for probabilistic filters.
- **RedisTimeSeries**: time‑series storage & downsampling.

> If you need document search + filtering → Redis Stack is 🔥 for dashboards & feeds.

---

## Node.js + Redis (ESM) — Recipes

> All code is ESM (package.json `"type": "module"`). Choose `redis` for single instance; `ioredis` or `redis` cluster for sharding.

### Connect (Single + Cluster)

```json
{
  "name": "redis-play",
  "type": "module",
  "dependencies": {
    "redis": "^4.6.14",
    "ioredis": "^5.4.1",
    "bullmq": "^5.7.9",
    "redlock": "^6.1.0",
    "mongoose": "^8.7.0",
    "@redis/json": "^1.0.7",
    "@redis/search": "^1.1.6"
  }
}
```

**Single (node-redis):**
```js
// redisClient.js
import { createClient } from "redis";

export const redis = createClient({
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
  socket: { reconnectStrategy: (retries) => Math.min(retries * 50, 2000) }
});

redis.on("error", (err) => console.error("Redis error:", err));
await redis.connect();
```

**Cluster (ioredis):**
```js
// redisCluster.js
import IORedis from "ioredis";

export const redis = new IORedis.Cluster(
  [
    { host: "127.0.0.1", port: 7000 },
    { host: "127.0.0.1", port: 7001 },
    { host: "127.0.0.1", port: 7002 }
  ],
  { redisOptions: { enableAutoPipelining: true } }
);
```

### Cache‑Aside with MongoDB + Mongoose

```js
// cacheAside.js
import mongoose from "mongoose";
import { redis } from "./redisClient.js";

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);

const keyFor = (id) => `shop:product:${id}`;

export async function getProduct(id) {
  const key = keyFor(id);

  // 1) try cache
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // 2) DB
  const doc = await Product.findById(id).lean();
  if (!doc) return null;

  // 3) populate cache with TTL + jitter
  const ttl = 60 * 5 + Math.floor(Math.random() * 60); // 5–6 min
  await redis.set(key, JSON.stringify(doc), { EX: ttl });
  return doc;
}

export async function updateProduct(id, patch) {
  const doc = await Product.findByIdAndUpdate(id, patch, { new: true }).lean();
  if (doc) {
    await redis.set(keyFor(id), JSON.stringify(doc), { EX: 3600 });
  } else {
    await redis.del(keyFor(id));
  }
  return doc;
}
```

**Stampede guard (mutex‑lite):**
```js
// getOrSetWithLock.js
import { redis } from "./redisClient.js";

export async function getOrSetJSON(key, ttl, fetcher) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const lockKey = `${key}:lock`;
  const gotLock = await redis.set(lockKey, "1", { NX: true, PX: 3000 });
  if (!gotLock) {
    await new Promise(r => setTimeout(r, 50));
    return getOrSetJSON(key, ttl, fetcher);
  }
  try {
    const val = await fetcher();
    await redis.set(key, JSON.stringify(val), { EX: ttl, NX: true });
    return val;
  } finally {
    await redis.del(lockKey);
  }
}
```

### Rate Limiting (Token Bucket)

```js
// rateLimit.js
import { redis } from "./redisClient.js";

/**
 * tokenBucket('rl:ip:1.2.3.4', 100, 60) -> 100 req/min
 */
export async function tokenBucket(key, maxTokens, windowSec) {
  const script = `
local tokens_key = KEYS[1]
local now = tonumber(ARGV[1])
local refill = tonumber(ARGV[2])
local window = tonumber(ARGV[3])
local max = tonumber(ARGV[4])

local bucket = redis.call("HMGET", tokens_key, "tokens", "ts")
local tokens = tonumber(bucket[1]) or max
local ts = tonumber(bucket[2]) or now

local elapsed = math.max(0, now - ts)
local add = (elapsed / window) * refill
tokens = math.min(max, tokens + add)
if tokens < 1 then
  return {0, tokens, ts}
end
tokens = tokens - 1
redis.call("HMSET", tokens_key, "tokens", tokens, "ts", now)
redis.call("EXPIRE", tokens_key, window)
return {1, tokens, now}
`;
  const now = Math.floor(Date.now() / 1000);
  const [ok] = await redis.eval(script, { keys: [key], arguments: [now, maxTokens, windowSec, maxTokens] });
  return ok === 1;
}
```

**Express middleware usage:**
```js
// app.js
import express from "express";
import { tokenBucket } from "./rateLimit.js";

const app = express();
app.use(async (req, res, next) => {
  const key = `rl:ip:${req.ip}`;
  const allowed = await tokenBucket(key, 100, 60);
  if (!allowed) return res.status(429).json({ message: "Too many requests" });
  next();
});
```

### Queues with BullMQ

```js
// queue.js
import { Queue, Worker, QueueScheduler } from "bullmq";

const connection = { connection: { host: "127.0.0.1", port: 6379 } };
export const emailQueue = new Queue("email", connection);
new QueueScheduler("email", connection);

new Worker("email", async (job) => {
  // send email
  console.log("sending email", job.data);
}, connection);

// enqueue
await emailQueue.add("welcome", { to: "c@ex.com" }, { attempts: 3, backoff: { type: "exponential", delay: 2000 } });
```

### Distributed Locks (Redlock, caveats)

> Redlock works best across **multiple independent Redis nodes**. For single instance, it’s just a mutex.

```js
// lock.js
import Redlock from "redlock";
import { redis } from "./redisClient.js";

export const redlock = new Redlock([redis], { retryCount: 5, retryDelay: 100 });

export async function withLock(resource, ttlMs, fn) {
  const lock = await redlock.acquire([resource], ttlMs);
  try {
    return await fn();
  } finally {
    await lock.release();
  }
}
```

### Pub/Sub in Node

```js
// pubsub.js
import { createClient } from "redis";

const pub = createClient(); const sub = createClient();
await Promise.all([pub.connect(), sub.connect()]);

await sub.subscribe("orders", (msg) => {
  const evt = JSON.parse(msg);
  console.log("order event", evt);
});

await pub.publish("orders", JSON.stringify({ type: "order.created", id: 123 }));
```

### Using RedisJSON + Search

```js
// jsonSearch.js
import { createClient } from "redis";
import { json } from "@redis/json";
import { search } from "@redis/search";

const client = createClient().on("error", console.error);
client.extend(json).extend(search);
await client.connect();

await client.json.set("prod:1", "$", { name: "Coriander", price: 1519, tags: ["spice","bestseller"] });

// Create index over JSON docs
await client.ft.create("idx:prod", {
  "$.name": { type: "TEXT", AS: "name" },
  "$.price": { type: "NUMERIC", AS: "price" },
  "$.tags[*]": { type: "TAG", AS: "tags" }
}, { ON: "JSON", PREFIX: ["prod:"] });

// Query
const res = await client.ft.search("idx:prod", '@tags:{spice} @price:[1000 2000]');
console.log(res);
```

---

## Docker Compose (Local Dev)

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

  redisinsight:
    image: redis/redisinsight:latest
    ports: ["8001:8001"]
    depends_on: [redis]
```

---

## Cheat Sheet

- Scan: `SCAN 0 MATCH user:* COUNT 1000`
- TTL: `TTL key`, `EXPIRE key 3600`
- Atomic counter: `INCRBY key 10`
- Multi‑key: `MGET key1 key2 key3`
- Evictions: `CONFIG SET maxmemory 1gb`, `CONFIG SET maxmemory-policy allkeys-lfu`
- Streams trim: `XTRIM mystream MAXLEN ~ 1000000`
- Bigkeys: `redis-cli --bigkeys`
- Slowlog: `SLOWLOG GET 100`

---

## Common Pitfalls

- **Using KEYS in prod** → use `SCAN`.
- No TTL on cache keys → memory bloat + stale data.
- Huge values or giant lists → RAM spikes + slow ops.
- Single point of failure → add replica + Sentinel/Cluster.
- Missing backoff/retries on client → cascading errors under load.
- Treating Redis as **primary DB** without AOF/RDB → data loss risk.

---

### Final Pro Tips

- Start **simple** (single + AOF everysec) → evolve to HA → then cluster when needed.
- **Measure** with SLOWLOG, INFO, and latency tools; guessing is not engineering.
- Wrap common patterns (cache‑aside, rate limits, locks) into tiny utilities so they’re reused across your MERN projects.

Stay dangerous, Champion. You’ve got this. 🚀
