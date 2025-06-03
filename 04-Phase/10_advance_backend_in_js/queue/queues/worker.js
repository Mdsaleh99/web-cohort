import { Worker } from "bullmq"
import {notificationQueue, QueueMap} from "./queue.js"
import { redisConnection } from "../connection.js";

const wait = (s) => new Promise((res) => setTimeout(res, s * 1000));

export const videoProcessingWorker = new Worker(QueueMap['VIDEO_PROCESSING_QUEUE'], async (job) => {
    console.log(`Processing job: ${job.id}`);
    console.log(`Transcoding Job: ${{ url: job.data }}`);
    
    await wait(10)
    console.log(`Transcoding Job Done....: ${{ url: job.data }}`);

    await notificationQueue.add(`notification-${job.data.videoUrl}`, {
        notification: 'Notification has been processed'
    })
    
    return true
}, {autorun: false, connection: redisConnection})

// by default this wroker always try to pull


export const notificationWorker = new Worker(QueueMap['NOTIFICATION_QUEUE'], async (job) => {
    console.log(`sending notification: ${job.data.notification}`);
    
}, {concurrency: 1, limiter: {max: 1, duration: 10 * 1000}})