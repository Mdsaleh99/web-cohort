import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: `http://localhost:${PORT}`, credentials: true }));

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Auth API");
});

// Database connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
