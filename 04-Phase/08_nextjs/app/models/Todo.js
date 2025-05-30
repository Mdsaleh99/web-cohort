import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    isRecorded: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

todoSchema.pre('save', function (next) {
    this.updatedAt = Date.now()
    next()
})

export default mongoose.model.Todo || mongoose.model("Todo", todoSchema)