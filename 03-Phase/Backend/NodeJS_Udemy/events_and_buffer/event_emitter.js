const { log } = require("console");
const EventEmitter = require("events")

const eventEmitter = new EventEmitter()

eventEmitter.on("greet", () => {
    console.log(`Hello and welcome to events in nodejs`);
})

eventEmitter.on("greet", () => {
    console.log(`Hey and welcome to events in nodejs`);
})

eventEmitter.on("greet2", (userName) => {
    console.log(`Hello ${userName} and welcome to events in nodejs`);
})

// Emit the event
// eventEmitter.emit("greet");
// eventEmitter.emit("greet2", "saleh"); // saleh is argument for the event

eventEmitter.once("pushnotification", () => {
    console.log(`You have a new push notification`);
})


// Emit the event
eventEmitter.emit("greet");
eventEmitter.emit("greet");
eventEmitter.emit("pushnotification"); // This will only log once
eventEmitter.emit("pushnotification"); // This will not log
eventEmitter.emit("greet2", "saleh");



const myListener = () => console.log("Test listener");
eventEmitter.on("test", myListener);
eventEmitter.emit("test");
eventEmitter.removeListener("test", myListener);
eventEmitter.emit("test"); // This will not log because the listener has been removed

console.log(eventEmitter.listeners("test"));
console.log(eventEmitter.listeners("greet"));
