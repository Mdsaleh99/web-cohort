# Server-Sent Events (SSE): Basic to Advanced

## What are Server-Sent Events?

Server-Sent Events (SSE) is a standard allowing servers to push real-time updates to clients over a single HTTP connection. Unlike WebSockets (which are bidirectional), SSE is **unidirectional** - data flows only from server to client.

**Key characteristics:**
- Built on HTTP protocol
- Automatic reconnection with configurable retry delays
- Event IDs for tracking missed messages
- Text-based protocol (UTF-8)
- Simple API compared to WebSockets

---

## Basic SSE Implementation

### Client-Side (Browser)

```javascript
// Create EventSource connection
const eventSource = new EventSource('/api/stream');

// Listen for messages
eventSource.onmessage = (event) => {
  console.log('Received:', event.data);
};

// Listen for specific event types
eventSource.addEventListener('customEvent', (event) => {
  console.log('Custom event:', event.data);
});

// Handle errors
eventSource.onerror = (error) => {
  console.error('SSE error:', error);
  // EventSource automatically attempts reconnection
};

// Close connection when done
eventSource.close();
```

### Server-Side (Node.js/Express)

```javascript
app.get('/api/stream', (req, res) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Optional: CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send data every second
  const intervalId = setInterval(() => {
    const data = { time: new Date().toISOString() };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 1000);

  // Cleanup on client disconnect
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});
```

---

## SSE Message Format

SSE messages follow a specific text format:

```
data: This is a simple message\n\n

data: {"user": "john", "message": "hello"}\n\n

event: customEvent\ndata: Custom event data\n\n

id: 123\ndata: Message with ID\n\n

retry: 5000\n\n

data: Line 1\ndata: Line 2\ndata: Line 3\n\n
```

**Field types:**
- `data:` - The message content (can span multiple lines)
- `event:` - Custom event name (default is "message")
- `id:` - Unique identifier for the message
- `retry:` - Reconnection time in milliseconds
- `:` - Comment (ignored by client)

**Important:** Each message must end with **two newlines** (`\n\n`)

---

# 📌 **Short Note: Why SSE Requires `\n\n` When Sending Data**

In **Server-Sent Events (SSE)**, each message must end with a **blank line**, which is represented by **two newline characters: `\n\n`**.

### ✔ **Reason: Message Boundary**

SSE is a **text-based streaming protocol**.
The browser needs a clear way to know:

> **“This event is complete—deliver it to the client now.”**

The rule is:

* Every SSE event ends when the server sends **an empty line**
* An empty line = `\n\n`

Example event:

```
data: Hello\n
\n   ← this blank line signals end of event
```

### ✔ **Without `\n\n`**

If you don’t include the blank line:

* The browser **won’t deliver the event**
* It will keep waiting for more data
  (because it thinks the event is not finished yet)

### ✔ **Summary**

* `\n` ends a line
* `\n\n` ends an entire SSE event
* Browser uses this to **parse and fire the `onmessage` event**

So `\n\n` is required to tell the browser:

👉 **"This chunk/message is complete — send it to JavaScript now."**


---

## Advanced SSE Concepts

### 1. Event IDs and Last-Event-ID

Event IDs enable resuming streams after disconnection:

**Server:**
```javascript
let messageId = 0;

app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Check if client is reconnecting
  const lastEventId = req.headers['last-event-id'];
  if (lastEventId) {
    console.log('Client reconnecting from:', lastEventId);
    // Send missed messages here
  }

  const interval = setInterval(() => {
    messageId++;
    res.write(`id: ${messageId}\n`);
    res.write(`data: Message ${messageId}\n\n`);
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});
```

**Client:**
```javascript
const eventSource = new EventSource('/api/stream');

eventSource.onmessage = (event) => {
  console.log('ID:', event.lastEventId, 'Data:', event.data);
};
```

### 2. Custom Events

Send different types of events on the same stream:

**Server:**
```javascript
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  
  // Regular update
  res.write(`event: update\ndata: {"count": 10}\n\n`);
  
  // Alert event
  res.write(`event: alert\ndata: {"message": "Warning!"}\n\n`);
  
  // Status event
  res.write(`event: status\ndata: {"online": true}\n\n`);
});
```

**Client:**
```javascript
const eventSource = new EventSource('/api/stream');

eventSource.addEventListener('update', (e) => {
  const data = JSON.parse(e.data);
  console.log('Update:', data.count);
});

eventSource.addEventListener('alert', (e) => {
  const data = JSON.parse(e.data);
  alert(data.message);
});

eventSource.addEventListener('status', (e) => {
  const data = JSON.parse(e.data);
  updateStatusIndicator(data.online);
});
```

---

## SSE for AI Streaming Text

SSE is **perfect for streaming AI responses** because:
1. One-way data flow (server → client)
2. Natural fit for progressive text generation
3. Simpler than WebSockets for this use case
4. Built-in reconnection handling

### OpenAI-Style Streaming Example

**Server (Node.js with OpenAI):**
```javascript
import OpenAI from 'openai';
const openai = new OpenAI();

app.post('/api/chat', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: req.body.message }],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        // Send each token as it arrives
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Signal completion
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});
```

