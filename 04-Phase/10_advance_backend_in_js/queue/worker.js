import { videoProcessingWorker } from "./queues/worker.js"

async function init() {
    await videoProcessingWorker.run()
}

init()