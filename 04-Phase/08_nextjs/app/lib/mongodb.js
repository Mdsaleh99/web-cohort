import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
    throw new Error("Please define the mongodb String")
}

// global - it is work like variable.  it is like empty object and it is globalThis
// this global is like browser global which points to window object

let cached = global.mongoose

/*
    database states can be
        Connected
        Disconnected
        Connecting --- it is can be a promise
*/

if (!cached) {
    cached = global.mongoose = {conn: null, promise: null}
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const options = {
            bufferCommands: false,

        }
        mongoose.connect(process.env.MONGODB_URI, options)
            .then((mongoose) => {
                return mongoose
            })
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        cached.promise = null
    }

    return cached.conn
}

export default connectToDatabase