**Client:**
```javascript
async function streamChat(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    
    // Process complete messages
    const lines = buffer.split('\n');
    buffer = lines.pop(); // Keep incomplete line in buffer

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          console.log('Stream complete');
          return;
        }
        
        const parsed = JSON.parse(data);
        displayToken(parsed.content); // Add to UI
      }
    }
  }
}

function displayToken(token) {
  document.getElementById('response').textContent += token;
}
```

---

## TextEncoder, TextDecoder, and ReadableStream

These Web APIs are crucial for handling streaming data:

### TextEncoder

Converts strings to UTF-8 byte arrays:

```javascript
const encoder = new TextEncoder();

const text = "Hello, World!";
const uint8Array = encoder.encode(text);
console.log(uint8Array); // Uint8Array(13) [72, 101, 108, 108, 111, ...]

// Useful for streaming
const stream = new ReadableStream({
  start(controller) {
    const chunk = encoder.encode("First chunk\n");
    controller.enqueue(chunk);
    
    const chunk2 = encoder.encode("Second chunk\n");
    controller.enqueue(chunk2);
    
    controller.close();
  }
});
```

### TextDecoder

Converts byte arrays back to strings:

```javascript
const decoder = new TextDecoder();

const uint8Array = new Uint8Array([72, 101, 108, 108, 111]);
const text = decoder.decode(uint8Array);
console.log(text); // "Hello"

// Stream mode (important for chunk processing)
const decoder2 = new TextDecoder();
const chunk1 = new Uint8Array([240, 159]); // Incomplete emoji
const chunk2 = new Uint8Array([152, 128]); // Rest of emoji

// Without stream: true, this would fail
console.log(decoder2.decode(chunk1, { stream: true })); // ""
console.log(decoder2.decode(chunk2)); // "😀"
```

**Why `{ stream: true }` matters:**
When processing chunks, a multi-byte character might be split across chunks. The `stream: true` option tells the decoder to buffer incomplete sequences.

### ReadableStream

A Web Streams API for handling streaming data:

```javascript
// Creating a custom ReadableStream
const stream = new ReadableStream({
  start(controller) {
    // Called immediately
    controller.enqueue('First chunk');
  },
  
  pull(controller) {
    // Called when consumer is ready for more data
    controller.enqueue('Next chunk');
    // controller.close(); // End stream
  },
  
  cancel(reason) {
    // Called if consumer cancels
    console.log('Stream cancelled:', reason);
  }
});

// Consuming a ReadableStream
const reader = stream.getReader();

async function read() {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    console.log('Received:', value);
  }
}

read();
```

---

## Complete AI Streaming Example with Streams API

Here's a production-ready implementation:

**Server (Express + OpenAI):**
```javascript
import OpenAI from 'openai';
import express from 'express';

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

app.post('/api/stream-chat', async (req, res) => {
  const { messages } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta;
      
      if (delta?.content) {
        const payload = {
          type: 'content',
          content: delta.content
        };
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
      }
      
      if (chunk.choices[0]?.finish_reason) {
        const payload = {
          type: 'done',
          reason: chunk.choices[0].finish_reason
        };
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
      }
    }

    res.end();
  } catch (error) {
    const errorPayload = {
      type: 'error',
      error: error.message
    };
    res.write(`data: ${JSON.stringify(errorPayload)}\n\n`);
    res.end();
  }

  req.on('close', () => {
    console.log('Client disconnected');
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

**Client (React Component):**
```javascript
import { useState, useRef } from 'react';

function ChatComponent() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setResponse('');
    setIsStreaming(true);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/stream-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: message }]
        }),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) throw new Error('Stream failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          setIsStreaming(false);
          break;
        }

        // Decode chunk (stream: true handles split characters)
        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE messages
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const data = JSON.parse(jsonStr);

              switch (data.type) {
                case 'content':
                  setResponse(prev => prev + data.content);
                  break;
                case 'done':
                  console.log('Stream finished:', data.reason);
                  break;
                case 'error':
                  console.error('Stream error:', data.error);
                  break;
              }
            } catch (err) {
              console.error('Parse error:', err);
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Stream cancelled by user');
      } else {
        console.error('Stream error:', error);
      }
      setIsStreaming(false);
    }
  }

  function handleCancel() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isStreaming}
        />
        <button type="submit" disabled={isStreaming}>
          Send
        </button>
        {isStreaming && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <div className="response">
        {response}
        {isStreaming && <span className="cursor">▊</span>}
      </div>
    </div>
  );
}
```

---

## Advanced Stream Processing Patterns

### 1. Transform Streams

Process data as it streams:

```javascript
const transformStream = new TransformStream({
  transform(chunk, controller) {
    // Modify chunk before passing it along
    const modified = chunk.toUpperCase();
    controller.enqueue(modified);
  }
});

// Pipe through transform
fetch('/api/stream')
  .then(response => response.body
    .pipeThrough(transformStream)
    .pipeTo(new WritableStream({
      write(chunk) {
        console.log('Transformed:', chunk);
      }
    }))
  );
