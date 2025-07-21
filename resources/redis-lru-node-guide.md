# 🧠 Redis LRU Cache in Node.js

This guide explains how to use Redis as an **LRU (Least Recently Used) cache**, where older or less-used keys are evicted automatically to make room for new ones.

---

## 🚀 Goal

If some key-values are not used frequently, Redis should delete them automatically when memory is full, so new keys can be added.

---

## ✅ Use This Policy: `allkeys-lru`

### 🔥 What It Does:
- Evicts **least recently used** keys (regardless of TTL).
- Keeps the cache fresh and memory under limit.

---

## ⚙️ Redis Configuration

### Temporary (Runtime)
```bash
CONFIG SET maxmemory 256mb
CONFIG SET maxmemory-policy allkeys-lru
```

### Permanent (`redis.conf`)
```conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

---

## 📘 Redis Eviction Policy Options

| Policy           | Deletes which keys?                        | Based on?             | Trigger            |
|------------------|--------------------------------------------|------------------------|---------------------|
| `noeviction`     | ❌ No keys deleted                         | —                      | Errors on insert    |
| `allkeys-lru`    | ✅ Any key                                 | Least Recently Used    | On memory limit     |
| `volatile-lru`   | ✅ Only keys with TTL                      | Least Recently Used    | On memory limit     |

---

## 🛠️ Node.js Example with `ioredis`

### 1. Install Redis client:
```bash
npm install ioredis
```

### 2. Sample Code (LRU Simulation)
```js
const Redis = require("ioredis");
const redis = new Redis();

(async () => {
  // Insert 10 keys
  for (let i = 1; i <= 10; i++) {
    await redis.set(`key${i}`, `value${i}`);
  }

  // Access some keys to simulate usage
  await redis.get("key1");
  await redis.get("key2");
  await redis.get("key3");

  // Insert new key to trigger LRU eviction if memory is full
  await redis.set("key11", "value11");

  // Check which keys are still present
  const keys = await redis.keys("*");
  console.log("Keys in Redis:", keys);
})();
```

> 💡 You won’t see eviction unless `maxmemory` is reached. Try setting a low memory limit and running the above code.

---

## 🧪 Check Eviction Metrics

Use this command to view eviction stats:
```bash
INFO memory
```

Look for:
```text
evicted_keys:<number>
```

---

## 📌 Summary

- Use `allkeys-lru` to make Redis behave like a true LRU cache.
- Set a memory cap using `maxmemory`.
- Redis will then evict the least-used keys automatically.

---

Let me know if you want a version using `redis` instead of `ioredis`, or want to simulate exact memory pressure.