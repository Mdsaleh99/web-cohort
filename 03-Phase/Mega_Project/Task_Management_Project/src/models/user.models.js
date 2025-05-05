import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new Schema({
    avatar: {
        type: {
            url: String,
            localpath: String
        },
        default: {
            url: `https://placehold.co/600x400`,
            localpath: ""
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trime: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trime: true
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiry: {
        type: Date
    },
    refreshToken: {
        type: String
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationExpiry: {
        type: Date
    },
}, { timestamps: true })


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password) // this.password means userSchema k context ka password yani we have access of userSchema context
}
// isPasswordCorrect is a custom method and we are adding this method in 'methods' object.
// 'methods' property given by mongoose

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    );
}


userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
    );
}

userSchema.methods.generateEmailVerificationToken = function () {
    // .methods are for document instances only
    // in database we storing hashed token and for user we send unhashed token. when we want we compare both

    const unHashedToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20min
    this.emailVerificationToken = hashedToken;
    this.emailVerificationExpiry = tokenExpiry;

    return unHashedToken;
};


userSchema.methods.generateForgotPasswordToken = function () {
    // in database we storing hashed token and for user we send unhashed token. when we want we compare both

    const unHashedToken = crypto.randomBytes(20).toString("hex")

    const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex")

    const tokenExpiry = Date.now() + (20 * 60 * 1000)  // 20min

    this.forgotPasswordToken = hashedToken
    this.forgotPasswordExpiry = tokenExpiry

    return unHashedToken

}


userSchema.methods.generateTemporaryToken = function () {
    // in database we storing hashed token and for user we send unhashed token. when we want we compare both

    const unHashedToken = crypto.randomBytes(20).toString("hex")

    const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex")

    const tokenExpiry = Date.now() + (20 * 60 * 1000)  // 20min

    return {hashedToken, unHashedToken, tokenExpiry}

}

export const User = mongoose.model('User', userSchema)
export default User