import bcrypt from "bcryptjs";
import { uploadOnImageKit } from "../middlewares/imagekit.middlewares.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail } from "../utils/mail.js";
import crypto from "crypto";

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, fullname } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new ApiError(
            409,
            "User with this email or username already exists",
        );
    }

    const newUser = await User.create({
        username,
        email,
        password,
        fullname,
    });

    if (!newUser) {
        throw new ApiError(403, "Failed to register user");
    }

    const avatarLocalPath = req.files?.avatar[0].path; // ye tarika hai multer se file lene ka,  aur ye abhi server par hai, image kit pe nhi gaya hai
    // console.log("image", avatarLocalPath);

    if (avatarLocalPath) {
        const userAvatar = await uploadOnImageKit(avatarLocalPath);
        newUser.avatar = {
            url: userAvatar?.url ?? "",
            localpath: avatarLocalPath ?? "",
        };
    }

    const emailVerificationToken = newUser.generateEmailVerificationToken();
    await newUser.save();

    //finding user with username and email
    const user = await User.findOne(
        { _id: newUser._id },
        { username: 1, fullname: 1, email: 1 },
    );

    if (!user) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user",
        );
    }

    const emailVerificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify-email/${emailVerificationToken}`;
    await sendEmail({
        email: newUser.email,
        subject: "Verify your email address",
        mailgenContent: emailVerificationMailgenContent(
            newUser.username,
            emailVerificationUrl,
        ),
    });

    return res
        .status(201)
        .json(new ApiResponse(201, "User registered successfully", newUser));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "user not found");
    }

    if (!user.isEmailVerified) {
        throw new ApiError(400, "Please verify Email before login");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Email or Password is wrong.");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    };

    user.refreshToken = refreshToken;
    user.save();

    res.status(200)
        .cookie("at", accessToken, cookieOptions)
        .cookie("rt", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    email,
                    fullname: user.fullname,
                    isEmailVerified: user.isEmailVerified,
                },
                "user Logged in successfully",
            ),
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    const user = await User.findByIdAndUpdate(
        { _id },
        { refreshToken: undefined },
        {new: true}
    );
    if (!user) {
        throw new ApiError(401, "User Not authorized");
    }

    res.status(200)
        .clearCookie("rt")
        .clearCookie("at")
        .json(new ApiResponse(200, null, "Logged out successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    console.log(token);
    if (!token) {
        throw new ApiError(400, "Token is required to verify email");
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        $and: [
            { emailVerificationToken: hashedToken },
            { emailVerificationExpiry: { $gt: Date.now() } }, // abhi joh time hai usse zayada hona chaihiye time iska matlab token expiry nhi hai.
        ],
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired token");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    await user.save();

    return res.status(200).json({
        message: "User verified successfully",
        success: true,
    });
});

const resendEmailVerification = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});


const resetForgottenPassword = asyncHandler(async (req, res) => {
    const { newPassword, confirmNewPassword } = req.body
    if()
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const forgotPasswordToken = user.generateForgotPasswordToken();
    const passwordResetUrl = `${process.env.BASE_URL}/api/v1/auth/reset-password/${user._id}/${forgotPasswordToken}`;

    await user.save();
    await sendEmail({
        email,
        subject: "Reset Password link",
        mailgenContent: forgotPasswordMailgenContent(
            user.fullname,
            passwordResetUrl,
        ),
    });

    return res.status(200).json(new ApiResponse(200, null, "Check Your Inbox"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    //validation
});

export {
    changeCurrentPassword,
    forgotPasswordRequest,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resendEmailVerification,
    resetForgottenPassword,
    verifyEmail,
};
