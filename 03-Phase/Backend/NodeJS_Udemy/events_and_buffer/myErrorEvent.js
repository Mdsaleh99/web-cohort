const EventEmitter = require('events');

const eventEmitter = new EventEmitter()

eventEmitter.on("error", (err) => {
    console.error(`Error occurred: ${err.message}`);
})

eventEmitter.emit("error", new Error("Something went wrong!"));