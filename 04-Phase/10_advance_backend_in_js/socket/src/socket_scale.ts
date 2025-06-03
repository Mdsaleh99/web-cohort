import express from "express";
import axios from "axios";
import Redis from "ioredis";
import http from "http"
import { Server } from "socket.io";

const app = express(); // Express Server
const httpServer = http.createServer(app) // Http Server (Express Server ko mount kardiya http k upper)


const PORT = process.env.PORT ?? 8080;
// const state = new Array(100).fill(false)
app.use(express.static("./public"));
const io = new Server() // Socket Server
io.attach(httpServer)

const redis = new Redis({ host: "localhost", port: Number(6379) }); // for read & write
const publisher = new Redis({ host: "localhost", port: Number(6379) }); // for publish
const subscriber = new Redis({ host: "localhost", port: Number(6379) }); // for subscribe

redis.setnx('state', JSON.stringify(new Array(100).fill(false)))

subscriber.subscribe('server:broker')
subscriber.on('message', (channel, message) => {
    const { event, data } = JSON.parse(message)
    io.emit(event, data) // Relay kardo
})

// Socket io handlers
io.on("connection", (socket) => { // The socket here represents a single connected client.When a user opens your website and connects via Socket.IO, the server creates a unique socket for that user.      Each socket has: a unique id, methods like .on() and .emit() for communication

    console.log(`Socket connected`, socket.id);  
    // socket.emit("hello")
    socket.on("messages", (msg) => {
        io.emit('server-message', msg) // saare connected socket means client ko data send karega - (Boardcast to all the connected clients)
    })

    socket.on('checkbox-update', async (data) => {
        const state = await redis.get('state')
        if (state) {
            const parsedState = JSON.parse(state)
            await redis.set('state', JSON.stringify(parsedState))
        }
        await publisher.publish('server:broker', JSON.stringify({event: 'checkbox-update', data}))
        // state[data.index] = data.value
        // io.emit('checkbox-update', data)
    })
})


// on – Listening for Events, Use: To listen for events sent from the client
// emit – Sending Events,   Use: To send events (and data) to the client
// io.on("connection", ...) is triggered every time a client connects.







app.use(async function (req, res, next) {
    const key = "rate-limit";
    const value = await redis.get(key);

    if (value === null) {
        await redis.set(key, 0);
        await redis.expire(key, 60);
    }

    if (Number(value) > 2000) {
        return res.status(429).json({
            message: "Too many Requests",
        });
    }

    redis.incr(key);
    next();
});

app.get("/", (req, res) => {
    return res.json({ status: "success" });
});

app.get('/state', async(req, res) => {
    const state = await redis.get('state')
    if (state) {
        const parsedState = JSON.parse(state)
        return res.json({state: parsedState})
    }
    return res.json({state: []})
})

app.get("/books", async (req, res) => {
    const response = await axios.get(
        "https://api.freeapi.app/api/v1/public/books"
    );
    return res.json(response.data);
});

app.get("/books/total", async (req, res) => {
    const cachedValue = await redis.get("totalPageValue");
    // check cache
    if (cachedValue) {
        console.log("Cache Hit");
        return res.json({ totalPageCount: Number(cachedValue) });
    }

    const response = await axios.get(
        "https://api.freeapi.app/api/v1/public/books"
    );

    const totalPageCount = response?.data?.data?.data?.reduce(
        (acc: number, curr: { volumeInfo?: { pageCount?: number } }) =>
            !curr.volumeInfo?.pageCount ? 0 : curr.volumeInfo?.pageCount + acc,
        0
    );

    await redis.set("totalPageValue", totalPageCount);

    console.log("Cache Miss");

    return res.json(totalPageCount);
});

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`))