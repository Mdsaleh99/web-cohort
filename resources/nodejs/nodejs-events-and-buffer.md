# Node.js Events & Buffer — In‑Depth Guide

This guide gives you a deep, practical understanding of **Node.js Events** (via `EventEmitter`) and **Buffer** (binary data). It’s packed with examples, best practices, and common pitfalls.

---

## 1) Events in Node.js

### 1.1 What is an EventEmitter?
- The `events` module exposes the **EventEmitter** class.
- It implements the **publish–subscribe** pattern.
- Emitting an event is **synchronous**: all listeners run **immediately** in the same tick (unless you defer them yourself).

```js
const { EventEmitter } = require('events');
const bus = new EventEmitter();

bus.on('greet', (name) => {
  console.log(`Hi ${name}`);
});

bus.emit('greet', 'Saleh'); // logs synchronously
```

**Key point:** `emit()` calls listeners synchronously and returns a boolean indicating if the event had listeners.

```js
const hadListeners = bus.emit('greet', 'Saleh'); // true/false
```

---

### 1.2 Registering, removing, and inspecting listeners
```js
const { EventEmitter } = require('events');
const emitter = new EventEmitter();

function onMsg(payload) {
  console.log('message:', payload);
}

emitter.on('message', onMsg);        // add
emitter.once('message', console.log); // one-time listener

console.log(emitter.listenerCount('message')); // 2
console.log(emitter.eventNames());            // ['message']

emitter.emit('message', 'hello');
emitter.emit('message', 'again');

emitter.off('message', onMsg);        // remove specific
emitter.removeAllListeners('message'); // remove all for event
```

- **`.on(event, listener)`**: add a listener
- **`.once(event, listener)`**: add a one-shot listener
- **`.off(event, listener)` / `.removeListener`**: remove a specific listener
- **`.removeAllListeners([event])`**: remove all (optionally just for `event`)
- **`.listenerCount(event)`**, **`.eventNames()`**: inspect

> **Tip:** If you see a warning like *“MaxListenersExceededWarning”*, increase via `emitter.setMaxListeners(n)` **or** fix the logic that keeps adding listeners repeatedly.

---

### 1.3 Error handling — the special `error` event
- If an `error` event is emitted and **no** `error` listener is attached, Node.js **throws** and may crash the process.

```js
const { EventEmitter } = require('events');
const bus = new EventEmitter();

// Always do this if your emitter may emit errors:
bus.on('error', (err) => {
  console.error('Caught:', err.message);
});

bus.emit('error', new Error('Boom!')); // handled, process stays alive
```

---

### 1.4 Flow control & asynchronicity
- `emit()` is synchronous. To defer, use `queueMicrotask`, `process.nextTick`, `setImmediate`, or `setTimeout`.
- **Guideline**: use `queueMicrotask`/`process.nextTick` for *microtasks* (run before I/O), and `setImmediate` for *macrotasks* (run after I/O).

```js
bus.on('job', () => {
  process.nextTick(() => console.log('microtask after emit'));
  setImmediate(() => console.log('macrotask after I/O'));
});
bus.emit('job');
console.log('sync end');
```

A likely output order:
```
sync end
microtask after emit
macrotask after I/O
```

---

### 1.5 Meta-events: `newListener` and `removeListener`
```js
emitter.on('newListener', (event, listener) => {
  // called BEFORE the listener is added
  if (event === 'data') {
    // e.g., add a default listener first
  }
});

emitter.on('removeListener', (event, listener) => {
  // after listener removed
});
```

Useful for instrumentation or composing higher-level abstractions.

---

### 1.6 Inheriting/Extending EventEmitter
```js
const { EventEmitter } = require('events');

class Queue extends EventEmitter {
  push(task) {
    this.emit('enqueue', task);
  }
  done(task) {
    this.emit('done', task);
  }
}

const q = new Queue();
q.on('enqueue', (t) => console.log('added:', t));
q.on('done',    (t) => console.log('finished:', t));

q.push({ id: 1 });
q.done({ id: 1 });
```

---

### 1.7 Events + Promises: `events.once`
`events.once(emitter, event)` returns a **Promise** that resolves the next time the event fires (or rejects on `error`).

```js
const { once, EventEmitter } = require('events');
const bus = new EventEmitter();

(async () => {
  setTimeout(() => bus.emit('ready', { ok: true }), 10);
  const [payload] = await once(bus, 'ready');
  console.log(payload.ok); // true
})();
```

---

### 1.8 EventEmitter vs EventTarget
- Node supports **EventTarget** (browser-like) alongside EventEmitter.
- EventTarget uses `addEventListener/removeEventListener` and `dispatchEvent`, with `event.target` etc.
- Prefer EventEmitter for most Node libraries (richer utilities), use EventTarget when interoperating with Web APIs.

---

