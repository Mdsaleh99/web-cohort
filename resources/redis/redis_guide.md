# Complete Redis Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Basic Concepts](#basic-concepts)
4. [Data Types](#data-types)
5. [Commands](#commands)
6. [Configuration](#configuration)
7. [Persistence](#persistence)
8. [Replication](#replication)
9. [Clustering](#clustering)
10. [Pub/Sub](#pubsub)
11. [Transactions](#transactions)
12. [Lua Scripting](#lua-scripting)
13. [Performance & Optimization](#performance--optimization)
14. [Security](#security)
15. [Monitoring](#monitoring)
16. [Use Cases](#use-cases)
17. [Best Practices](#best-practices)

## Introduction

Redis (Remote Dictionary Server) is an open-source, in-memory data structure store used as a database, cache, and message broker. It supports various data structures such as strings, hashes, lists, sets, sorted sets, bitmaps, hyperloglogs, and geospatial indexes.

### Key Features
- **In-memory storage**: Extremely fast read/write operations
- **Persistence**: Optional data persistence to disk
- **Atomic operations**: All operations are atomic
- **Replication**: Master-slave replication support
- **Clustering**: Automatic partitioning across multiple nodes
- **Pub/Sub**: Message broker capabilities
- **Transactions**: Multi-command transactions
- **Lua scripting**: Server-side scripting support

### Why Use Redis?
- **Performance**: Sub-millisecond response times
- **Scalability**: Horizontal scaling with clustering
- **Flexibility**: Multiple data structures
- **Reliability**: Built-in replication and persistence
- **Simplicity**: Easy to learn and implement

## Installation

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### macOS
```bash
brew install redis
brew services start redis
```

### Windows
```bash
# Using WSL or download from Redis website
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
sudo apt-get update
sudo apt-get install redis
```

### Docker
```bash
docker run --name redis-container -p 6379:6379 -d redis:latest
```

### Verify Installation
```bash
redis-cli ping
# Should return: PONG
```

## Basic Concepts

### Client-Server Architecture
Redis follows a client-server model where:
- **Server**: Redis server process that stores data
- **Client**: Applications that connect to Redis server
- **Protocol**: RESP (Redis Serialization Protocol)

### Key-Value Store
Redis stores data as key-value pairs where:
- **Keys**: Strings that uniquely identify data
- **Values**: Can be various data types (strings, lists, sets, etc.)

### Database Selection
Redis supports multiple databases (0-15 by default):
```bash
SELECT 0  # Select database 0
SELECT 1  # Select database 1
```

## Data Types

### 1. Strings
The most basic data type, can store text, numbers, or binary data.

```bash
SET mykey "Hello World"
GET mykey
INCR counter
DECR counter
APPEND mykey " Redis"
STRLEN mykey
```

**Use Cases**: Caching, counters, session storage

### 2. Hashes
Maps between string fields and string values, perfect for representing objects.

```bash
HSET user:1 name "John" age 30 email "john@example.com"
HGET user:1 name
HGETALL user:1
HMGET user:1 name age
HINCRBY user:1 age 1
HDEL user:1 email
```

**Use Cases**: User profiles, configuration settings, object storage

### 3. Lists
Ordered collections of strings, support push/pop operations.

```bash
LPUSH mylist "world"
LPUSH mylist "hello"
RPUSH mylist "!"
LRANGE mylist 0 -1
LPOP mylist
RPOP mylist
LLEN mylist
```

**Use Cases**: Message queues, activity feeds, recent items

### 4. Sets
Unordered collections of unique strings.

```bash
SADD myset "apple"
SADD myset "banana" "orange"
SMEMBERS myset
SISMEMBER myset "apple"
SCARD myset
SREM myset "banana"
SUNION set1 set2
SINTER set1 set2
```

**Use Cases**: Tags, unique visitors, social networks

### 5. Sorted Sets (ZSets)
Ordered sets where each member has a score.

```bash
ZADD leaderboard 100 "player1"
ZADD leaderboard 200 "player2" 150 "player3"
ZRANGE leaderboard 0 -1 WITHSCORES
ZRANK leaderboard "player1"
ZINCRBY leaderboard 50 "player1"
ZREM leaderboard "player1"
```

**Use Cases**: Leaderboards, priority queues, time-series data

### 6. Bitmaps
String data type with bit operations.

```bash
SETBIT visitors 10 1
GETBIT visitors 10
BITCOUNT visitors
BITOP AND result bitmap1 bitmap2
```

**Use Cases**: Real-time analytics, user activity tracking

### 7. HyperLogLog
Probabilistic data structure for counting unique elements.

```bash
PFADD hll "user1" "user2" "user3"
PFCOUNT hll
PFMERGE merged_hll hll1 hll2
```

**Use Cases**: Unique visitor counting, cardinality estimation

### 8. Geospatial
Store and query geographical data.

```bash
GEOADD locations 13.361389 38.115556 "Palermo"
GEOADD locations 15.087269 37.502669 "Catania"
GEODIST locations "Palermo" "Catania" km
GEORADIUS locations 15 37 100 km WITHCOORD
```

**Use Cases**: Location-based services, nearby searches

## Commands

### Basic Commands
```bash
# Key operations
EXISTS key
DEL key
EXPIRE key seconds
TTL key
TYPE key
KEYS pattern
SCAN cursor

# Server operations
PING
INFO
DBSIZE
FLUSHDB
FLUSHALL
CONFIG GET parameter
CONFIG SET parameter value
```

### String Commands
```bash
SET key value [EX seconds] [PX milliseconds] [NX|XX]
GET key
MSET key1 value1 key2 value2
MGET key1 key2
INCR key
DECR key
INCRBY key increment
DECRBY key decrement
```

### Hash Commands
```bash
HSET key field value
HGET key field
HMSET key field1 value1 field2 value2
HMGET key field1 field2
HGETALL key
HKEYS key
HVALS key
HEXISTS key field
```

### List Commands
```bash
LPUSH key value1 value2
RPUSH key value1 value2
LPOP key
RPOP key
LINDEX key index
LSET key index value
LINSERT key BEFORE|AFTER pivot value
LTRIM key start stop
```

### Set Commands
```bash
SADD key member1 member2
SREM key member1 member2
SMEMBERS key
SCARD key
SISMEMBER key member
SPOP key
SRANDMEMBER key count
```

### Sorted Set Commands
```bash
ZADD key score1 member1 score2 member2
ZREM key member1 member2
ZRANGE key start stop [WITHSCORES]
ZREVRANGE key start stop [WITHSCORES]
ZRANK key member
ZREVRANK key member
ZSCORE key member
```

## Configuration

### Configuration File
Redis configuration is typically stored in `/etc/redis/redis.conf`:

```conf
# Network
bind 127.0.0.1
port 6379
timeout 0

# General
daemonize yes
pidfile /var/run/redis/redis-server.pid
loglevel notice
logfile /var/log/redis/redis-server.log

# Memory
maxmemory 2gb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000
```

### Runtime Configuration
```bash
CONFIG GET "*"
CONFIG SET maxmemory 1gb
CONFIG SET save "900 1 300 10"
CONFIG REWRITE
```

### Memory Management
```bash
# Memory policies
# noeviction: Return error when memory limit reached
# allkeys-lru: Remove least recently used keys
# volatile-lru: Remove least recently used keys with expire set
# allkeys-random: Remove random keys
# volatile-random: Remove random keys with expire set
# volatile-ttl: Remove keys with nearest expire time

CONFIG SET maxmemory-policy allkeys-lru
```

## Persistence

### RDB (Redis Database)
Point-in-time snapshots of your dataset.

```conf
# Save snapshot if at least 1 key changed in 900 seconds
save 900 1
# Save snapshot if at least 10 keys changed in 300 seconds
save 300 10
# Save snapshot if at least 10000 keys changed in 60 seconds
save 60 10000

# RDB file configuration
dbfilename dump.rdb
dir /var/lib/redis/
```

**Manual snapshots:**
```bash
SAVE      # Synchronous save (blocks server)
BGSAVE    # Asynchronous save (non-blocking)
```

### AOF (Append Only File)
Logs every write operation received by the server.

```conf
# Enable AOF
appendonly yes
appendfilename "appendonly.aof"

# Fsync policy
# always: Fsync every write (slow, safest)
# everysec: Fsync every second (recommended)
# no: Never fsync (fastest, least safe)
appendfsync everysec

# AOF rewrite
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

**Manual AOF operations:**
```bash
BGREWRITEAOF  # Rewrite AOF file
```

### Hybrid Persistence
Combines RDB and AOF for optimal performance and durability.

```conf
aof-use-rdb-preamble yes
```

## Replication

### Master-Slave Setup

**Master configuration:**
```conf
# No special configuration needed for master
```

**Slave configuration:**
```conf
slaveof 192.168.1.100 6379
slave-read-only yes
```

**Runtime replication:**
```bash
# On slave
SLAVEOF 192.168.1.100 6379
SLAVEOF NO ONE  # Promote slave to master
```

### Sentinel (High Availability)
Provides automatic failover and monitoring.

**Sentinel configuration:**
```conf
port 26379
sentinel monitor mymaster 192.168.1.100 6379 2
sentinel down-after-milliseconds mymaster 30000
sentinel parallel-syncs mymaster 1
sentinel failover-timeout mymaster 180000
```

**Start Sentinel:**
```bash
redis-sentinel /etc/redis/sentinel.conf
```

## Clustering

### Redis Cluster
Provides automatic sharding and high availability.

**Enable clustering:**
```conf
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 15000
```

**Create cluster:**
```bash
redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 --cluster-replicas 1
```

**Cluster commands:**
```bash
CLUSTER NODES
CLUSTER INFO
CLUSTER SLOTS
CLUSTER KEYSLOT key
```

### Hash Tags
Ensure related keys are stored on the same node:
```bash
SET {user:1000}:profile "John Doe"
SET {user:1000}:posts "post1,post2,post3"
```

## Pub/Sub

### Basic Pub/Sub
```bash
# Subscribe to channels
SUBSCRIBE channel1 channel2
PSUBSCRIBE pattern*

# Publish messages
PUBLISH channel1 "Hello World"

# Unsubscribe
UNSUBSCRIBE channel1
PUNSUBSCRIBE pattern*
```

### Channel Information
```bash
PUBSUB CHANNELS        # List active channels
PUBSUB NUMSUB channel  # Number of subscribers
PUBSUB NUMPAT          # Number of pattern subscriptions
```

### Streams (Redis 5.0+)
More advanced message queuing:
```bash
XADD mystream * name "John" age 30
XRANGE mystream - +
XREAD COUNT 2 STREAMS mystream 0
XGROUP CREATE mystream mygroup $ MKSTREAM
XREADGROUP GROUP mygroup consumer1 STREAMS mystream >
```

## Transactions

### MULTI/EXEC
Execute multiple commands atomically:
```bash
MULTI
SET key1 "value1"
SET key2 "value2"
INCR counter
EXEC
```

### WATCH
Optimistic locking:
```bash
WATCH key1
MULTI
SET key1 "new_value"
EXEC
```

### DISCARD
Cancel transaction:
```bash
MULTI
SET key1 "value1"
DISCARD
```

## Lua Scripting

### Basic Scripting
```bash
EVAL "return redis.call('get', KEYS[1])" 1 mykey
```

### Script Management
```bash
# Load script
SCRIPT LOAD "return redis.call('get', KEYS[1])"

# Execute loaded script
EVALSHA sha1 1 mykey

# Check script existence
SCRIPT EXISTS sha1

# Flush all scripts
SCRIPT FLUSH
```

### Example Scripts
```lua
-- Atomic increment with limit
local current = redis.call('get', KEYS[1])
if current == false then
    current = 0
else
    current = tonumber(current)
end

if current < tonumber(ARGV[1]) then
    return redis.call('incr', KEYS[1])
else
    return current
end
```

## Performance & Optimization

### Memory Optimization
```bash
# Use appropriate data types
# Prefer hashes for objects
# Use sets for unique collections
# Consider sorted sets for ordered data

# Monitor memory usage
INFO memory
MEMORY USAGE key
MEMORY STATS
```

### Connection Pooling
```bash
# Configure connection pools in your application
# Typical pool settings:
# - Initial size: 5-10
# - Maximum size: 50-100
# - Connection timeout: 5-10 seconds
# - Idle timeout: 30-60 seconds
```

### Pipelining
Reduce network round trips:
```bash
# Instead of:
SET key1 value1
SET key2 value2
SET key3 value3

# Use pipelining to send all commands together
```

### Benchmarking
```bash
# Built-in benchmark tool
redis-benchmark -h 127.0.0.1 -p 6379 -n 100000 -c 50

# Specific command benchmarks
redis-benchmark -h 127.0.0.1 -p 6379 -t set,get -n 100000 -q
```

## Security

### Authentication
```conf
requirepass yourpassword
```

```bash
AUTH yourpassword
```

### Command Renaming/Disabling
```conf
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command SHUTDOWN REDIS_SHUTDOWN
```

### Network Security
```conf
bind 127.0.0.1
port 6379
protected-mode yes
```

### SSL/TLS (Redis 6.0+)
```conf
tls-port 6380
tls-cert-file /path/to/redis.crt
tls-key-file /path/to/redis.key
tls-ca-cert-file /path/to/ca.crt
```

## Monitoring

### INFO Command
```bash
INFO server
INFO memory
INFO replication
INFO stats
INFO clients
```

### Monitoring Tools
```bash
# Built-in monitoring
redis-cli --latency
redis-cli --latency-history -i 1
redis-cli --stat

# Monitor commands
MONITOR
```

### Slow Log
```bash
CONFIG SET slowlog-log-slower-than 10000
SLOWLOG GET 10
SLOWLOG RESET
```

### Client Connections
```bash
CLIENT LIST
CLIENT KILL ip:port
CLIENT SETNAME connection_name
```

## Use Cases

### 1. Caching
```bash
# Set cache with expiration
SET cache:user:1 "user_data" EX 3600

# Cache-aside pattern
GET cache:user:1
# If null, fetch from database and set cache
```

### 2. Session Store
```bash
# Store session data
HSET session:abc123 user_id 1 username "john" last_active 1609459200
EXPIRE session:abc123 1800
```

### 3. Real-time Analytics
```bash
# Track page views
INCR page_views:2021-01-01:/home
INCR page_views:2021-01-01:/about

# Track unique visitors
PFADD unique_visitors:2021-01-01 user1 user2 user3
PFCOUNT unique_visitors:2021-01-01
```

### 4. Message Queues
```bash
# Producer
LPUSH job_queue "process_image:image1.jpg"

# Consumer
BRPOP job_queue 0
```

### 5. Leaderboards
```bash
# Update scores
ZADD leaderboard 1500 "player1"
ZADD leaderboard 2000 "player2"

# Get top players
ZREVRANGE leaderboard 0 9 WITHSCORES
```

### 6. Rate Limiting
```bash
# Simple rate limiting
INCR rate_limit:user:1:minute
EXPIRE rate_limit:user:1:minute 60

# Sliding window rate limiting using sorted sets
ZADD rate_limit:user:1 timestamp timestamp
ZREMRANGEBYSCORE rate_limit:user:1 0 (timestamp-window)
```

## Best Practices

### 1. Key Design
- Use consistent naming conventions
- Keep keys short but descriptive
- Use colons for namespacing: `user:1000:profile`
- Avoid special characters in keys

### 2. Data Structure Selection
- Use hashes for objects with multiple fields
- Use sets for unique collections
- Use sorted sets for ordered data with scores
- Use lists for queues and stacks

### 3. Memory Management
- Set appropriate `maxmemory` limit
- Choose suitable eviction policy
- Monitor memory usage regularly
- Use `EXPIRE` for temporary data

### 4. Connection Management
- Use connection pooling
- Implement proper connection retry logic
- Set appropriate timeouts
- Monitor connection count

### 5. Persistence Strategy
- Use RDB for faster restarts
- Use AOF for better durability
- Consider hybrid persistence
- Regular backup testing

### 6. Performance Optimization
- Use pipelining for multiple commands
- Avoid `KEYS` command in production
- Use `SCAN` for iterating keys
- Monitor slow queries

### 7. Security
- Enable authentication
- Use SSL/TLS for network encryption
- Disable/rename dangerous commands
- Implement proper network security

### 8. Monitoring and Alerting
- Monitor memory usage
- Track connection count
- Monitor replication lag
- Set up alerts for critical metrics

### 9. Scaling Strategy
- Plan for horizontal scaling with clustering
- Consider read replicas for read-heavy workloads
- Implement proper sharding strategy
- Monitor cluster health

### 10. Development Guidelines
- Use transactions for atomic operations
- Implement proper error handling
- Use Lua scripts for complex operations
- Test failover scenarios

## Conclusion

Redis is a powerful, versatile tool that can significantly improve application performance and scalability. Understanding its data structures, commands, and configuration options is crucial for effective implementation. Remember to consider persistence, replication, and security requirements based on your specific use case.

The key to successful Redis implementation is understanding your data access patterns, choosing appropriate data structures, and implementing proper monitoring and maintenance procedures. Start with simple use cases and gradually explore advanced features as your requirements grow.

For the most up-to-date information and advanced topics, always refer to the official Redis documentation at https://redis.io/documentation.