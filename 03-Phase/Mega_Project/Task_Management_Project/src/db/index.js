import mongoose from "mongoose"

const conntectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB Connection failed", error)
        process.exit(1) // it is os part so read about this line
    }
}

export default conntectDB