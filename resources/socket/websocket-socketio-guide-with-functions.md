# WebSocket & Socket.IO — In-Depth Guide with Functions

This guide covers **WebSocket** and **Socket.IO** from basics to advanced, with a strong focus on **function-level explanations** and usage examples.

---

## 🔹 WebSocket (Native)

WebSocket is a protocol that provides **full-duplex communication** between client and server over a single TCP connection.

### Core Functions & Properties

#### 1. `new WebSocket(url, protocols?)`
- Creates a new WebSocket connection.
- **Parameters:**
  - `url`: The server URL (e.g., `ws://localhost:8080` or `wss://example.com`).
  - `protocols`: Optional subprotocols.

**Example:**
```js
const socket = new WebSocket("ws://localhost:8080");
```

---

#### 2. `socket.send(data)`
- Sends data to the server through the WebSocket connection.
- **Data Types Supported:**
  - `String`
  - `Blob`
  - `ArrayBuffer` / `TypedArray`

**Example:**
```js
socket.send("Hello Server!");
```

---

#### 3. `socket.close(code?, reason?)`
- Closes the connection gracefully.
- **Parameters:**
  - `code`: Status code (default `1000` means "Normal Closure").
  - `reason`: Optional string explanation.

**Example:**
```js
socket.close(1000, "Client closed connection");
```

---

#### 4. Event Handlers
- `socket.onopen`: Triggered when connection is established.
- `socket.onmessage`: Triggered when a message is received.
- `socket.onerror`: Triggered on error.
- `socket.onclose`: Triggered when the connection closes.

**Example:**
```js
socket.onopen = () => console.log("Connected!");
socket.onmessage = (event) => console.log("Message:", event.data);
socket.onerror = (err) => console.error("Error:", err);
socket.onclose = () => console.log("Connection closed");
```

---

## 🔹 Socket.IO (Library)

Socket.IO is built on top of WebSocket and provides **additional features** like auto-reconnection, broadcasting, rooms, and fallback options.

### Core Server Functions

#### 1. `io.on("connection", callback)`
- Listens for new client connections.
- **Example:**
```js
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});
```

---

#### 2. `socket.emit(event, data)`
- Sends a custom event + data to the connected client.

**Example:**
```js
socket.emit("welcome", { message: "Hello Client!" });
```

---

#### 3. `socket.on(event, callback)`
- Listens for a custom event sent by the client.

**Example:**
```js
socket.on("chatMessage", (msg) => {
  console.log("Message from client:", msg);
});
```

---

#### 4. `socket.broadcast.emit(event, data)`
- Sends an event to **all connected clients except the sender**.

**Example:**
```js
socket.broadcast.emit("userJoined", { id: socket.id });
```

---

#### 5. `io.emit(event, data)`
- Sends an event to **all connected clients (including sender)**.

**Example:**
```js
io.emit("announcement", "Server is restarting soon!");
```

---

#### 6. `socket.join(room)`
- Joins the client to a **room** (logical group).

**Example:**
```js
socket.join("room1");
```

---

#### 7. `socket.leave(room)`
- Removes the client from a **room**.

**Example:**
```js
socket.leave("room1");
```

---

#### 8. `io.to(room).emit(event, data)`
- Sends an event to **all clients inside a room**.

**Example:**
```js
io.to("room1").emit("message", "Hello Room 1!");
```

---

#### 9. `socket.disconnect(force?)`
- Disconnects a client manually.
- `force = true` → terminates immediately.

**Example:**
```js
socket.disconnect();
```

---

#### 10. Middleware: `io.use((socket, next) => {})`
- Runs custom logic (like authentication) before allowing connection.

**Example:**
```js
io.use((socket, next) => {
  if (socket.handshake.auth.token === "valid-token") {
    next();
  } else {
    next(new Error("Unauthorized"));
  }
});
```

---

## 🔹 Example Chat App (Combining Functions)

**Server:**
```js
import { Server } from "socket.io";
const io = new Server(3000);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", { user: socket.id, text: msg });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
```

**Client:**
```js
const socket = io("http://localhost:3000");

socket.on("chatMessage", (data) => {
  console.log(`${data.user}: ${data.text}`);
});

socket.emit("chatMessage", "Hello Everyone!");
```

---

# ✅ Summary

- **WebSocket Functions:**
  - `new WebSocket()`, `.send()`, `.close()`, `.onopen`, `.onmessage`, `.onerror`, `.onclose`
- **Socket.IO Functions:**
  - `io.on()`, `socket.on()`, `socket.emit()`, `socket.broadcast.emit()`, `io.emit()`
  - `socket.join()`, `socket.leave()`, `io.to().emit()`, `socket.disconnect()`
  - Middleware with `io.use()`

These functions are the **building blocks** for real-time apps like chats, multiplayer games, live dashboards, etc.
