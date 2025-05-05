import express from "express"
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

const app = express()

// Needed to get __dirname in ES Module
// error happens because you're using ES modules (since your package.json has "type": "module"), and in ES modules:
// __dirname and __filename are not available by default like in CommonJS.

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/images", express.static(path.join(__dirname, "../public/images")));
app.use(cookieParser());

// router imports
import healthCheckRouter from "./routes/healthcheck.routes.js"
import authRoutes from "./routes/auth.routes.js"

app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/auth", authRoutes)


export default app