### 1.9 Streams are EventEmitters
Common events:
- `data`, `end`, `error`, `close` (readable streams)
- `drain`, `finish`, `pipe`, `unpipe` (writable streams)

```js
const fs = require('fs');
const rs = fs.createReadStream('./file.txt', { encoding: 'utf8' });

rs.on('data', chunk => console.log('chunk:', chunk.length));
rs.on('end',  () => console.log('done'));
rs.on('error',err => console.error('read failed', err));
```

> **Backpressure:** For writable streams, wait for `write()` to return `true` or listen for `drain` before writing more.

---

### 1.10 Common pitfalls & best practices
- Always handle `error` if errors may be emitted.
- Avoid adding listeners inside frequently called paths without removing them (memory leaks).
- If you need ordering guarantees, remember listeners run **in the order they were registered**.
- For complex orchestration, consider a small event bus abstraction or an observable library when appropriate.

---

## 2) Buffer in Node.js

### 2.1 What is a Buffer?
- A `Buffer` is a fixed-size chunk of memory for **binary data**.
- In modern Node.js, `Buffer` is a subclass of **`Uint8Array`** backed by an `ArrayBuffer`.
- Used heavily in file I/O, network sockets, crypto, compression, and streaming.

---

### 2.2 Creating Buffers (safe vs unsafe)
```js
// Safe: zero-filled
const a = Buffer.alloc(10);

// Unsafe: fast, but contains old memory (must overwrite before reading)
const b = Buffer.allocUnsafe(10);

// From string (default utf8)
const c = Buffer.from('Hello');
const d = Buffer.from('48656c6c6f', 'hex'); // 'Hello'
const e = Buffer.from('SGVsbG8=', 'base64'); // 'Hello'

// From ArrayBuffer / TypedArray
const ab = new ArrayBuffer(4);
const f = Buffer.from(ab);
```

> **Security tip:** Prefer `Buffer.alloc` unless you immediately write every byte. `allocUnsafe` can expose stale memory if misused.

---

### 2.3 Encoding/decoding
```js
const buf = Buffer.from('नमस्ते', 'utf8');
console.log(buf.toString('utf8'));   // 'नमस्ते'
console.log(buf.toString('hex'));    // hex view
console.log(buf.toString('base64')); // base64 view
```

Supported encodings: `utf8` (default), `utf16le`, `latin1`, `ascii` (7-bit), `hex`, `base64`.

> For robust Unicode streaming decode, consider `util.TextDecoder` or `string_decoder` to avoid multi-byte split issues across chunks.

---

### 2.4 Reading/Writing numeric types (endianness)
```js
const buf = Buffer.alloc(8);
buf.writeUInt32LE(0x11223344, 0); // little-endian
buf.writeUInt32BE(0xAABBCCDD, 4); // big-endian

console.log(buf.readUInt32LE(0).toString(16)); // 11223344
console.log(buf.readUInt32BE(4).toString(16)); // aabbccdd
```

APIs: `read/write{U}Int8/16/32{LE|BE}`, `read/writeBig{U}Int64{LE|BE}`.

---

### 2.5 Slicing, copying, concatenating
```js
const src = Buffer.from('abcdef');

// slice/subarray: zero-copy view (shares memory)
const view = src.slice(2, 5); // 'cde'
view[0] = 0x5a;               // modifies src too!

// copy to a new Buffer
const cloned = Buffer.from(src);

// concat
const combo = Buffer.concat([Buffer.from('Hello '), Buffer.from('World')]);
```

> **Important:** `slice`/`subarray` do **not** copy; they create views. Use `Buffer.from(buf)` to deep copy.

---

### 2.6 Searching & comparing
```js
const b = Buffer.from('Hello World');
console.log(b.includes('World'));        // true
console.log(b.indexOf('lo'));            // 3
console.log(Buffer.compare(b, Buffer.from('Hello')) > 0); // lexicographic
console.log(b.equals(Buffer.from('Hello World')));        // true
```

---

### 2.7 Working with streams (typical pattern)
```js
const fs = require('fs');
const chunks = [];

const rs = fs.createReadStream('./big.bin');
rs.on('data', (c) => chunks.push(c));    // c is a Buffer
rs.on('end',  () => {
  const buf = Buffer.concat(chunks);
  console.log('total bytes:', buf.length);
});
rs.on('error', console.error);
```

> Use `Buffer.concat(chunks, totalLength?)` for efficiency when you know the overall size.

---

### 2.8 Framing binary protocols (length-prefixed example)
```js
// Encode: [4-byte length LE][payload bytes]
function encodeFrame(payloadBuf) {
  const header = Buffer.alloc(4);
  header.writeUInt32LE(payloadBuf.length, 0);
  return Buffer.concat([header, payloadBuf]);
}

// Decode frames from a stream of chunks
function* decodeFrames(streamBuf) {
  let offset = 0;
  while (offset + 4 <= streamBuf.length) {
    const len = streamBuf.readUInt32LE(offset); offset += 4;
    if (offset + len > streamBuf.length) break; // incomplete, wait for more
    yield streamBuf.slice(offset, offset + len);
    offset += len;
  }
}
```

