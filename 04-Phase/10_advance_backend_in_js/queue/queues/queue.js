import { Queue } from "bullmq";
import { redisConnection } from "../connection.js";

export const QueueMap = {
    VIDEO_PROCESSING_QUEUE: "VIDEO_PROCESSING_QUEUE",
    NOTIFICATION_QUEUE: "NOTIFICATION_QUEUE",
};

export const videoProcessingQueue = new Queue(
    QueueMap["VIDEO_PROCESSING_QUEUE"],
    {connection: redisConnection}
);

export const notificationQueue = new Queue(
    QueueMap["NOTIFICATION_QUEUE"],
    {connection: redisConnection}
);
