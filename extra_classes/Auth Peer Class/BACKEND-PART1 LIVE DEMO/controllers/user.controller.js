import User from "../models/user.models.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/sendingMail.utils.js";
import jwt from "jsonwebtoken";

// Register user controller
const registerUser = async (req, res) => {
  // 1. Get user data from request body
  const { name, email, password } = req.body;

  // 2. validate the inputs
  if (!email || !name || !password) {
    return res.status(400).json({
      status: false,
      message: "All fields are required",
    });
  }

  // password validation
  if (password.length < 6) {
    return res.status(400).json({
      status: false,
      message: "Password must be at least 6 characters long",
    });
  }

  try {
    // 3. Check if user already exists in DB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }

    // 4. hashing of password is done in the User model using pre-save hook middleware

    // 5. generate a verification token and expiry time
    const token = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = Date.now() + 10 * 60 * 1000;

    // 6. now create a new user
    const user = await User.create({
      name,
      email,
      password,
      verificationToken: token,
      verificationTokenExpiry: verificationTokenExpiry,
    });

    // 6. check if user is created
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User registration failed",
      });
    }

    // 7. verify the user email address by sending a token to the user's email address
    await sendVerificationEmail(user.email, user.verificationToken);

    // 8. send response
    return res.status(201).json({
      status: true,
      message: "User registered successfully, please verify your email address",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("User registration failed", error);
    return res.status(500).json({
      status: false,
      message: "User registration failed",
    });
  }
};

// Verify user email address controller
const verify = async (req, res) => {
  try {
    // 1. get verification token from request params means from URL
    const token = req.params.token;

    // 2. find the user with the verification token in DB
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    // 3. check if user exists
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid or expired verification token",
      });
    }

    // 4. update user isVerified status and remove verification token
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    // 5. send response
    return res.status(200).json({
      status: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email verification failed", error);
    return res.status(500).json({
      status: false,
      message: "Email verification failed",
    });
  }
};

// Login user controller
const login = async (req, res) => {
  // 1. get user data from request body
  const { email, password } = req.body;

  // 2. validate the inputs
  if (!email || !password) {
    return res.status(400).json({
      status: false,
      message: "All fields are required",
    });
  }

  try {
    // 3. check if user exists in DB with the provided email
    const user = await User.findOne({ email });

    // 4. check if user exists
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid email or password",
      });
    }

    // 5. Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({
        status: false,
        message: "Please verify your email address",
      });
    }

    // 6. compare the password
    const isPasswordMatch = await user.comparePassword(password);

    // 7. check if password is correct
    if (!isPasswordMatch) {
      return res.status(400).json({
        status: false,
        message: "Invalid email or password",
      });
    }

    


    // / 8. create a JWT token for the user to access protected routes
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESSTOKEN_SECRET, {
      expiresIn: process.env.ACCESSTOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESHTOKEN_SECRET, {
      expiresIn: process.env.REFRESHTOKEN_EXPIRY,
    });
    user.refreshToken=refreshToken

    await user.save();
    // 9. set cookie
    const cookieOptions = {
      httpOnly: true,
    };

    // res.cookie("jwtToken", jwtToken, cookieOptions);
    res.cookie("aceessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    // 10. send response
    return res.status(200).json({
      status: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error("User login failed", error);
    return res.status(500).json({
      status: false,
      message: "User login failed",
    });
  }
};

// get user profile controller
const getProfile = async (req, res) => {
  try {
    // 1. get user id from request object
    const userId = req.user.id;

    // 2. find user by id
    const user = await User.findById(userId).select("-password");

    // check if user exists
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    // 3. send response
    return res.status(200).json({
      status: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error getting user profile", error);
    return res.status(500).json({
      status: false,
      message: "Error getting user profile",
    });
  }
};

// logout user controller
const logout = async (req, res) => {
  const token=req.cookies.refreshToken;
  if(!token){
    return res.status(401).json({
      status: false,
      message: "Unauthorized access",
    });
  }
  
  try {
    // // 1. check if user is logged in
    // if (!req.user) {
    //   return res.status(401).json({
    //     status: false,
    //     message: "Unauthorized access",
    //   });
    // }
    const refreshDecoded= jwt.verify(token,process.env.REFRESHTOKEN_SECRET)
  const user =await User.findOne({_id:refreshDecoded.id});

  if(!user){
    return res.status(401).json({
      status: false,
      message: "Unauthorized access",
    });
  }
  user.refreshToken=null;
    // 2. clear cookie
    res.cookie("accessToken", "", {
      httpOnly: true,
    });
    res.cookie("refreshToken", "", {
      httpOnly: true,
    });
    


    // 3. send response
    return res.status(200).json({
      status: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("User logout failed", error);
    return res.status(500).json({
      status: false,
      message: "User logout failed",
    });
  }
};

export { registerUser, verify, login, getProfile, logout };
