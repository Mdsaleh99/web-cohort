import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    console.log("Data is missing");
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // hash the password
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        verificationToken,
        phone,
      },
    });

    //
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Registration failed",
      error,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if ((!email, !password)) {
    return res.status(400).json({
      success: false,
      message: "All fields required",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invlid user",
      });
    }
    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "invlid email or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const cookieOptions = {
      httpOnly: true,
    };
    res.cookie("token", token, cookieOptions);
    return res.status(400).json({
      success: false,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      message: "invlid email or password",
    });
  } catch (error) {}
};
