# libuv — In‑Depth Guide

libuv is a **multi-platform support library** focused on asynchronous I/O.  
It provides the underlying event loop and threadpool used by **Node.js**, but is also used in other systems.

---

## 1) What is libuv?
- A C library originally developed for Node.js, now standalone.
- Provides:
  - **Event loop** (reactor pattern)
  - **Asynchronous file and network I/O**
  - **Thread pool** for CPU-bound or blocking tasks
  - **Timers**
  - **Asynchronous DNS resolution**
  - **Signals, child processes, pipes, TTY, UDP, TCP, etc.**

It abstracts away platform differences:
- On Unix → uses `epoll` (Linux), `kqueue` (BSD), `event ports` (Solaris), etc.
- On Windows → uses IOCP (I/O Completion Ports).

So Node.js developers get a **unified API** without worrying about OS-level differences.

---

## 2) Event Loop in libuv

The **event loop** is the heart of libuv.

Phases (simplified):
1. **Timers** → executes callbacks scheduled by `uv_timer_start()` / JS `setTimeout`, `setInterval`.
2. **Pending Callbacks** → I/O callbacks deferred from previous loop iteration.
3. **Idle & Prepare** → internal use (Node’s internal bookkeeping).
4. **Poll** → waits for new I/O events (network, file, etc.).
5. **Check** → callbacks from `setImmediate` in Node.js.
6. **Close callbacks** → cleanup for handles like sockets.

Diagram:

```
┌───────────────────────────────┐
│           timers              │
├───────────────────────────────┤
│     pending callbacks         │
├───────────────────────────────┤
│       idle, prepare           │
├───────────────────────────────┤
│            poll               │
├───────────────────────────────┤
│           check               │
├───────────────────────────────┤
│      close callbacks          │
└───────────────────────────────┘
```

---

## 3) Threadpool in libuv

Some operations can’t be done in a non-blocking way by the OS:
- File system calls (read/write, stat, etc.)
- DNS lookups (without c-ares)
- User-defined `uv_queue_work` tasks

libuv uses a **threadpool** (default 4 threads) to offload these.  
The worker thread performs the blocking call, then schedules a callback in the event loop.

### Example (conceptual in Node.js)
```js
const fs = require('fs');

// Internally uses libuv threadpool
fs.readFile('./big.txt', (err, data) => {
  console.log("done reading");
});
```

- JS → Node API → C++ binding → libuv → threadpool → when finished → callback in event loop.

You can adjust pool size via:
```bash
UV_THREADPOOL_SIZE=8 node app.js
```

---

## 4) Handles and Requests

libuv provides two main abstractions:

- **Handles** → long-lived objects tied to resources (TCP sockets, timers, etc.).  
  Examples: `uv_tcp_t`, `uv_timer_t`.

- **Requests** → short-lived, represent an operation (read, write, DNS request).  
  Examples: `uv_write_t`, `uv_fs_t`.

This separation makes resource management explicit.

---

## 5) File and Network I/O

- **TCP/UDP**: `uv_tcp_t`, `uv_udp_t`
- **Pipes & TTYs**: inter-process communication
- **File system**: async FS APIs (`uv_fs_read`, `uv_fs_write`) internally use threadpool
- **DNS**: async lookup via c-ares or threadpool fallback

---

## 6) Timers

libuv timers integrate tightly into the loop:
```c
uv_timer_t timer;
uv_timer_init(loop, &timer);
uv_timer_start(&timer, callback, timeout_ms, repeat_ms);
```

In Node.js, this powers `setTimeout`, `setInterval`.

---

## 7) libuv and Node.js Integration

Node.js runtime =  
- **V8** → executes JS  
- **libuv** → event loop, async I/O, threadpool  
- **C++ bindings** → glue between JS and libuv

Flow:
```
JS → Node API → C++ binding → libuv (loop, threadpool, I/O)
                                 ↓
                           Callback → JS
```

---

## 8) Example in C with libuv

```c
#include <uv.h>
#include <stdio.h>

void on_timeout(uv_timer_t* handle) {
    printf("Timer fired!\n");
    uv_stop(handle->loop);
}

int main() {
    uv_loop_t *loop = uv_default_loop();

    uv_timer_t timer;
    uv_timer_init(loop, &timer);
    uv_timer_start(&timer, on_timeout, 1000, 0);

    printf("Running loop...\n");
    uv_run(loop, UV_RUN_DEFAULT);
    uv_loop_close(loop);
    return 0;
}
```

Output:
```
Running loop...
Timer fired!
```

---

## 9) Why is libuv important?

- **Cross-platform abstraction** → same code runs on Windows, Linux, macOS.
- **Non-blocking model** → high concurrency with small resources (async I/O).
- **Foundation of Node.js** → all async APIs depend on it.

Without libuv, Node.js couldn’t offer its event-driven, non-blocking I/O model.

---

## 10) Key Takeaways

- libuv = portable async I/O library.
- Core pieces:
  - Event loop (epoll, kqueue, IOCP…)
  - Threadpool (blocking ops → async)
  - Handles & Requests (abstractions)
  - Timers, Signals, Processes, FS, Networking.
- Node.js builds on top of libuv + V8.

---

## 11) Further Reading

- [libuv official docs](https://docs.libuv.org/en/v1.x/)
- [libuv design overview](https://nikhilm.github.io/uvbook/introduction.html)
- Source: [https://github.com/libuv/libuv](https://github.com/libuv/libuv)

---

*Happy exploring the Node.js engine room!*