```

### 2. Parsing SSE with Transform Streams

```javascript
class SSEParser extends TransformStream {
  constructor() {
    let buffer = '';
    
    super({
      transform(chunk, controller) {
        buffer += new TextDecoder().decode(chunk, { stream: true });
        
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            controller.enqueue(JSON.parse(data));
          }
        }
      },
      
      flush(controller) {
        if (buffer.startsWith('data: ')) {
          const data = buffer.slice(6);
          controller.enqueue(JSON.parse(data));
        }
      }
    });
  }
}

// Usage
fetch('/api/stream')
  .then(response => response.body
    .pipeThrough(new SSEParser())
    .pipeTo(new WritableStream({
      write(data) {
        console.log('Parsed SSE data:', data);
      }
    }))
  );
```

### 3. Backpressure Handling

Control flow when consumer is slower than producer:

```javascript
const stream = new ReadableStream({
  async start(controller) {
    for (let i = 0; i < 1000; i++) {
      // Check if queue is full
      if (controller.desiredSize <= 0) {
        // Wait for consumer to catch up
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      controller.enqueue(`Item ${i}`);
    }
    controller.close();
  }
}, {
  highWaterMark: 10 // Queue size limit
});
```

---

## SSE vs WebSockets vs Long Polling

| Feature | SSE | WebSockets | Long Polling |
|---------|-----|------------|--------------|
| Direction | Server → Client | Bidirectional | Client → Server → Client |
| Protocol | HTTP | WebSocket (ws://) | HTTP |
| Reconnection | Automatic | Manual | Manual |
| Browser Support | All modern | All modern | Universal |
| Complexity | Low | Medium | Low |
| Firewall/Proxy | Better | Can be blocked | Best |
| Use Case | Real-time updates, streaming | Chat, gaming | Compatibility fallback |

**When to use SSE:**
- Streaming AI responses
- Live feeds (news, stocks, notifications)
- Server monitoring dashboards
- Progress updates
- One-way data flow is sufficient

**When to use WebSockets:**
- Chat applications
- Multiplayer games
- Collaborative editing
- Need client → server messages

---

## Error Handling and Best Practices

### 1. Robust Error Handling

```javascript
const eventSource = new EventSource('/api/stream');
let reconnectAttempts = 0;
const maxReconnects = 5;

eventSource.onerror = (error) => {
  reconnectAttempts++;
  
  if (eventSource.readyState === EventSource.CONNECTING) {
    console.log(`Reconnecting... (${reconnectAttempts}/${maxReconnects})`);
    
    if (reconnectAttempts >= maxReconnects) {
      eventSource.close();
      console.error('Max reconnection attempts reached');
      showUserError('Connection lost. Please refresh.');
    }
  } else {
    console.error('EventSource error:', error);
  }
};

eventSource.onopen = () => {
  reconnectAttempts = 0; // Reset on successful connection
  console.log('Connected');
};
```

### 2. Heartbeat/Keep-Alive

Prevent connection timeouts:

```javascript
// Server
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  
  // Send comment (heartbeat) every 15 seconds
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 15000);
  
  // Send actual data
  const dataInterval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ time: Date.now() })}\n\n`);
  }, 5000);
  
  req.on('close', () => {
    clearInterval(heartbeat);
    clearInterval(dataInterval);
  });
});
```

### 3. Authentication with SSE

```javascript
// Client: Pass token in URL or use EventSource polyfill for headers
const token = 'your-auth-token';
const eventSource = new EventSource(`/api/stream?token=${token}`);

// Server: Validate token
app.get('/api/stream', (req, res) => {
  const token = req.query.token;
  
  if (!isValidToken(token)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  res.setHeader('Content-Type', 'text/event-stream');
  // ... rest of SSE logic
});

// For header-based auth, use fetch + ReadableStream instead
async function connectWithAuth(token) {
  const response = await fetch('/api/stream', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const reader = response.body.getReader();
  // ... process stream
}
```

---

## Performance Optimization

### 1. Efficient Data Encoding

```javascript
// Instead of sending individual fields
res.write(`data: ${JSON.stringify({ token: 'a' })}\n\n`);
res.write(`data: ${JSON.stringify({ token: 'b' })}\n\n`);

// Batch tokens
let buffer = [];
const flushInterval = setInterval(() => {
  if (buffer.length > 0) {
    res.write(`data: ${JSON.stringify({ tokens: buffer })}\n\n`);
    buffer = [];
  }
}, 50); // Flush every 50ms
```

### 2. Memory Management

```javascript
// Client: Limit stored history
const maxMessages = 100;
let messages = [];

eventSource.onmessage = (event) => {
  messages.push(event.data);
  
  if (messages.length > maxMessages) {
    messages = messages.slice(-maxMessages); // Keep last 100
  }
};
```

This covers SSE from fundamentals through advanced usage for AI streaming. The combination of SSE with TextEncoder/TextDecoder and ReadableStream provides a powerful, standards-based approach to real-time data streaming in web applications.