import { notificationWorker } from "./queues/worker.js"

async function init() {
    await notificationWorker.run()
}

init()