---

### 2.9 Performance tips
- Reuse buffers where possible; avoid frequent small allocations in hot paths.
- Prefer `Buffer.concat` with a precomputed `totalLength` for joining many chunks.
- Avoid `toString()` on massive buffers unless necessary; parse in-place.
- Watch for accidental retention of large buffers (leaks).

---

### 2.10 Safety & limits

---

### 2.11 `Buffer.toString()` with Encodings

The `toString([encoding], [start], [end])` method decodes a Buffer into a string.

- **encoding**: how to interpret the bytes. Default is `utf8`.
- **start, end**: byte offsets (default 0 → buffer.length).

#### Examples

```js
const buf = Buffer.from('Hello World');

console.log(buf.toString());         // 'Hello World' (utf8 default)
console.log(buf.toString('utf8'));   // 'Hello World'
console.log(buf.toString('ascii'));  // 'Hello World' (7‑bit only)
console.log(buf.toString('base64')); // 'SGVsbG8gV29ybGQ='
console.log(buf.toString('hex'));    // '48656c6c6f20576f726c64'
```

#### Partial decoding (slicing via start/end)
```js
const buf = Buffer.from('Hello World');
console.log(buf.toString('utf8', 0, 5));  // 'Hello'
console.log(buf.toString('utf8', 6));     // 'World'
```

#### When to use
- `utf8` → text (default)
- `ascii`/`latin1` → legacy encodings
- `hex` → inspect or transmit binary as hex string
- `base64` → efficient binary ↔ text transport (e.g., JSON, email)
- `utf16le` → for UTF‑16 encoded data

> ⚠️ **Warning:** Using the wrong encoding will produce garbled results. Always match the encoding used when the data was written.

---

- Buffers are fixed-size; trying to write past the end throws.
- Maximum size depends on platform (internally bound by V8’s limits). Very large buffers (hundreds of MB/GB) can cause GC pressure and crashes.
- Validate lengths from untrusted input to prevent DoS (e.g., maliciously huge length headers).

---

## 3) Events + Buffer together (real-world example)
A simple TCP echo server that handles backpressure and binary chunks:

```js
const net = require('net');

const server = net.createServer((socket) => {
  socket.on('data', (chunk) => {
    // chunk is a Buffer
    const ok = socket.write(chunk);
    if (!ok) {
      // Kernel buffer full; wait for 'drain'
      socket.once('drain', () => console.log('resumed'));
    }
  });

  socket.on('error', (err) => console.error('socket error', err));
  socket.on('close',  () => console.log('client disconnected'));
});

server.listen(3000, () => {
  console.log('tcp echo on :3000');
});
```

---

## 4) Testing patterns
- Use `events.once` in tests to await signals deterministically.
- Stub emitters by extending EventEmitter in your module and injecting during tests.
- For buffers, assert on `buf.equals(expected)` or compare encodings (`buf.toString('hex')`).

---

## 5) TypeScript niceties (typed events)
```ts
import { EventEmitter } from 'events';

type Events = {
  message: (text: string) => void;
  error: (err: Error) => void;
};

class TypedBus extends EventEmitter {
  on<T extends keyof Events>(event: T, listener: Events[T]) { return super.on(event, listener); }
  once<T extends keyof Events>(event: T, listener: Events[T]) { return super.once(event, listener); }
  off<T extends keyof Events>(event: T, listener: Events[T]) { return super.off(event, listener); }
  emit<T extends keyof Events>(event: T, ...args: Parameters<Events[T]>) { return super.emit(event, ...args as any); }
}
```

---

## 6) Quick cheat sheet

### EventEmitter
- `on`, `once`, `off/removeListener`, `removeAllListeners`
- `emit` is **sync**; handle `error`!
- `setMaxListeners(n)` to tune warnings
- `events.once(emitter, 'evt')` → Promise

### Buffer
- `alloc` (safe), `allocUnsafe` (fast/unsafe)
- Encode/Decode: `utf8`, `hex`, `base64`, `utf16le`, `latin1`
- Numeric IO: `read/write{U}Int(8|16|32)LE/BE`, `Big{U}Int64`*
- Zero‑copy views: `slice/subarray`; deep copy with `Buffer.from(buf)`
- Concatenate with `Buffer.concat([...], totalLength?)`

---

## 7) Further ideas to practice
- Implement a **message bus** with priorities using EventEmitter.
- Parse a **custom binary protocol** with a streaming decoder.
- Build a file **splitter/joiner** that works on Buffers efficiently.

---

*Happy hacking!*
