import express from "express";
import axios from "axios";
import Redis from "ioredis";

const app = express();
const redis = new Redis({ host: "localhost", port: Number(6379) });

const PORT = process.env.PORT ?? 8000;

app.use(async function (req, res, next) {
    const key = 'rate-limit'
    const value = await redis.get(key)

    if (value === null) {
        await redis.set(key, 0)
        await redis.expire(key, 60)
    }

    if (Number(value) > 10) {
        return res.status(429).json({
            message: "Too many Requests"
        })
    }

    redis.incr(key)
    next()
})

app.get("/", (req, res) => {
    return res.json({ status: "success" });
});

app.get("/books", async (req, res) => {
    const response = await axios.get(
        "https://api.freeapi.app/api/v1/public/books"
    );
    return res.json(response.data);
});

app.get("/books/total", async (req, res) => {
    const cachedValue = await redis.get("totalPageValue")
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

    await redis.set("totalPageValue", totalPageCount)

    console.log("Cache Miss");

    return res.json(totalPageCount);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
