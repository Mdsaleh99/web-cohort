
# Redis In-Depth Guide

Redis (Remote Dictionary Server) is an open-source, in-memory data structure store used as a database, cache, message broker, and streaming engine. It supports a wide range of data structures and provides high performance with low latency.

---

## 📌 Why Redis?

- **Speed**: Extremely fast due to in-memory storage
- **Data Structures**: Offers strings, lists, sets, hashes, sorted sets, bitmaps, hyperloglogs, and streams
- **Persistence**: Data can be persisted using RDB snapshots or AOF logs
- **Atomic Operations**: Supports atomic commands
- **Pub/Sub**: Enables real-time messaging
- **Scalability**: Supports replication, clustering, and partitioning

---

## 🛠 Installation

### On Ubuntu
```bash
sudo apt update
sudo apt install redis-server
```

### Start Redis
```bash
sudo systemctl start redis
sudo systemctl enable redis
```

### Verify
```bash
redis-cli ping
# Output: PONG
```

---

## ⚙️ Configuration Basics

Redis config file is typically located at `/etc/redis/redis.conf`

- `bind 127.0.0.1` – Redis binds to localhost by default
- `protected-mode yes` – Prevents access from remote machines unless configured
- `port 6379` – Default Redis port
- `requirepass <password>` – Set password for authentication

---

## 📂 Data Types

### 1. Strings
```bash
SET name "Redis"
GET name
```

### 2. Lists
```bash
LPUSH languages Python
RPUSH languages JavaScript
LRANGE languages 0 -1
```

### 3. Sets
```bash
SADD fruits apple banana
SMEMBERS fruits
```

### 4. Hashes
```bash
HSET user:name first "John" last "Doe"
HGETALL user:name
```

### 5. Sorted Sets
```bash
ZADD scores 100 "Alice" 200 "Bob"
ZRANGE scores 0 -1 WITHSCORES
```

### 6. Bitmaps, HyperLogLogs, Streams – Advanced

---

## 🔁 Persistence

- **RDB**: Snapshotting – saves DB at intervals
- **AOF**: Append Only File – logs every write operation

Enable both for durability.

---

## 📡 Pub/Sub

```bash
# Subscriber terminal
SUBSCRIBE news

# Publisher terminal
PUBLISH news "Redis is awesome!"
```

---

## 🧠 Transactions

```bash
MULTI
SET x 1
INCR x
EXEC
```

---

## 🔐 Security Best Practices

- Use `requirepass` for password protection
- Use firewalls to restrict access
- Disable dangerous commands like FLUSHALL in prod

---

## ⚙️ Clustering & Replication

- **Replication**: Use `replicaof` to create replicas
- **Sentinel**: High availability setup
- **Cluster Mode**: Horizontal scaling with sharding

---

## 🔄 Use Cases

- Caching
- Leaderboards
- Real-time analytics
- Message queues
- Session stores
- Rate limiting

---

## 🧪 Useful Commands

```bash
INFO              # Server stats
MONITOR           # Real-time command monitoring
FLUSHALL          # Deletes all data (use carefully!)
KEYS *            # Returns all keys (not for prod)
SCAN              # Iterative key scanning
```

---

## 📚 Resources

- [Redis.io Docs](https://redis.io/docs/)
- [Awesome Redis GitHub](https://github.com/antirez/redis)
- [Redis Cheat Sheet](https://devhints.io/redis)

---

## ✅ Conclusion

Redis is a powerful, versatile, and fast in-memory data store that’s widely used for modern application development. Mastering Redis enables you to build scalable, high-performance systems.
