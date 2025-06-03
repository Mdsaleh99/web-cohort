import express from 'express'
import { z } from 'zod'
import {videoProcessingQueue} from "./queues/queue.js"

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 8000

const requestVideoPostRequestSchema = z.object({
    videoUrl: z.string()
})

app.get('/', (req, res) => {
    return res.json({status: "Server is up and running"})
})


app.post("/video-process", async (req, res) => {
    const validationResult = await requestVideoPostRequestSchema.parseAsync(req.body)
    if (validationResult.error) {
        return res.status(400).json({error: validationResult.error})
    }

    const { videoUrl } = validationResult.data
    const job = await videoProcessingQueue.add(`video-${videoUrl}`, {videoUrl})

    return res.json({
        status: 'enqueued',
        jobId: job.id
    })

})

// redis should be up and running in port 6379, it finds automatically redis
// bullmq is wrapper on redis, to use redis like a queue

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})
